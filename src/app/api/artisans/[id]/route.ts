import { NextRequest } from 'next/server';
import { profileService } from '@/server/services/profile-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await profileService.getArtisanPublic(id);
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}
