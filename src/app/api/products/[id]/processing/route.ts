import { NextRequest } from 'next/server';
import { productService } from '@/server/services/product-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await productService.getProcessingStatus(id);
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}
