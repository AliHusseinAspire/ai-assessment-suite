import { Suspense } from 'react';
import { getCurrentUser } from '@/features/auth/actions';
import { getInventoryItems, getCategories } from '@/features/inventory/queries';
import { hasPermission } from '@/lib/auth/permissions';
import { InventoryToolbar } from '@/components/inventory/inventory-toolbar';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { InventoryPagination } from '@/components/inventory/inventory-pagination';
import type { ItemStatus } from '@/prisma/generated/client';

interface InventoryPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function InventoryPage({ searchParams }: InventoryPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const user = await getCurrentUser();
  if (!user) return <div />;

  const [{ items, total, page, totalPages }, categories] = await Promise.all([
    getInventoryItems({
      search: params.search,
      category: params.category,
      status: params.status as ItemStatus | undefined,
      sort: params.sort,
      page: params.page ? parseInt(params.page) : 1,
    }),
    getCategories(),
  ]);

  const canCreate = hasPermission(user.role, 'items:create');
  const canEdit = hasPermission(user.role, 'items:update');
  const canDelete = hasPermission(user.role, 'items:delete');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground">
          Manage your inventory items, track stock levels, and monitor status.
        </p>
      </div>

      <Suspense fallback={<div className="h-10 animate-pulse rounded-md bg-muted" />}>
        <InventoryToolbar
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          canCreate={canCreate}
        />
      </Suspense>

      <InventoryTable items={items} canEdit={canEdit} canDelete={canDelete} />

      <InventoryPagination page={page} totalPages={totalPages} total={total} />
    </div>
  );
}
