import { prisma } from '@/lib/prisma';

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { activities: true } },
    },
  });
}

export async function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      _count: { select: { activities: true } },
    },
  });
}
