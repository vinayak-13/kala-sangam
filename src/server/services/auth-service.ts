import { profileRepo } from '@/server/repos/profile-repo';
import { AppError } from '@/lib/errors/api-response';

export const authService = {
  async requestOtp(phone: string): Promise<{ sent: boolean; message: string }> {
    // In production: dispatch via SMS gateway (Gupshup / MSG91)
    // Staging / Demo: immediate success
    return {
      sent: true,
      message: `OTP sent successfully to ${phone} (Demo OTP: 123456)`,
    };
  },

  async verifyOtp(phone: string, code: string): Promise<{ token: string; profile: unknown }> {
    if (code !== '123456' && code !== '000000') {
      throw new AppError('INVALID_OTP', 'Invalid or expired OTP', 400);
    }

    // Default test user ID deterministically derived from phone
    const userId = 'a1111111-0000-0000-0000-000000000001';
    let profile = await profileRepo.findById(userId);

    if (!profile) {
      profile = await profileRepo.upsertProfile({
        id: userId,
        role: 'artisan',
        full_name: 'Sunil Dhangar',
        phone,
        preferred_locale: 'mr',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    return {
      token: `demo-session-token-${userId}`,
      profile,
    };
  },
};
