'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, CloudUpload } from 'lucide-react';
import { OfflineSyncQueue, OfflineDraftItem } from '@/lib/offline/offline-sync-queue';
import { playUiBeep } from '@/lib/audio-utils';

export function OfflineSyncBadge() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const updateCounts = () => {
    const queue = OfflineSyncQueue.getQueue();
    const pending = queue.filter((i) => i.syncStatus === 'pending' || i.syncStatus === 'failed');
    setPendingCount(pending.length);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      updateCounts();

      const handleOnline = () => {
        setIsOnline(true);
        // Trigger auto sync on reconnect
        handleSync();
      };
      const handleOffline = () => setIsOnline(false);
      const handleQueueUpdate = () => updateCounts();

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('kala_offline_queue_updated', handleQueueUpdate);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('kala_offline_queue_updated', handleQueueUpdate);
      };
    }
  }, []);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    playUiBeep('ready');

    await new Promise((r) => setTimeout(r, 1200));
    await OfflineSyncQueue.processSyncQueue();
    setIsSyncing(false);
    playUiBeep('success');
    updateCounts();
  };

  if (isOnline && pendingCount === 0) {
    return null; // Silent when everything is synchronized
  }

  return (
    <div className="fixed bottom-20 left-4 z-40 bg-white border-2 border-[#E6DCCF] rounded-2xl p-2.5 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <span className="flex items-center gap-1.5 text-xs font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-xl border border-rose-200">
            <WifiOff className="w-3.5 h-3.5" />
            <span>ऑफ़लाइन मोड (Offline)</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xl border border-emerald-200">
            <Wifi className="w-3.5 h-3.5" />
            <span>ऑनलाइन</span>
          </span>
        )}

        {pendingCount > 0 && (
          <span className="text-xs font-bold text-[#9D3E1B]">
            {pendingCount} ड्राफ्ट सिंक बाकी (Unsynced)
          </span>
        )}
      </div>

      {isOnline && pendingCount > 0 && (
        <button
          type="button"
          onClick={handleSync}
          disabled={isSyncing}
          className="px-3 py-1 bg-[#9D3E1B] hover:bg-[#802906] text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs transition active:scale-95"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'सिंक हो रहा है...' : 'अभी सिंक करें (Sync)'}</span>
        </button>
      )}
    </div>
  );
}
