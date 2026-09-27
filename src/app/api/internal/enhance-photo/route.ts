import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/errors/api-response';
import { enhancePhoto } from '@/server/ai/enhancement/pipeline';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mediaId, sourceDataUrl } = body;

    if (!mediaId) {
      return errorResponse('VALIDATION_FAILED', 'mediaId is required', 400);
    }

    const result = await enhancePhoto(mediaId, sourceDataUrl || '');
    return successResponse(result);
  } catch (err: unknown) {
    return handleApiError(err);
  }
}
