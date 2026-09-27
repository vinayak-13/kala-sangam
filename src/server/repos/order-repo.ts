import { supabase, isSupabaseConfigured } from './supabase-client';
import type { Order, OrderItem, RFQ, OrderStatus } from '@/lib/db/types';

const memoryOrders = new Map<string, Order>();
const memoryOrderItems = new Map<string, OrderItem[]>();
const memoryRfqs = new Map<string, RFQ>();

export const orderRepo = {
  async createOrder(order: Order, items: OrderItem[]): Promise<Order> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('orders') as any).insert(order).select().single();
        if (!error && data) {
          await (supabase.from('order_items') as any).insert(items);
          return data as unknown as Order;
        }
      } catch {
        // fallback
      }
    }
    memoryOrders.set(order.id, order);
    memoryOrderItems.set(order.id, items);
    return order;
  },

  async findOrderById(id: string): Promise<{ order: Order; items: OrderItem[] } | null> {
    const order = memoryOrders.get(id);
    if (!order) return null;
    const items = memoryOrderItems.get(id) || [];
    return { order, items };
  },

  async listOrdersByRole(userId: string, role: string): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = (supabase.from('orders') as any).select('*');
        if (role === 'artisan') {
          query = query.eq('artisan_id', userId);
        } else {
          query = query.eq('buyer_id', userId);
        }
        const { data, error } = await query;
        if (!error && data) return data as unknown as Order[];
      } catch {
        // fallback
      }
    }
    const all = Array.from(memoryOrders.values());
    return role === 'artisan'
      ? all.filter((o) => o.artisan_id === userId)
      : all.filter((o) => o.buyer_id === userId);
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const existing = memoryOrders.get(id);
    if (!existing) return null;
    const updated: Order = { ...existing, status, updated_at: new Date().toISOString() };
    memoryOrders.set(id, updated);
    return updated;
  },

  async createRfq(rfq: RFQ): Promise<RFQ> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('rfqs') as any).insert(rfq).select().single();
        if (!error && data) return data as unknown as RFQ;
      } catch {
        // fallback
      }
    }
    memoryRfqs.set(rfq.id, rfq);
    return rfq;
  },

  async updateRfqVoiceReply(id: string, voiceReplyPath: string): Promise<RFQ | null> {
    const existing = memoryRfqs.get(id);
    if (!existing) return null;
    const updated: RFQ = {
      ...existing,
      voice_reply_path: voiceReplyPath,
      updated_at: new Date().toISOString(),
    };
    memoryRfqs.set(id, updated);
    return updated;
  },
};
