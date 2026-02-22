'use client';

import Link from 'next/link';
import { Trash2, Package } from 'lucide-react';
import { deleteCategory } from '@/features/categories/actions';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/confirm-dialog';
import type { Category } from '@/prisma/generated/client';

interface CategoryCardProps {
  category: Category;
  itemCount: number;
  canEdit: boolean;
  canDelete: boolean;
}

export function CategoryCard({
  category,
  itemCount,
  canDelete,
}: CategoryCardProps): React.ReactElement {
  const [isPending, startTransition] = useTransition();
  const dialog = useConfirmDialog();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCategory(category.id);
      if (result.success) {
        toast.success('Category deleted');
      } else {
        toast.error(result.error);
      }
      dialog.hide();
    });
  };

  return (
    <div className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <Link href={`/inventory?category=${category.id}`} className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <Package className="h-5 w-5" style={{ color: category.color }} />
          </div>
          <div>
            <h3 className="font-semibold hover:underline">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {itemCount} item{itemCount !== 1 ? 's' : ''}
            </p>
          </div>
        </Link>
        {canDelete && (
          <button
            onClick={dialog.show}
            disabled={isPending}
            className="rounded-md p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"
            aria-label={`Delete ${category.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      {category.description && (
        <p className="mt-3 text-sm text-muted-foreground">{category.description}</p>
      )}

      <ConfirmDialog
        open={dialog.open}
        onOpenChange={dialog.onOpenChange}
        title={`Delete "${category.name}"?`}
        description="This will permanently remove this category. Items in this category will become uncategorized."
        confirmLabel="Delete"
        variant="destructive"
        loading={isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
