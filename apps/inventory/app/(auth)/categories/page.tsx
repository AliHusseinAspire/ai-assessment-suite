import { getCurrentUser } from '@/features/auth/actions';
import { getCategories } from '@/features/inventory/queries';
import { hasPermission } from '@/lib/auth/permissions';
import { CategoryCard } from '@/components/categories/category-card';
import { CategoryForm } from '@/components/categories/category-form';

export default async function CategoriesPage(): Promise<React.ReactElement> {
  const user = await getCurrentUser();
  if (!user) return <div />;

  const categories = await getCategories();
  const canCreate = hasPermission(user.role, 'categories:create');
  const canEdit = hasPermission(user.role, 'categories:update');
  const canDelete = hasPermission(user.role, 'categories:delete');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Organize your inventory items by category.
          </p>
        </div>
      </div>

      {canCreate && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Add Category</h2>
          <CategoryForm />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            itemCount={category._count.items}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        ))}
      </div>

      {categories.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-lg font-medium text-muted-foreground">No categories yet</p>
          <p className="text-sm text-muted-foreground">Create your first category above.</p>
        </div>
      )}
    </div>
  );
}
