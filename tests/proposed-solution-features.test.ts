import { describe, it, expect } from 'vitest';
import { parseBhashiniVoiceTranscript } from '../src/server/ai/bhashini-cataloger';
import { ClusterCapacityService } from '../src/server/services/cluster-capacity.service';
import { OfflineSyncQueue } from '../src/lib/offline/offline-sync-queue';

describe('Proposed Solution Features & Execution Plan Verification', () => {
  describe('Multilingual Auto-Cataloger (Bhashini AI)', () => {
    it('extracts structured attributes from Pashmina craft voice note', () => {
      const transcript = 'Yeh pure Kashmiri pashmina shawl hai jo 100 count charkha par buni gayi hai';
      const result = parseBhashiniVoiceTranscript(transcript, 'hi');

      expect(result.category).toContain('Handloom');
      expect(result.craftSubtype).toContain('Pashmina');
      expect(result.giRegion).toContain('Srinagar');
      expect(result.hoursSpent).toBe(72);
      expect(result.calculatedFairPricePaise).toBeGreaterThan(250000);
      expect(Number.isInteger(result.calculatedFairPricePaise)).toBe(true);
    });

    it('extracts Warli Folk Art attributes with integer paise pricing calculations', () => {
      const transcript = 'Yeh tarpa dance warli painting hai geru mitti se bani';
      const result = parseBhashiniVoiceTranscript(transcript, 'hi');

      expect(result.category).toContain('Folk Painting');
      expect(result.craftSubtype).toContain('Warli');
      expect(result.rawMaterialCostPaise).toBe(45000);
      expect(result.fairLaborRatePerHourPaise).toBe(9000);
      expect(result.suggestedMaxPricePaise).toBeGreaterThan(result.calculatedFairPricePaise);
    });
  });

  describe('Two-Channel B2B Capacity Splitter (ClusterCapacityService)', () => {
    it('splits enterprise bulk order across village cluster artisans with zero remainder', () => {
      const requestedUnits = 300;
      const unitPricePaise = 200000; // ₹2,000

      const result = ClusterCapacityService.calculateClusterSplit(requestedUnits, unitPricePaise, 'warli');

      expect(result.totalRequestedUnits).toBe(300);
      expect(result.artisanAllocations.length).toBeGreaterThanOrEqual(4);

      // Sum of allocated quotas must match requested units exactly
      const totalAllocated = result.artisanAllocations.reduce((sum, a) => sum + a.allocatedQuota, 0);
      expect(totalAllocated).toBe(300);

      // Sum of payouts must equal total order value
      const totalPayout = result.artisanAllocations.reduce((sum, a) => sum + a.payoutPaise, 0);
      expect(totalPayout).toBe(result.totalOrderValuePaise);

      // Payouts must be integers (paise)
      result.artisanAllocations.forEach((artisan) => {
        expect(Number.isInteger(artisan.payoutPaise)).toBe(true);
        expect(artisan.payoutPaise).toBeGreaterThan(0);
      });
    });

    it('calculates accurate lead time days based on collective daily capacity', () => {
      const result = ClusterCapacityService.calculateClusterSplit(150, 150000, 'warli');
      expect(result.collectiveDailyCapacityUnits).toBe(15);
      expect(result.estimatedLeadDays).toBe(Math.ceil(150 / 15) + 3); // 13 days
      expect(result.escrowDepositRequiredPaise).toBe(Math.round(result.totalOrderValuePaise * 0.3));
    });
  });

  describe('Offline Cache & Sync Queue', () => {
    it('handles queue operations safely in non-browser environment', async () => {
      const queue = OfflineSyncQueue.getQueue();
      expect(Array.isArray(queue)).toBe(true);

      const syncResult = await OfflineSyncQueue.processSyncQueue();
      expect(syncResult).toHaveProperty('syncedCount');
      expect(syncResult).toHaveProperty('failedCount');
    });
  });
});
