import { NextResponse } from 'next/server';

export function apiError(error: unknown, context?: string) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[API Error]${context ? ` ${context}` : ''}: ${message}`);
  return NextResponse.json(
    { error: message || 'Internal server error' },
    { status: 500 }
  );
}

type Handler<T = unknown> = (...args: T[]) => Promise<Response>;

export function withError<T>(fn: Handler<T>): Handler<T> {
  return async (...args: T[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      return apiError(error, fn.name || 'handler');
    }
  };
}
