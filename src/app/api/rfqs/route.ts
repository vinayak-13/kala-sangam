import { NextRequest } from 'next/server';
import { createRfqSchema } from '@/lib/validation';
import { orderService } from '@/server/services/order-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createRfqSchema.parse(body);
    const data = await orderService.createRfq('b2222222-0000-0000-0000-000000000003', validated);
    return successResponse(data, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
