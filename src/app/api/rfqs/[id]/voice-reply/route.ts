import { NextRequest } from 'next/server';
import { rfqVoiceReplySchema } from '@/lib/validation';
import { orderService } from '@/server/services/order-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { voicePath } = rfqVoiceReplySchema.parse(body);
    const data = await orderService.replyRfqVoice(id, voicePath);
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}
