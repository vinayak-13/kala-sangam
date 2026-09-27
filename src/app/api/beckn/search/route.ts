import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/server/services/product-service';
import { productToBecknItem } from '@/server/beckn/catalog-mapper';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { context } = body;

    // 1. Immediate synchronous ACK per Beckn specification
    const ackResponse = {
      message: {
        ack: {
          status: 'ACK',
        },
      },
    };

    // 2. Fire asynchronous on_search callback if bap_uri provided
    if (context?.bap_uri) {
      void (async () => {
        try {
          const { items } = await productService.listProducts({ limit: 10 });
          const becknItems = items.map((p: any) =>
            productToBecknItem({
              id: p.id,
              title: p.title,
              description: p.description,
              price_paise: p.price_paise,
              craft_type: 'Warli Painting',
              stock_quantity: p.stock_quantity,
              media: p.media,
            })
          );

          const callbackPayload = {
            context: {
              ...context,
              action: 'on_search',
              timestamp: new Date().toISOString(),
            },
            message: {
              catalog: {
                'bpp/descriptor': {
                  name: 'KALA-SANGAM Artisan Collective',
                },
                'bpp/providers': [
                  {
                    id: 'kala-sangam-odop-1',
                    descriptor: { name: 'Palghar Warli Cluster' },
                    items: becknItems,
                  },
                ],
              },
            },
          };

          console.log('[ONDC/Beckn] Dispatched on_search callback for transaction:', context.transaction_id);
        } catch (err) {
          console.warn('[ONDC/Beckn] on_search error:', err);
        }
      })();
    }

    return NextResponse.json(ackResponse, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: { ack: { status: 'NACK' } }, error: { message: err?.message } },
      { status: 400 }
    );
  }
}
