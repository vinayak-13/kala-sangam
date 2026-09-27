/**
 * Village Craft Cluster Collective Capacity Matching Service
 * Implements DRD B2B Two-Channel Routing & Collective Capacity Matching Algorithm
 */

export interface ClusterArtisan {
  id: string;
  name: string;
  pehchanId: string;
  dailyCapacityUnits: number;
  qualityRating: number;
  allocatedQuota: number;
  payoutPaise: number;
}

export interface ClusterMatchingResult {
  clusterId: string;
  clusterName: string;
  state: string;
  giTagNumber: string;
  totalRequestedUnits: number;
  collectiveDailyCapacityUnits: number;
  estimatedLeadDays: number;
  totalOrderValuePaise: number;
  unitPricePaise: number;
  escrowDepositRequiredPaise: number;
  artisanAllocations: ClusterArtisan[];
}

export class ClusterCapacityService {
  /**
   * Calculates collective capacity split for large volume enterprise RFQs
   */
  public static calculateClusterSplit(
    requestedUnits: number,
    unitPricePaise: number,
    clusterType: 'warli' | 'pashmina' | 'dhokra' | 'chanderi' = 'warli'
  ): ClusterMatchingResult {
    const rawUnits = Math.max(10, requestedUnits);
    const safeUnitPrice = Math.max(10000, unitPricePaise); // min ₹100
    const totalOrderValuePaise = rawUnits * safeUnitPrice;

    let clusterName = 'पालघर वारli हस्तशिल्प क्लस्टर (Palghar Warli Cluster)';
    let state = 'Maharashtra';
    let giTagNumber = 'GI-372';

    let baseArtisans: Array<{ name: string; pehchan: string; dailyCap: number; rating: number }> = [
      { name: 'सुनील वाघ (Sunil Wagh)', pehchan: 'MH-04-1849', dailyCap: 3, rating: 4.9 },
      { name: 'रमेश वालवी (Ramesh Valvi)', pehchan: 'MH-04-2012', dailyCap: 2, rating: 4.8 },
      { name: 'अंजना तंबोली (Anjana Tamboli)', pehchan: 'MH-04-3310', dailyCap: 4, rating: 5.0 },
      { name: 'दिलीप कुरहाड़े (Dilip Kurhade)', pehchan: 'MH-04-4190', dailyCap: 3, rating: 4.7 },
      { name: 'मंगला मोरे (Mangala More)', pehchan: 'MH-04-5521', dailyCap: 3, rating: 4.9 },
    ];

    if (clusterType === 'pashmina') {
      clusterName = 'श्रीनगर पश्मीना वीवर्स क्लस्टर (Srinagar Pashmina Cluster)';
      state = 'Jammu & Kashmir';
      giTagNumber = 'GI-46';
      baseArtisans = [
        { name: 'गुलाम नबी (Ghulam Nabi)', pehchan: 'JK-01-0921', dailyCap: 1, rating: 5.0 },
        { name: 'मुश्ताक अहमद (Mushtaq Ahmed)', pehchan: 'JK-01-1144', dailyCap: 1, rating: 4.9 },
        { name: 'बिलाल डार (Bilal Dar)', pehchan: 'JK-01-2290', dailyCap: 2, rating: 4.8 },
        { name: 'तारिक लोन (Tariq Lone)', pehchan: 'JK-01-3810', dailyCap: 1, rating: 4.7 },
      ];
    }

    const collectiveDaily = baseArtisans.reduce((sum, a) => sum + a.dailyCap, 0);
    const estimatedLeadDays = Math.ceil(rawUnits / collectiveDaily) + 3; // +3 days buffer for QC & packing

    // Distribute quotas proportionally
    let remainingUnits = rawUnits;
    const allocations: ClusterArtisan[] = baseArtisans.map((artisan, index) => {
      const isLast = index === baseArtisans.length - 1;
      const weight = artisan.dailyCap / collectiveDaily;
      const quota = isLast ? remainingUnits : Math.min(remainingUnits, Math.round(rawUnits * weight));
      remainingUnits -= quota;

      const payout = quota * safeUnitPrice;

      return {
        id: `artisan-cluster-${index + 1}`,
        name: artisan.name,
        pehchanId: artisan.pehchan,
        dailyCapacityUnits: artisan.dailyCap,
        qualityRating: artisan.rating,
        allocatedQuota: quota,
        payoutPaise: payout,
      };
    });

    return {
      clusterId: `cluster-${clusterType}-01`,
      clusterName,
      state,
      giTagNumber,
      totalRequestedUnits: rawUnits,
      collectiveDailyCapacityUnits: collectiveDaily,
      estimatedLeadDays,
      totalOrderValuePaise,
      unitPricePaise: safeUnitPrice,
      escrowDepositRequiredPaise: Math.round(totalOrderValuePaise * 0.3), // 30% advance escrow
      artisanAllocations: allocations,
    };
  }
}
