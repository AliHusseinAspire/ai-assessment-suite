'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/features/auth/actions';
import { requirePermission } from '@/lib/auth/permissions';
import type { EventRole } from '@/prisma/generated/client';
import type { ActionResult } from '@/features/auth/types';

export async function updateUserRole(
  userId: string,
  newRole: EventRole
): Promise<ActionResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { success: false, error: 'Not authenticated' };

  requirePermission(currentUser.role, 'users:manage');

  if (userId === currentUser.id) {
    return { success: false, error: 'You cannot change your own role' };
  }

  const validRoles: EventRole[] = ['OWNER', 'MEMBER', 'GUEST'];
  if (!validRoles.includes(newRole)) {
    return { success: false, error: 'Invalid role' };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  await prisma.activity.create({
    data: {
      action: `Changed role to ${newRole}`,
      details: { targetUserId: userId, newRole } as Record<string, string>,
      userId: currentUser.id,
    },
  });

  revalidatePath('/users');

  return { success: true, data: undefined };
}

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const name = formData.get('name') as string;
  if (!name || name.length < 2) {
    return { success: false, error: 'Name must be at least 2 characters' };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name },
  });

  revalidatePath('/settings');
  revalidatePath('/', 'layout');

  return { success: true, data: undefined };
}
