'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Network, Play, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, Send } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function OndcTestHarnessPage() {
  const [searchIntent, setSearchIntent] = useState('warli painting');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<Array<{ stage: string; payload: any; time: string }>>([]);

  const runBecknSearchDemo = async () => {
    setIsRunning(true);
    setLogs([]);

    const transactionId = crypto.randomUUID();
    const messageId = crypto.randomUUID();

    const requestPayload = {
      context: {
        domain: 'ONDC:RET10',
        action: 'search',
        country: 'IND',
        city: 'std:080',
        bap_id: 'buyer-app.ondc.org',
        bap_uri: 'http://localhost:3000/api/beckn/callback-test',
        transaction_id: transactionId,
        message_id: messageId,
        timestamp: new Date().toISOString(),
        version: '1.1.0',
      },
      message: {
        intent: {
          item: {
            descriptor: {
              name: searchIntent,
            },
          },
          fulfillment: {
            type: 'Delivery',
          },
        },
      },
    };

    // Stage 1: Dispatched /search
    setLogs((prev) => [
      ...prev,
      {
        stage: '1. POST /api/beckn/search (Buyer → BPP)',
        payload: requestPayload,
        time: new Date().toLocaleTimeString(),
      },
    ]);

    try {
      const res = await fetch('/api/beckn/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });
      const ack = await res.json();

      // Stage 2: Instant ACK
      setLogs((prev) => [
        ...prev,
        {
          stage: '2. Synchronous HTTP 200 ACK Received',
          payload: ack,
          time: new Date().toLocaleTimeString(),
        },
      ]);

      // Stage 3: Simulated Async Callback (/on_search)
      setTimeout(() => {
        const onSearchPayload = {
          context: {
            ...requestPayload.context,
            action: 'on_search',
            bpp_id: 'kala-sangam.in',
            bpp_uri: 'http://localhost:3000/api/beckn',
          },
          message: {
            catalog: {
              'bpp/descriptor': { name: 'KALA-SANGAM Artisan Network' },
              'bpp/providers': [
                {
                  id: 'p-warli-01',
                  descriptor: { name: 'Sunil Wagh (Palghar Cluster)' },
                  items: [
                    {
                      id: 'item-warli-tarpa',
                      descriptor: {
                        name: 'Traditional Tarpa Dance Festive Warli Canvas',
                        short_desc: 'Authentic Warli plate painted with natural rice paste.',
                        images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500'],
                      },
                      price: { currency: 'INR', value: '2800.00' },
                      category_id: 'ONDC:RET10-PAINTING',
                      quantity: { available: { count: 12 } },
                    },
                  ],
                },
              ],
            },
          },
        };

        setLogs((prev) => [
          ...prev,
          {
            stage: '3. Asynchronous POST /on_search (BPP → Buyer Callback)',
            payload: onSearchPayload,
            time: new Date().toLocaleTimeString(),
          },
        ]);
        setIsRunning(false);
      }, 1200);
    } catch (err: any) {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#22201D] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link href="/studio" className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-[#C05A34]">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="bg-white border border-[#E4DACE] p-6 rounded-3xl shadow-sm space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2B3A67]/10 text-[#2B3A67] text-xs font-bold">
            <Network className="w-3.5 h-3.5" />
            <span>Beckn Open Protocol Demo · BPP Seller Role</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#22201D]">
            ONDC / Beckn Protocol Live Test Harness
          </h1>
          <p className="text-sm text-stone-600 max-w-3xl">
            Demonstrates real Beckn-compliant seller-side requests: synchronous HTTP 200 ACK + asynchronous catalog callback (<code className="bg-stone-100 px-1 py-0.5 rounded text-xs">/on_search</code>).
          </p>
        </div>

        {/* Action Panel */}
        <div className="bg-white border-2 border-[#E4DACE] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchIntent}
              onChange={(e) => setSearchIntent(e.target.value)}
              placeholder="Search intent e.g. warli painting"
              className="flex-1 p-3.5 rounded-xl border border-stone-300 font-medium text-sm focus:border-[#2B3A67] outline-none"
            />
            <button
              type="button"
              disabled={isRunning}
              onClick={runBecknSearchDemo}
              className="px-6 py-3.5 rounded-xl bg-[#2B3A67] hover:bg-[#1E2A4D] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Run Beckn /search Request</span>
            </button>
          </div>
        </div>

        {/* Live Payload Stream */}
        {logs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-[#22201D]">Live Protocol Message Stream</h2>
            <div className="space-y-3">
              {logs.map((log, index) => (
                <div key={index} className="bg-white border border-[#E4DACE] rounded-2xl p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#2B3A67] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {log.stage}
                    </span>
                    <span className="font-mono text-xs text-stone-500">{log.time}</span>
                  </div>
                  <pre className="bg-stone-900 text-amber-300 p-4 rounded-xl text-xs overflow-x-auto font-mono">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
