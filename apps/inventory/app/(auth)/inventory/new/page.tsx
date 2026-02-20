import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/actions';
import { hasPermission } from '@/lib/auth/permissions';
import { getCategories } from '@/features/inventory/queries';
import { ItemForm } from '@/components/inventory/item-form';

export default async function NewItemPage(): Promise<React.ReactElement> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!hasPermission(user.role, 'items:create')) redirect('/unauthorized');

  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Item</h1>
        <p className="text-muted-foreground">
          Create a new inventory item. AI will help suggest categories and descriptions.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <ItemForm categories={categories} />
      </div>
    </div>
  );
}
