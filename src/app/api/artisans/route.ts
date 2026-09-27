import { NextRequest } from 'next/server';
import { createArtisanProfileSchema } from '@/lib/validation';
import { profileService } from '@/server/services/profile-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createArtisanProfileSchema.parse(body);
    const data = await profileService.createArtisanProfile('a1111111-0000-0000-0000-000000000001', validated);
    return successResponse(data, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
