'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/features/auth/actions';
import { requirePermission } from '@/lib/auth/permissions';
import { createCategorySchema, updateCategorySchema } from './schemas';
import type { ActionResult } from '@/features/auth/types';
import type { Category } from '@prisma/client';

export async function createCategory(
  formData: FormData
): Promise<ActionResult<Category>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  try {
    requirePermission(user.role, 'categories:create');
  } catch {
    return { success: false, error: 'Insufficient permissions' };
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsed = createCategorySchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  try {
    const category = await prisma.category.create({
      data: parsed.data,
    });

    revalidatePath('/categories');
    revalidatePath('/inventory');
    return { success: true, data: category };
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { success: false, error: 'A category with this name already exists' };
    }
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(
  formData: FormData
): Promise<ActionResult<Category>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  try {
    requirePermission(user.role, 'categories:update');
  } catch {
    return { success: false, error: 'Insufficient permissions' };
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsed = updateCategorySchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { id, ...data } = parsed.data;

  try {
    const category = await prisma.category.update({
      where: { id },
      data,
    });

    revalidatePath('/categories');
    revalidatePath('/inventory');
    return { success: true, data: category };
  } catch {
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  try {
    requirePermission(user.role, 'categories:delete');
  } catch {
    return { success: false, error: 'Insufficient permissions' };
  }

  try {
    const itemCount = await prisma.inventoryItem.count({ where: { categoryId: id } });
    if (itemCount > 0) {
      return { success: false, error: `Cannot delete: ${itemCount} items are using this category` };
    }

    await prisma.category.delete({ where: { id } });

    revalidatePath('/categories');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'Failed to delete category' };
  }
}
