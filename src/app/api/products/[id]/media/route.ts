import { NextRequest } from 'next/server';
import { productMediaUploadSchema } from '@/lib/validation';
import { productService } from '@/server/services/product-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = productMediaUploadSchema.parse(body);
    const data = await productService.generateMediaUploadUrl(id, validated);
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}
