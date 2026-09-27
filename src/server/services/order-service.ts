import { orderRepo } from '@/server/repos/order-repo';
import { profileRepo } from '@/server/repos/profile-repo';
import { NotFoundError, AppError } from '@/lib/errors/api-response';
import type { Order, OrderItem, RFQ, OrderStatus } from '@/lib/db/types';
import type { PlaceOrderPayload } from '@/lib/validation';

export const orderService = {
  async updateCart(userId: string, productId: string, quantity: number): Promise<{ success: boolean; cartTotalPaise: number }> {
    return {
      success: true,
      cartTotalPaise: quantity * 280000,
    };
  },

  async placeOrder(buyerId: string, payload: PlaceOrderPayload): Promise<{ orderId: string; orderNumber: string; totalPaise: number }> {
    const orderId = crypto.randomUUID();
    const orderNumber = `KS-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    let totalPaise = 0;
    const items: OrderItem[] = payload.items.map((item) => {
      const lineTotal = item.quantity * item.unitPricePaise;
      totalPaise += lineTotal;
      return {
        id: crypto.randomUUID(),
        order_id: orderId,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price_paise: item.unitPricePaise,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    const order: Order = {
      id: orderId,
      order_number: orderNumber,
      buyer_id: buyerId,
      artisan_id: payload.artisanId,
      type: payload.type || 'retail',
      status: 'placed',
      total_paise: totalPaise,
      shipping_address: payload.shippingAddress as Record<string, unknown>,
      expected_delivery: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      notes: payload.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await orderRepo.createOrder(order, items);
    return { orderId, orderNumber, totalPaise };
  },

  async listOrders(userId: string, role: string): Promise<Order[]> {
    return orderRepo.listOrdersByRole(userId, role);
  },

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const updated = await orderRepo.updateOrderStatus(orderId, status);
    if (!updated) throw new NotFoundError('Order not found');
    return updated;
  },

  async verifyB2B(profileId: string, payload: { company_name: string; gstin?: string; business_type?: string }): Promise<unknown> {
    return profileRepo.upsertBuyerProfile({
      id: crypto.randomUUID(),
      profile_id: profileId,
      company_name: payload.company_name,
      gstin: payload.gstin || null,
      business_type: payload.business_type || 'retailer',
      verification_status: 'verified', // Staged verified response
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  },

  async createRfq(buyerId: string, payload: { artisanId: string; productId?: string; quantity: number; targetDate?: string; message: string }): Promise<RFQ> {
    const rfq: RFQ = {
      id: crypto.randomUUID(),
      buyer_id: buyerId,
      artisan_id: payload.artisanId,
      product_id: payload.productId || null,
      quantity: payload.quantity,
      target_date: payload.targetDate || null,
      message: payload.message,
      voice_reply_path: null,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return orderRepo.createRfq(rfq);
  },

  async replyRfqVoice(rfqId: string, voicePath: string): Promise<RFQ> {
    const updated = await orderRepo.updateRfqVoiceReply(rfqId, voicePath);
    if (!updated) throw new NotFoundError('RFQ not found');
    return updated;
  },
};
