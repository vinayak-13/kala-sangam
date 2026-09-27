import { syncRepo } from '@/server/repos/sync-repo';
import { productRepo } from '@/server/repos/product-repo';
import type { SyncBatchPayload } from '@/lib/validation';

export interface SyncBatchResultItem {
  clientTempId: string;
  status: 'created' | 'duplicate' | 'failed';
  productId?: string;
  error?: string;
}

export const syncService = {
  async processBatch(artisanId: string, payload: SyncBatchPayload): Promise<{ results: SyncBatchResultItem[] }> {
    const results: SyncBatchResultItem[] = [];

    for (const event of payload.events) {
      try {
        const { isDuplicate } = await syncRepo.recordSyncEvent(artisanId, event.clientTempId, event.kind);

        if (isDuplicate) {
          results.push({
            clientTempId: event.clientTempId,
            status: 'duplicate',
          });
          continue;
        }

        // Create product from offline capture payload
        const draft = await productRepo.createDraft(artisanId);
        if (event.payload.draftTitle) {
          await productRepo.update(draft.id, {
            title: { en: event.payload.draftTitle, hi: event.payload.draftTitle },
          });
        }

        results.push({
          clientTempId: event.clientTempId,
          status: 'created',
          productId: draft.id,
        });
      } catch (err) {
        results.push({
          clientTempId: event.clientTempId,
          status: 'failed',
          error: err instanceof Error ? err.message : 'Unknown sync error',
        });
      }
    }

    return { results };
  },
};
