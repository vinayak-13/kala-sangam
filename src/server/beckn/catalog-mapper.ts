// Beckn / ONDC Protocol Catalog Mapper (Doc 21 §21.3)

export const ONDC_CRAFT_CATEGORY_MAP: Record<string, string> = {
  'Warli Painting': 'ONDC:RET10-PAINTING',
  'Blue Pottery': 'ONDC:RET10-POTTERY',
  'Bidriware': 'ONDC:RET10-METALCRAFT',
  'Channapatna Toys': 'ONDC:RET10-WOODTOYS',
  'Dhokra': 'ONDC:RET10-BELLMETAL',
  'Pattachitra': 'ONDC:RET10-FOLKART',
  'Kutch Embroidery': 'ONDC:RET10-TEXTILES',
  'Sanjhi': 'ONDC:RET10-PAPERART',
};

export function mapCraftTypeToOndcCategory(craftType: string): string {
  return ONDC_CRAFT_CATEGORY_MAP[craftType] || 'ONDC:RET10-HANDICRAFTS';
}

export function productToBecknItem(product: {
  id: string;
  title?: Record<string, string> | null;
  description?: Record<string, string> | null;
  price_paise?: number | null;
  craft_type?: string | null;
  stock_quantity?: number | null;
  media?: Array<{ storage_path?: string; kind?: string }> | null;
  district?: string | null;
}) {
  const photos = (product.media || [])
    .filter((m) => m.kind === 'photo' && m.storage_path)
    .map((m) => m.storage_path!);

  const titleEn = (product.title && product.title.en) ? product.title.en : 'Handcrafted Artisan Item';
  const descEn = (product.description && product.description.en) ? product.description.en : 'Authentic Indian handicraft';
  const pricePaise = product.price_paise ?? 100000;

  return {
    id: product.id,
    descriptor: {
      name: titleEn,
      short_desc: descEn.slice(0, 120),
      long_desc: descEn,
      images: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500'],
    },
    price: {
      currency: 'INR',
      value: (pricePaise / 100).toFixed(2),
    },
    category_id: mapCraftTypeToOndcCategory(product.craft_type || ''),
    quantity: {
      available: { count: product.stock_quantity ?? 10 },
    },
    '@ondc/org/returnable': false,
    '@ondc/org/seller_pickup_return': false,
    fulfillment_id: 'f1',
    location_id: product.district || 'India',
  };
}
