import { supabase, isSupabaseConfigured } from './supabase-client';
import type { SyncEvent } from '@/lib/db/types';

const memorySyncEvents = new Map<string, SyncEvent>();

export const syncRepo = {
  async recordSyncEvent(artisanId: string, clientTempId: string, payloadKind: string): Promise<{ isDuplicate: boolean; event: SyncEvent }> {
    const key = `${artisanId}:${clientTempId}`;
    const existing = memorySyncEvents.get(key);
    if (existing) {
      return { isDuplicate: true, event: existing };
    }

    const newEvent: SyncEvent = {
      id: crypto.randomUUID(),
      artisan_id: artisanId,
      client_temp_id: clientTempId,
      payload_kind: payloadKind,
      synced_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('sync_events') as any).insert(newEvent).select().single();
        if (!error && data) {
          memorySyncEvents.set(key, data as unknown as SyncEvent);
          return { isDuplicate: false, event: data as unknown as SyncEvent };
        }
        if (error && error.code === '23505') {
          return { isDuplicate: true, event: newEvent };
        }
      } catch {
        // fallback
      }
    }

    memorySyncEvents.set(key, newEvent);
    return { isDuplicate: false, event: newEvent };
  },
};
