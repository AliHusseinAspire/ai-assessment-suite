import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/features/auth/actions';
import { getInventoryItem } from '@/features/inventory/queries';
import { hasPermission } from '@/lib/auth/permissions';
import { StatusBadge } from '@/components/inventory/status-badge';
import { ActivityTimeline } from '@/components/inventory/activity-timeline';
import { Pencil, ArrowLeft } from 'lucide-react';

interface ItemDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const item = await getInventoryItem(id);
  if (!item) notFound();

  const canEdit = hasPermission(user.role, 'items:update');

  const stockPercentage = item.maxStock > 0
    ? Math.min(100, Math.round((item.quantity / item.maxStock) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/inventory"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent"
            aria-label="Back to inventory"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{item.name}</h1>
            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
          </div>
        </div>
        {canEdit && (
          <Link
            href={`/inventory/${item.id}/edit`}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main info */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Details</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">Status</dt>
                <dd className="mt-1"><StatusBadge status={item.status} /></dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Category</dt>
                <dd className="mt-1">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-sm font-medium"
                    style={{ backgroundColor: `${item.category.color}20`, color: item.category.color }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.category.color }} />
                    {item.category.name}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Quantity</dt>
                <dd className="mt-1 text-lg font-semibold">{item.quantity}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Price</dt>
                <dd className="mt-1 text-lg font-semibold">${item.price.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Supplier</dt>
                <dd className="mt-1">{item.supplier ?? 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Stock Range</dt>
                <dd className="mt-1">{item.minStock} - {item.maxStock}</dd>
              </div>
            </dl>

            {item.description && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-sm">{item.description}</p>
              </div>
            )}
          </div>

          {/* Stock level bar */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Stock Level</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{item.quantity} units</span>
                <span className="text-muted-foreground">Max: {item.maxStock}</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    stockPercentage <= 25 ? 'bg-red-500' :
                    stockPercentage <= 50 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${stockPercentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {stockPercentage}% of capacity
                {item.quantity <= item.minStock && (
                  <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                    Below minimum threshold ({item.minStock})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Activity sidebar */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Activity</h2>
          <ActivityTimeline activities={item.activities} />
        </div>
      </div>
    </div>
  );
}
