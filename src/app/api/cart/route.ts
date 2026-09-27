import { NextRequest } from 'next/server';
import { cartItemSchema } from '@/lib/validation';
import { orderService } from '@/server/services/order-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, quantity } = cartItemSchema.parse(body);
    const data = await orderService.updateCart('b2222222-0000-0000-0000-000000000001', productId, quantity);
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}
