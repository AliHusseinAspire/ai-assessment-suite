'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/features/auth/actions';
import { requirePermission } from '@/lib/auth/permissions';
import { createItemSchema, updateItemSchema } from './schemas';
import type { ActionResult } from '@/features/auth/types';
import type { InventoryItem } from '@/prisma/generated/client';

async function logActivity(
  userId: string,
  action: string,
  itemId: string | null,
  details?: Record<string, unknown>
): Promise<void> {
  await prisma.activity.create({
    data: { action, details: (details ?? {}) as Record<string, string | number | boolean | null>, userId, itemId },
  });
}

function computeStatus(quantity: number, minStock: number): 'IN_STOCK' | 'LOW_STOCK' {
  return quantity <= minStock ? 'LOW_STOCK' : 'IN_STOCK';
}

export async function createItem(
  formData: FormData
): Promise<ActionResult<InventoryItem>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  try {
    requirePermission(user.role, 'items:create');
  } catch {
    return { success: false, error: 'Insufficient permissions' };
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsed = createItemSchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { imageUrl, ...data } = parsed.data;

  // Auto-compute status based on quantity vs minStock
  let status = data.status;
  if (status !== 'ORDERED' && status !== 'DISCONTINUED') {
    status = computeStatus(data.quantity, data.minStock);
  }

  try {
    const item = await prisma.inventoryItem.create({
      data: {
        ...data,
        status,
        imageUrl: imageUrl || null,
      },
    });

    await logActivity(user.id, 'CREATED', item.id, {
      message: `Created item: ${item.name}`,
    });

    revalidatePath('/inventory');
    revalidatePath('/dashboard');
    return { success: true, data: item };
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { success: false, error: 'An item with this SKU already exists' };
    }
    return { success: false, error: 'Failed to create item' };
  }
}

export async function updateItem(
  formData: FormData
): Promise<ActionResult<InventoryItem>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  try {
    requirePermission(user.role, 'items:update');
  } catch {
    return { success: false, error: 'Insufficient permissions' };
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsed = updateItemSchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { id, imageUrl, ...data } = parsed.data;

  // Auto-compute status
  if (data.status !== 'ORDERED' && data.status !== 'DISCONTINUED' && data.quantity != null && data.minStock != null) {
    data.status = computeStatus(data.quantity, data.minStock);
  }

  try {
    const existing = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!existing) return { success: false, error: 'Item not found' };

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: {
        ...data,
        imageUrl: imageUrl || null,
      },
    });

    // Log changes
    const changes: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const existingValue = existing[key as keyof typeof existing];
      if (existingValue !== value) {
        changes[key] = { from: existingValue, to: value };
      }
    }

    await logActivity(user.id, 'UPDATED', item.id, {
      message: `Updated item: ${item.name}`,
      changes,
    });

    revalidatePath('/inventory');
    revalidatePath(`/inventory/${id}`);
    revalidatePath('/dashboard');
    return { success: true, data: item };
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { success: false, error: 'An item with this SKU already exists' };
    }
    return { success: false, error: 'Failed to update item' };
  }
}

export async function deleteItem(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  try {
    requirePermission(user.role, 'items:delete');
  } catch {
    return { success: false, error: 'Insufficient permissions' };
  }

  try {
    const item = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!item) return { success: false, error: 'Item not found' };

    await prisma.inventoryItem.delete({ where: { id } });

    await logActivity(user.id, 'DELETED', null, {
      message: `Deleted item: ${item.name}`,
      itemName: item.name,
      sku: item.sku,
    });

    revalidatePath('/inventory');
    revalidatePath('/dashboard');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'Failed to delete item' };
  }
}

export async function updateItemStatus(
  id: string,
  status: 'IN_STOCK' | 'LOW_STOCK' | 'ORDERED' | 'DISCONTINUED'
): Promise<ActionResult<InventoryItem>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  try {
    requirePermission(user.role, 'items:update');
  } catch {
    return { success: false, error: 'Insufficient permissions' };
  }

  try {
    const existing = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!existing) return { success: false, error: 'Item not found' };

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { status },
    });

    await logActivity(user.id, 'STATUS_CHANGE', item.id, {
      from: existing.status,
      to: status,
    });

    revalidatePath('/inventory');
    revalidatePath(`/inventory/${id}`);
    revalidatePath('/dashboard');
    return { success: true, data: item };
  } catch {
    return { success: false, error: 'Failed to update status' };
  }
}
