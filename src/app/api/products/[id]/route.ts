import { NextRequest } from 'next/server';
import { updateProductSchema } from '@/lib/validation';
import { productService } from '@/server/services/product-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await productService.getProductDetail(id);
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updates = updateProductSchema.parse(body);
    const data = await productService.editDraft(id, updates);
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}
