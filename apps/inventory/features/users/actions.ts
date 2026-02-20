'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/features/auth/actions';
import { requirePermission } from '@/lib/auth/permissions';
import type { ActionResult } from '@/features/auth/types';
import type { Role } from '@prisma/client';

export async function updateUserRole(
  userId: string,
  role: Role
): Promise<ActionResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { success: false, error: 'Not authenticated' };

  try {
    requirePermission(currentUser.role, 'users:manage');
  } catch {
    return { success: false, error: 'Insufficient permissions' };
  }

  // Prevent self-demotion
  if (currentUser.id === userId) {
    return { success: false, error: 'Cannot change your own role' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath('/users');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'Failed to update user role' };
  }
}
