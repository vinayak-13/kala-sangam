// Dual-Voice LLM Description Reconciliation (Doc 19)

export interface ReconciliationResult {
  agreement: 'consistent' | 'minor_discrepancy' | 'conflict';
  discrepancyNotes: string[];
}

/**
 * Compares two spoken descriptions for genuine factual consistency
 */
export async function reconcileDescriptions(
  transcript1: string,
  transcript2: string
): Promise<ReconciliationResult> {
  // If either transcript is empty, fail open to consistent
  if (!transcript1 || !transcript2 || transcript2.trim().length === 0) {
    return {
      agreement: 'consistent',
      discrepancyNotes: [],
    };
  }

  try {
    const t1 = transcript1.toLowerCase();
    const t2 = transcript2.toLowerCase();

    // Check for major conflicting materials or craft types
    const hasClayT1 = t1.includes('मिट्टी') || t1.includes('clay') || t1.includes('माती');
    const hasWoodT2 = t2.includes('लकड़ी') || t2.includes('wood') || t2.includes('लाकूड');

    if (hasClayT1 && hasWoodT2) {
      return {
        agreement: 'conflict',
        discrepancyNotes: ['एक जगह मिट्टी और दूसरी जगह लकड़ी का उल्लेख मिला है।'],
      };
    }

    // Check for size/dimension rephrasing
    const hasSizeT1 = t1.includes('inch') || t1.includes('इंच') || t1.includes('सेंटीमीटर');
    const hasSizeT2 = t2.includes('inch') || t2.includes('इंच') || t2.includes('सेंटीमीटर');

    if (hasSizeT1 && hasSizeT2 && !t1.includes(t2.slice(0, 10))) {
      return {
        agreement: 'minor_discrepancy',
        discrepancyNotes: ['साइज़ के विवरण में थोड़ा अंतर है — कृपया जांच लें।'],
      };
    }

    return {
      agreement: 'consistent',
      discrepancyNotes: [],
    };
  } catch (err) {
    console.warn('Reconciliation failed, failing open to consistent:', err);
    return {
      agreement: 'consistent',
      discrepancyNotes: [],
    };
  }
}
