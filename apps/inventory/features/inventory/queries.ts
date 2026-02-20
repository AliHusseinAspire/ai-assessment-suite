import { prisma, withRetry } from '@/lib/prisma';
import type { ItemStatus, Prisma } from '@prisma/client';
import { PAGE_SIZE } from './constants';

interface GetItemsParams {
  search?: string;
  category?: string;
  status?: ItemStatus;
  sort?: string;
  page?: number;
}

export async function getInventoryItems(params: GetItemsParams = {}) {
  return withRetry(() => getInventoryItemsInner(params));
}

async function getInventoryItemsInner(params: GetItemsParams) {
  const { search, category, status, sort, page = 1 } = params;

  const where: Prisma.InventoryItemWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { supplier: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.categoryId = category;
  }

  if (status) {
    where.status = status;
  }

  // Parse sort
  let orderBy: Prisma.InventoryItemOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort) {
    const [field, direction] = sort.split('-') as [string, 'asc' | 'desc'];
    if (['name', 'quantity', 'price', 'createdAt'].includes(field)) {
      orderBy = { [field]: direction };
    }
  }

  const skip = (page - 1) * PAGE_SIZE;

  const [items, total] = await Promise.all([
    prisma.inventoryItem.findMany({
      where,
      orderBy,
      skip,
      take: PAGE_SIZE,
      include: { category: true },
    }),
    prisma.inventoryItem.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

export async function getInventoryItem(id: string) {
  return prisma.inventoryItem.findUnique({
    where: { id },
    include: {
      category: true,
      activities: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { items: true } } },
  });
}

export async function getInventoryStats() {
  const [totalItems, totalValue, statusCounts, lowStockItems] = await Promise.all([
    prisma.inventoryItem.count(),
    prisma.inventoryItem.aggregate({ _sum: { quantity: true } }),
    prisma.inventoryItem.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.inventoryItem.findMany({
      where: { status: 'LOW_STOCK' },
      select: { id: true, name: true, quantity: true, minStock: true, sku: true },
      orderBy: { quantity: 'asc' },
      take: 10,
    }),
  ]);

  return {
    totalItems,
    totalQuantity: totalValue._sum.quantity ?? 0,
    statusCounts: statusCounts.reduce(
      (acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      },
      {} as Record<string, number>
    ),
    lowStockItems,
  };
}
