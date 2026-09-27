import { NextRequest } from 'next/server';
import { updateProfileSchema } from '@/lib/validation';
import { profileService } from '@/server/services/profile-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function GET() {
  try {
    const data = await profileService.getMe();
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const updates = updateProfileSchema.parse(body);
    const data = await profileService.updateMe('a1111111-0000-0000-0000-000000000001', updates);
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}
