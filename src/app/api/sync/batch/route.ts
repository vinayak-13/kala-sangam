import { NextRequest } from 'next/server';
import { syncBatchSchema } from '@/lib/validation';
import { syncService } from '@/server/services/sync-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = syncBatchSchema.parse(body);
    const data = await syncService.processBatch('c1111111-0000-0000-0000-000000000001', validated);
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}
