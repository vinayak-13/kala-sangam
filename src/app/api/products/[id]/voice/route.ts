import { NextRequest } from 'next/server';
import { voicePipelineService } from '@/server/services/voice-pipeline-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: productId } = await params;
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    const localeHint = (formData.get('locale') as string) || 'hi';

    const buffer = audioFile ? Buffer.from(await audioFile.arrayBuffer()) : Buffer.from('mock-audio');
    const mimeType = audioFile?.type || 'audio/webm';

    const result = await voicePipelineService.startVoiceUpload({
      productId,
      artisanId: 'c1111111-0000-0000-0000-000000000001',
      audioBuffer: buffer,
      mimeType,
      localeHint,
    });

    return successResponse(result, 202);
  } catch (err) {
    return handleApiError(err);
  }
}
