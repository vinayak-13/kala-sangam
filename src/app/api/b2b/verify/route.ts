import { NextRequest } from 'next/server';
import { b2bVerifySchema } from '@/lib/validation';
import { orderService } from '@/server/services/order-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = b2bVerifySchema.parse(body);
    const data = await orderService.verifyB2B('b2222222-0000-0000-0000-000000000003', validated);
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}
