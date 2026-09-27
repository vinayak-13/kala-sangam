import { NextResponse } from 'next/server';

export interface ApiSuccessResponse<T> {
  ok: true;
  data: T;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  field?: string;
}

export interface ApiErrorResponse {
  ok: false;
  error: ApiErrorDetail;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400,
    public readonly field?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', field?: string) {
    super('NOT_FOUND', message, 404, field);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access', field?: string) {
    super('UNAUTHORIZED', message, 401, field);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', field?: string) {
    super('VALIDATION_ERROR', message, 422, field);
  }
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccessResponse<T>>({ ok: true, data }, { status });
}

export function errorResponse(code: string, message: string, status = 400, field?: string) {
  return NextResponse.json<ApiErrorResponse>(
    { ok: false, error: { code, message, ...(field ? { field } : {}) } },
    { status }
  );
}

export function handleApiError(err: unknown) {
  if (err instanceof AppError) {
    return errorResponse(err.code, err.message, err.statusCode, err.field);
  }
  const message = err instanceof Error ? err.message : 'An unexpected error occurred';
  return errorResponse('INTERNAL_SERVER_ERROR', message, 500);
}
