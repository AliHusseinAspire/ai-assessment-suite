'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/features/auth/actions';
import type { ActionResult } from '@/features/auth/types';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export async function updateProfile(
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const parsed = updateProfileSchema.safeParse({
    name: formData.get('name'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: parsed.data.name },
    });

    revalidatePath('/', 'layout');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'Failed to update profile' };
  }
}
