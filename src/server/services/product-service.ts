import { productRepo } from '@/server/repos/product-repo';
import { NotFoundError, AppError } from '@/lib/errors/api-response';
import type { Product, ProductMedia, VoiceCapture } from '@/lib/db/types';

export const productService = {
  async createDraft(artisanId = 'c1111111-0000-0000-0000-000000000001'): Promise<{ productId: string }> {
    const draft = await productRepo.createDraft(artisanId);
    return { productId: draft.id };
  },

  async generateMediaUploadUrl(
    productId: string,
    params: { kind: 'photo' | 'video' | 'voice'; fileName: string; contentType: string }
  ): Promise<{ uploadUrl: string; storagePath: string; mediaId: string }> {
    const mediaId = crypto.randomUUID();
    const bucket = params.kind === 'photo' ? 'product-photos' : 'product-voice';
    const storagePath = `/storage/${bucket}/${productId}/${mediaId}-${params.fileName}`;

    await productRepo.addMedia({
      id: mediaId,
      product_id: productId,
      kind: params.kind,
      storage_path: storagePath,
      sort_order: 0,
      width: null,
      height: null,
      duration_ms: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return {
      uploadUrl: `https://placeholder-kala-sangam.supabase.co/storage/v1/object/upload/sign/${bucket}/${storagePath}`,
      storagePath,
      mediaId,
    };
  },

  async getProcessingStatus(productId: string): Promise<{
    status: string;
    product: Product | null;
    capture: VoiceCapture | null;
  }> {
    const product = await productRepo.findById(productId);
    const capture = await productRepo.findVoiceCaptureByProductId(productId);
    return {
      status: product?.status || 'draft',
      product,
      capture,
    };
  },

  async editDraft(id: string, updates: Partial<Omit<Product, 'id'>>): Promise<Product> {
    const updated = await productRepo.update(id, updates);
    if (!updated) throw new NotFoundError('Product not found');
    return updated;
  },

  async publishProduct(id: string): Promise<Product> {
    const existing = await productRepo.findById(id);
    if (!existing) throw new NotFoundError('Product not found');

    if (!existing.price_paise || existing.price_paise <= 0) {
      throw new AppError('INVALID_PRICE', 'A valid price in paise is required before publishing', 400);
    }

    const published = await productRepo.update(id, { status: 'published' });
    return published!;
  },

  async listProducts(filter: {
    q?: string;
    craft?: string;
    state?: string;
    lang?: string;
    b2b?: string;
    cursor?: string;
    limit?: number;
  }): Promise<{ items: Product[]; nextCursor: string | null }> {
    return productRepo.list(filter);
  },

  async getProductDetail(id: string): Promise<{ product: Product; media: ProductMedia[]; voice: VoiceCapture | null }> {
    const product = await productRepo.findById(id);
    if (!product || product.deleted_at) {
      throw new NotFoundError('Product not found');
    }

    await productRepo.incrementViewCount(id);
    const media = await productRepo.findMediaByProductId(id);
    const voice = await productRepo.findVoiceCaptureByProductId(id);

    return { product, media, voice };
  },
};
