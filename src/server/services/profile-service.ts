import { profileRepo } from '@/server/repos/profile-repo';
import { NotFoundError } from '@/lib/errors/api-response';
import type { Profile, ArtisanProfile } from '@/lib/db/types';

export const profileService = {
  async getMe(userId = 'a1111111-0000-0000-0000-000000000001'): Promise<{ profile: Profile; artisan?: ArtisanProfile | null }> {
    let profile = await profileRepo.findById(userId);
    if (!profile) {
      profile = {
        id: userId,
        role: 'artisan',
        full_name: 'Sunil Dhangar',
        phone: '+919820011001',
        preferred_locale: 'mr',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await profileRepo.upsertProfile(profile);
    }
    const artisan = await profileRepo.findArtisanByProfileId(userId);
    return { profile, artisan };
  },

  async updateMe(userId: string, updates: Partial<Omit<Profile, 'id'>>): Promise<Profile> {
    return profileRepo.updateProfile(userId, updates);
  },

  async createArtisanProfile(userId: string, input: Partial<ArtisanProfile>): Promise<ArtisanProfile> {
    const existing = await profileRepo.findArtisanByProfileId(userId);
    if (existing) return existing;

    const newArtisan: ArtisanProfile = {
      id: crypto.randomUUID(),
      profile_id: userId,
      craft_type: input.craft_type || 'handicraft',
      cluster_name: input.cluster_name || null,
      district: input.district || 'Palghar',
      state: input.state || 'Maharashtra',
      years_of_practice: input.years_of_practice || 10,
      bio: input.bio || {},
      bio_audio_url: input.bio_audio_url || null,
      odop_tagged: input.odop_tagged || false,
      udyam_number: input.udyam_number || null,
      is_verified: true,
      rating: 5.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return profileRepo.createArtisanProfile(newArtisan);
  },

  async getArtisanPublic(id: string): Promise<ArtisanProfile> {
    const artisan = await profileRepo.findArtisanById(id);
    if (!artisan) {
      throw new NotFoundError('Artisan profile not found');
    }
    return artisan;
  },
};
