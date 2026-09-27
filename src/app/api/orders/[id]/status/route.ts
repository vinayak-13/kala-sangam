import { NextRequest } from 'next/server';
import { updateOrderStatusSchema } from '@/lib/validation';
import { orderService } from '@/server/services/order-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = updateOrderStatusSchema.parse(body);
    const data = await orderService.updateStatus(id, status);
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}
