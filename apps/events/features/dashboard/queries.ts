import { prisma, withRetry } from '@/lib/prisma';

export async function getDashboardStats(userId: string) {
  return withRetry(async () => {
    const now = new Date();

    const [
      totalEvents,
      upcomingEvents,
      attendingCount,
      pendingInvitations,
      recentActivity,
      rsvpDistribution,
      upcomingList,
    ] = await prisma.$transaction([
      prisma.event.count(),
      prisma.event.count({
        where: { status: 'UPCOMING', startDate: { gte: now } },
      }),
      prisma.rsvp.count({
        where: { userId, status: 'ATTENDING' },
      }),
      prisma.invitation.count({
        where: { recipientId: userId, status: 'PENDING' },
      }),
      prisma.activity.findMany({
        include: {
          user: { select: { id: true, name: true } },
          event: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.rsvp.groupBy({
        by: ['status'],
        orderBy: { status: 'asc' },
        _count: { _all: true },
      }),
      prisma.event.findMany({
        where: {
          startDate: { gte: now },
          status: { in: ['UPCOMING', 'ONGOING'] },
        },
        include: {
          owner: { select: { id: true, name: true } },
          _count: { select: { rsvps: true } },
        },
        orderBy: { startDate: 'asc' },
        take: 5,
      }),
    ]);

    const rsvpCounts: Record<string, number> = {};
    for (const r of rsvpDistribution) {
      const count = r._count;
      rsvpCounts[r.status] = typeof count === 'object' && count != null ? (count._all ?? 0) : 0;
    }

    return {
      totalEvents,
      upcomingEvents,
      attendingCount,
      pendingInvitations,
      recentActivity,
      rsvpCounts,
      upcomingList,
    };
  });
}
