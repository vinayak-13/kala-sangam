import { NextRequest } from 'next/server';
import { productListQuerySchema } from '@/lib/validation';
import { productService } from '@/server/services/product-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function GET(req: NextRequest) {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const filter = productListQuerySchema.parse(searchParams);
    const data = await productService.listProducts(filter);
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}
