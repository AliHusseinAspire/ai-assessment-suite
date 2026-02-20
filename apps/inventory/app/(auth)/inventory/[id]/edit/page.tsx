import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/actions';
import { getInventoryItem, getCategories } from '@/features/inventory/queries';
import { hasPermission } from '@/lib/auth/permissions';
import { ItemForm } from '@/components/inventory/item-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface EditItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditItemPage({ params }: EditItemPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!hasPermission(user.role, 'items:update')) redirect('/unauthorized');

  const [item, categories] = await Promise.all([
    getInventoryItem(id),
    getCategories(),
  ]);

  if (!item) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/inventory/${item.id}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent"
          aria-label="Back to item"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Item</h1>
          <p className="text-muted-foreground">{item.name}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <ItemForm item={item} categories={categories} />
      </div>
    </div>
  );
}
