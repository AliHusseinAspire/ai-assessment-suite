import { prisma, withRetry } from '@/lib/prisma';

export async function getUsers() {
  return withRetry(() =>
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })
  );
}
