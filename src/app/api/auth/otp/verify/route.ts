import { NextRequest } from 'next/server';
import { otpVerifySchema } from '@/lib/validation';
import { authService } from '@/server/services/auth-service';
import { successResponse, handleApiError } from '@/lib/errors/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, code } = otpVerifySchema.parse(body);
    const data = await authService.verifyOtp(phone, code);
    return successResponse(data);
  } catch (err) {
    return handleApiError(err);
  }
}
