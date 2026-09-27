import { supabase, isSupabaseConfigured } from './supabase-client';
import type { Profile, ArtisanProfile, BuyerProfile, UserRole } from '@/lib/db/types';

const memoryProfiles = new Map<string, Profile>();
const memoryArtisans = new Map<string, ArtisanProfile>();
const memoryBuyers = new Map<string, BuyerProfile>();

export const profileRepo = {
  async findById(id: string): Promise<Profile | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('profiles') as any).select('*').eq('id', id).single();
        if (!error && data) return data as unknown as Profile;
      } catch {
        // fallback
      }
    }
    return memoryProfiles.get(id) || null;
  },

  async upsertProfile(profile: Profile): Promise<Profile> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('profiles') as any).upsert(profile).select().single();
        if (!error && data) return data as unknown as Profile;
      } catch {
        // fallback
      }
    }
    memoryProfiles.set(profile.id, profile);
    return profile;
  },

  async updateProfile(id: string, updates: Partial<Omit<Profile, 'id'>>): Promise<Profile> {
    const existing = (await this.findById(id)) || {
      id,
      role: 'customer' as UserRole,
      full_name: 'Anonymous Artisan',
      phone: null,
      preferred_locale: 'hi',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated: Profile = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('profiles') as any).update(updates).eq('id', id).select().single();
        if (!error && data) return data as unknown as Profile;
      } catch {
        // fallback
      }
    }
    memoryProfiles.set(id, updated);
    return updated;
  },

  async findArtisanById(id: string): Promise<ArtisanProfile | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('artisan_profiles') as any).select('*').eq('id', id).single();
        if (!error && data) return data as unknown as ArtisanProfile;
      } catch {
        // fallback
      }
    }
    return memoryArtisans.get(id) || null;
  },

  async findArtisanByProfileId(profileId: string): Promise<ArtisanProfile | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('artisan_profiles') as any).select('*').eq('profile_id', profileId).single();
        if (!error && data) return data as unknown as ArtisanProfile;
      } catch {
        // fallback
      }
    }
    for (const artisan of memoryArtisans.values()) {
      if (artisan.profile_id === profileId) return artisan;
    }
    return null;
  },

  async createArtisanProfile(artisan: ArtisanProfile): Promise<ArtisanProfile> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('artisan_profiles') as any).insert(artisan).select().single();
        if (!error && data) return data as unknown as ArtisanProfile;
      } catch {
        // fallback
      }
    }
    memoryArtisans.set(artisan.id, artisan);
    return artisan;
  },

  async upsertBuyerProfile(buyer: BuyerProfile): Promise<BuyerProfile> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('buyer_profiles') as any).upsert(buyer).select().single();
        if (!error && data) return data as unknown as BuyerProfile;
      } catch {
        // fallback
      }
    }
    memoryBuyers.set(buyer.id, buyer);
    return buyer;
  },
};
