'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/features/auth/actions';
import { requirePermission } from '@/lib/auth/permissions';
import { eventSchema } from './schemas';
import type { ActionResult } from '@/features/auth/types';

export async function createEvent(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  requirePermission(user.role, 'events:create');

  const raw = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || '',
    location: formData.get('location') as string || '',
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string,
    allDay: formData.get('allDay') === 'true',
    isRecurring: formData.get('isRecurring') === 'true',
    color: formData.get('color') as string || '#0d9488',
    maxAttendees: formData.get('maxAttendees') ? Number(formData.get('maxAttendees')) : null,
  };

  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const event = await prisma.event.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      allDay: parsed.data.allDay,
      isRecurring: parsed.data.isRecurring,
      color: parsed.data.color,
      maxAttendees: parsed.data.maxAttendees ?? null,
      ownerId: user.id,
    },
  });

  // Auto-RSVP the owner as ATTENDING
  await prisma.rsvp.create({
    data: { userId: user.id, eventId: event.id, status: 'ATTENDING' },
  });

  // Log activity
  await prisma.activity.create({
    data: {
      action: 'Created event',
      details: { title: event.title } as Record<string, string>,
      userId: user.id,
      eventId: event.id,
    },
  });

  revalidatePath('/events');
  revalidatePath('/dashboard');
  revalidatePath('/calendar');

  return { success: true, data: { id: event.id } };
}

export async function updateEvent(id: string, formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return { success: false, error: 'Event not found' };

  // OWNER can update any, MEMBER can update only their own
  if (user.role === 'GUEST') {
    return { success: false, error: 'Insufficient permissions' };
  }
  if (user.role === 'MEMBER' && event.ownerId !== user.id) {
    return { success: false, error: 'You can only edit your own events' };
  }

  const raw = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || '',
    location: formData.get('location') as string || '',
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string,
    allDay: formData.get('allDay') === 'true',
    isRecurring: formData.get('isRecurring') === 'true',
    color: formData.get('color') as string || '#0d9488',
    maxAttendees: formData.get('maxAttendees') ? Number(formData.get('maxAttendees')) : null,
  };

  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  await prisma.event.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      allDay: parsed.data.allDay,
      isRecurring: parsed.data.isRecurring,
      color: parsed.data.color,
      maxAttendees: parsed.data.maxAttendees ?? null,
    },
  });

  await prisma.activity.create({
    data: {
      action: 'Updated event',
      details: { title: parsed.data.title } as Record<string, string>,
      userId: user.id,
      eventId: id,
    },
  });

  revalidatePath('/events');
  revalidatePath(`/events/${id}`);
  revalidatePath('/dashboard');
  revalidatePath('/calendar');

  return { success: true, data: undefined };
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  requirePermission(user.role, 'events:delete');

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return { success: false, error: 'Event not found' };

  await prisma.activity.create({
    data: {
      action: 'Deleted event',
      details: { title: event.title } as Record<string, string>,
      userId: user.id,
    },
  });

  await prisma.event.delete({ where: { id } });

  revalidatePath('/events');
  revalidatePath('/dashboard');
  revalidatePath('/calendar');

  redirect('/events');
}

export async function cancelEvent(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return { success: false, error: 'Event not found' };

  if (user.role === 'GUEST') {
    return { success: false, error: 'Insufficient permissions' };
  }
  if (user.role === 'MEMBER' && event.ownerId !== user.id) {
    return { success: false, error: 'You can only cancel your own events' };
  }

  await prisma.event.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });

  await prisma.activity.create({
    data: {
      action: 'Cancelled event',
      details: { title: event.title } as Record<string, string>,
      userId: user.id,
      eventId: id,
    },
  });

  revalidatePath('/events');
  revalidatePath(`/events/${id}`);
  revalidatePath('/dashboard');
  revalidatePath('/calendar');

  return { success: true, data: undefined };
}

export async function updateRsvp(
  eventId: string,
  status: 'ATTENDING' | 'MAYBE' | 'DECLINED',
  note?: string
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  await prisma.rsvp.upsert({
    where: { userId_eventId: { userId: user.id, eventId } },
    update: { status, note: note || null },
    create: { userId: user.id, eventId, status, note: note || null },
  });

  await prisma.activity.create({
    data: {
      action: `RSVP: ${status.toLowerCase()}`,
      userId: user.id,
      eventId,
    },
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath('/dashboard');

  return { success: true, data: undefined };
}
