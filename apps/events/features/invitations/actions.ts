'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/features/auth/actions';
import { requirePermission } from '@/lib/auth/permissions';
import type { ActionResult } from '@/features/auth/types';

export async function sendInvitation(
  eventId: string,
  recipientEmail: string,
  message?: string
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  requirePermission(user.role, 'invitations:send');

  const recipient = await prisma.user.findUnique({
    where: { email: recipientEmail },
  });

  if (!recipient) {
    return { success: false, error: 'User not found. They must have an account first.' };
  }

  if (recipient.id === user.id) {
    return { success: false, error: 'You cannot invite yourself' };
  }

  const existing = await prisma.invitation.findUnique({
    where: { recipientId_eventId: { recipientId: recipient.id, eventId } },
  });

  if (existing) {
    return { success: false, error: 'User has already been invited to this event' };
  }

  await prisma.invitation.create({
    data: {
      senderId: user.id,
      recipientId: recipient.id,
      eventId,
      message: message || null,
    },
  });

  await prisma.activity.create({
    data: {
      action: `Invited ${recipient.name}`,
      userId: user.id,
      eventId,
    },
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath('/invitations');

  return { success: true, data: undefined };
}

export async function respondToInvitation(
  invitationId: string,
  response: 'ACCEPTED' | 'DECLINED' | 'MAYBE'
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { event: true },
  });

  if (!invitation) return { success: false, error: 'Invitation not found' };
  if (invitation.recipientId !== user.id) {
    return { success: false, error: 'This invitation is not for you' };
  }

  await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: response },
  });

  // If accepted, create/update RSVP
  if (response === 'ACCEPTED') {
    await prisma.rsvp.upsert({
      where: { userId_eventId: { userId: user.id, eventId: invitation.eventId } },
      update: { status: 'ATTENDING' },
      create: { userId: user.id, eventId: invitation.eventId, status: 'ATTENDING' },
    });
  } else if (response === 'MAYBE') {
    await prisma.rsvp.upsert({
      where: { userId_eventId: { userId: user.id, eventId: invitation.eventId } },
      update: { status: 'MAYBE' },
      create: { userId: user.id, eventId: invitation.eventId, status: 'MAYBE' },
    });
  } else if (response === 'DECLINED') {
    await prisma.rsvp.upsert({
      where: { userId_eventId: { userId: user.id, eventId: invitation.eventId } },
      update: { status: 'DECLINED' },
      create: { userId: user.id, eventId: invitation.eventId, status: 'DECLINED' },
    });
  }

  await prisma.activity.create({
    data: {
      action: `${response.toLowerCase()} invitation`,
      userId: user.id,
      eventId: invitation.eventId,
    },
  });

  revalidatePath('/invitations');
  revalidatePath(`/events/${invitation.eventId}`);
  revalidatePath('/dashboard');

  return { success: true, data: undefined };
}
