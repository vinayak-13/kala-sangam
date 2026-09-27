import { productService } from '@/server/services/product-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function POST() {
  try {
    const data = await productService.createDraft('c1111111-0000-0000-0000-000000000001');
    return successResponse(data, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
