import { NextRequest } from 'next/server';
import { placeOrderSchema } from '@/lib/validation';
import { orderService } from '@/server/services/order-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function GET(req: NextRequest) {
  try {
    const role = req.nextUrl.searchParams.get('role') || 'customer';
    const userId = req.nextUrl.searchParams.get('userId') || 'b2222222-0000-0000-0000-000000000001';
    const data = await orderService.listOrders(userId, role);
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = placeOrderSchema.parse(body);
    const data = await orderService.placeOrder('b2222222-0000-0000-0000-000000000001', validated);
    return successResponse(data, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
