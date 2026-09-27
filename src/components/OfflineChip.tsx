'use client';

import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export function OfflineChip() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const checkQueue = async () => {
    try {
      const queue = (await get<unknown[]>('ks_offline_queue')) || [];
      setPendingCount(queue.length);
    } catch {
      // ignore
    }
  };

  const flushQueue = async () => {
    if (!navigator.onLine || isSyncing) return;
    try {
      const queue = (await get<Array<{ clientTempId: string; kind: string; capturedAt: string; payload: { photos: string[]; audio: string; draftTitle?: string } }>>('ks_offline_queue')) || [];
      if (queue.length === 0) return;

      setIsSyncing(true);
      const res = await fetch('/api/sync/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: queue }),
      });

      if (res.ok) {
        await set('ks_offline_queue', []);
        setPendingCount(0);
      }
    } catch (err) {
      console.error('Offline flush error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    setIsOnline(navigator.onLine);
    void checkQueue();

    const handleOnline = () => {
      setIsOnline(true);
      void flushQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    const interval = setInterval(() => void checkQueue(), 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md transition-all duration-300"
      style={{
        backgroundColor: !isOnline
          ? '#FEF3C7'
          : pendingCount > 0
          ? '#FEF08A'
          : '#DCFCE7',
        color: !isOnline ? '#92400E' : pendingCount > 0 ? '#854D0E' : '#166534',
        border: `1px solid ${!isOnline ? '#FCD34D' : pendingCount > 0 ? '#FACC15' : '#86EFAC'}`,
      }}
      role="status"
      aria-live="polite"
    >
      {!isOnline ? (
        <>
          <WifiOff className="w-3.5 h-3.5 text-[#B45309]" />
          <span>Offline — saved on this phone</span>
        </>
      ) : pendingCount > 0 ? (
        <>
          <RefreshCw className={`w-3.5 h-3.5 text-[#A16207] ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{pendingCount} waiting to upload</span>
        </>
      ) : (
        <>
          <Wifi className="w-3.5 h-3.5 text-[#15803D]" />
          <span>Online</span>
        </>
      )}
    </div>
  );
}
