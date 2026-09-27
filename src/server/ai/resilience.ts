export class StageTimeoutError extends Error {
  constructor(public readonly stage: string, public readonly timeoutMs: number) {
    super(`AI stage '${stage}' timed out after ${timeoutMs}ms`);
    this.name = 'StageTimeoutError';
  }
}

/**
 * Wraps a promise or async function in a strict timeout
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  ms: number,
  stage = 'AI_STAGE'
): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new StageTimeoutError(stage, ms));
    }, ms);
  });

  try {
    const result = await Promise.race([fn(), timeoutPromise]);
    if (timer) clearTimeout(timer);
    return result;
  } catch (error) {
    if (timer) clearTimeout(timer);
    throw error;
  }
}

/**
 * Runs primary provider, falls back to secondary on any failure
 */
export async function withFallback<T>(
  primary: () => Promise<T>,
  secondary: () => Promise<T>
): Promise<T> {
  try {
    return await primary();
  } catch {
    return await secondary();
  }
}
