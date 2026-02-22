import { prisma, withRetry } from '@/lib/prisma';
import type { EventStatus, Prisma } from '@/prisma/generated/client';
import { PAGE_SIZE } from './constants';

interface EventListParams {
  search?: string;
  status?: EventStatus;
  page?: number;
  all?: boolean;
}

export async function getEvents({ search, status, page = 1, all = false }: EventListParams) {
  const where: Prisma.EventWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status) {
    where.status = status;
  }

  return withRetry(async () => {
    const [events, total] = await prisma.$transaction([
      prisma.event.findMany({
        where,
        include: {
          owner: { select: { id: true, name: true, email: true } },
          _count: { select: { rsvps: true, invitations: true } },
        },
        orderBy: { startDate: 'asc' },
        ...(all ? {} : { skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
      }),
      prisma.event.count({ where }),
    ]);

    return {
      events,
      total,
      totalPages: all ? 1 : Math.ceil(total / PAGE_SIZE),
      page,
    };
  });
}

export async function getEvent(id: string) {
  return withRetry(() =>
    prisma.event.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        rsvps: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        invitations: {
          include: {
            sender: { select: { id: true, name: true, email: true } },
            recipient: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        activities: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })
  );
}

export async function getUpcomingEvents(limit = 5) {
  return withRetry(() =>
    prisma.event.findMany({
      where: {
        startDate: { gte: new Date() },
        status: { in: ['UPCOMING', 'ONGOING'] },
      },
      include: {
        owner: { select: { id: true, name: true } },
        _count: { select: { rsvps: true } },
      },
      orderBy: { startDate: 'asc' },
      take: limit,
    })
  );
}

export async function getEventsForMonth(year: number, month: number) {
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  return withRetry(() =>
    prisma.event.findMany({
      where: {
        OR: [
          { startDate: { gte: startOfMonth, lte: endOfMonth } },
          { endDate: { gte: startOfMonth, lte: endOfMonth } },
          { AND: [{ startDate: { lte: startOfMonth } }, { endDate: { gte: endOfMonth } }] },
        ],
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        allDay: true,
        color: true,
        status: true,
      },
      orderBy: { startDate: 'asc' },
    })
  );
}

export async function getUserEventsForWeek(userId: string) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return withRetry(() =>
    prisma.event.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { rsvps: { some: { userId, status: 'ATTENDING' } } },
        ],
        startDate: { lte: endOfWeek },
        endDate: { gte: startOfWeek },
      },
      orderBy: { startDate: 'asc' },
    })
  );
}

export async function checkConflicts(startDate: Date, endDate: Date, userId: string, excludeEventId?: string) {
  const where: Prisma.EventWhereInput = {
    OR: [
      { ownerId: userId },
      { rsvps: { some: { userId, status: 'ATTENDING' } } },
    ],
    AND: [
      { startDate: { lt: endDate } },
      { endDate: { gt: startDate } },
    ],
    status: { not: 'CANCELLED' },
  };

  if (excludeEventId) {
    where.id = { not: excludeEventId };
  }

  return withRetry(() =>
    prisma.event.findMany({
      where,
      select: { id: true, title: true, startDate: true, endDate: true },
    })
  );
}
