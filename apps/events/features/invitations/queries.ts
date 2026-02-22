import { prisma, withRetry } from '@/lib/prisma';

export async function getReceivedInvitations(userId: string) {
  return withRetry(() =>
    prisma.invitation.findMany({
      where: { recipientId: userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            location: true,
            color: true,
            status: true,
          },
        },
        sender: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  );
}

export async function getPendingInvitationCount(userId: string) {
  return withRetry(() =>
    prisma.invitation.count({
      where: { recipientId: userId, status: 'PENDING' },
    })
  );
}
