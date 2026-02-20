import { prisma, withRetry } from '@/lib/prisma';

export async function getDashboardStats() {
  return withRetry(getDashboardStatsInner);
}

async function getDashboardStatsInner() {
  const [
    totalItems,
    totalValue,
    statusCounts,
    categoryCounts,
    recentActivity,
    lowStockItems,
    totalCategories,
  ] = await Promise.all([
    prisma.inventoryItem.count(),
    prisma.inventoryItem.aggregate({
      _sum: { quantity: true },
      _avg: { price: true },
    }),
    prisma.inventoryItem.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        color: true,
        _count: { select: { items: true } },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.activity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
        item: { select: { id: true, name: true } },
      },
    }),
    prisma.inventoryItem.findMany({
      where: { status: 'LOW_STOCK' },
      select: { id: true, name: true, quantity: true, minStock: true, sku: true, category: { select: { name: true } } },
      orderBy: { quantity: 'asc' },
      take: 10,
    }),
    prisma.category.count(),
  ]);

  const totalInventoryValue = await prisma.$queryRaw<[{ total: number }]>`
    SELECT COALESCE(SUM(quantity * price), 0) as total FROM inventory_items
  `;

  return {
    totalItems,
    totalQuantity: totalValue._sum.quantity ?? 0,
    averagePrice: totalValue._avg.price ?? 0,
    totalValue: Number(totalInventoryValue[0]?.total ?? 0),
    totalCategories,
    statusCounts: statusCounts.reduce(
      (acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      },
      {} as Record<string, number>
    ),
    categoryDistribution: categoryCounts.map((c) => ({
      name: c.name,
      value: c._count.items,
      color: c.color,
    })),
    recentActivity,
    lowStockItems,
  };
}
