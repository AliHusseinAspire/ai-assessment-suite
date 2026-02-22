import { PrismaClient } from '@/prisma/generated/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Retry a database operation on transient connection failures (P1001, P1002, P1008, P1017).
 * Supabase's PgBouncer drops idle connections — this handles the resulting errors.
 */
export async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;
      const isRetryable = code === 'P1001' || code === 'P1002' || code === 'P1008' || code === 'P1017';
      if (!isRetryable || attempt === retries) throw error;
      // Brief pause before retry — increases with each attempt
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  // Unreachable, but satisfies TypeScript
  throw new Error('withRetry: exhausted retries');
}
