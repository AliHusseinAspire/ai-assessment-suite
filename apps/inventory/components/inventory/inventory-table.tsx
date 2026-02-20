'use client';

import Link from 'next/link';
import { Eye, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { StatusBadge } from './status-badge';
import { useState, useTransition } from 'react';
import { deleteItem } from '@/features/inventory/actions';
import { toast } from 'sonner';
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/confirm-dialog';
import type { InventoryItem, Category } from '@prisma/client';

interface InventoryTableProps {
  items: (InventoryItem & { category: Category })[];
  canEdit: boolean;
  canDelete: boolean;
}

export function InventoryTable({ items, canEdit, canDelete }: InventoryTableProps): React.ReactElement {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <p className="text-lg font-medium text-muted-foreground">No items found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new item.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">SKU</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-right font-medium">Qty</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <MobileCard key={item.id} item={item} canEdit={canEdit} canDelete={canDelete} />
        ))}
      </div>
    </>
  );
}

function TableRow({
  item,
  canEdit,
  canDelete,
}: {
  item: InventoryItem & { category: Category };
  canEdit: boolean;
  canDelete: boolean;
}): React.ReactElement {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className="hover:bg-muted/50">
      <td className="px-4 py-3">
        <Link href={`/inventory/${item.id}`} className="font-medium hover:underline">
          {item.name}
        </Link>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{item.sku}</td>
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ backgroundColor: `${item.category.color}20`, color: item.category.color }}
        >
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.category.color }} />
          {item.category.name}
        </span>
      </td>
      <td className="px-4 py-3 text-right tabular-nums">{item.quantity}</td>
      <td className="px-4 py-3 text-right tabular-nums">${item.price.toFixed(2)}</td>
      <td className="px-4 py-3">
        <StatusBadge status={item.status} />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="rounded-md p-1 hover:bg-accent"
            aria-label="Actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {showActions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
              <div className="absolute right-0 z-20 mt-1 w-36 rounded-md border bg-popover p-1 shadow-lg">
                <Link
                  href={`/inventory/${item.id}`}
                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  onClick={() => setShowActions(false)}
                >
                  <Eye className="h-4 w-4" />
                  View
                </Link>
                {canEdit && (
                  <Link
                    href={`/inventory/${item.id}/edit`}
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                    onClick={() => setShowActions(false)}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                )}
                {canDelete && (
                  <DeleteButton itemId={item.id} itemName={item.name} onDone={() => setShowActions(false)} />
                )}
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

function MobileCard({
  item,
  canEdit,
  canDelete,
}: {
  item: InventoryItem & { category: Category };
  canEdit: boolean;
  canDelete: boolean;
}): React.ReactElement {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div>
          <Link href={`/inventory/${item.id}`} className="font-medium hover:underline">
            {item.name}
          </Link>
          <p className="text-sm text-muted-foreground">{item.sku}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
          style={{ backgroundColor: `${item.category.color}20`, color: item.category.color }}
        >
          {item.category.name}
        </span>
        <div className="flex items-center gap-4">
          <span>Qty: <strong>{item.quantity}</strong></span>
          <span>${item.price.toFixed(2)}</span>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Link
          href={`/inventory/${item.id}`}
          className="flex-1 inline-flex h-8 items-center justify-center rounded-md border text-xs font-medium hover:bg-accent"
        >
          View
        </Link>
        {canEdit && (
          <Link
            href={`/inventory/${item.id}/edit`}
            className="flex-1 inline-flex h-8 items-center justify-center rounded-md border text-xs font-medium hover:bg-accent"
          >
            Edit
          </Link>
        )}
        {canDelete && (
          <DeleteButton itemId={item.id} itemName={item.name} />
        )}
      </div>
    </div>
  );
}

function DeleteButton({
  itemId,
  itemName,
  onDone,
}: {
  itemId: string;
  itemName: string;
  onDone?: () => void;
}): React.ReactElement {
  const [isPending, startTransition] = useTransition();
  const dialog = useConfirmDialog();

  return (
    <>
      <button
        disabled={isPending}
        onClick={dialog.show}
        className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-accent md:flex-none"
      >
        <Trash2 className="h-4 w-4" />
        <span className="md:inline">Delete</span>
      </button>

      <ConfirmDialog
        open={dialog.open}
        onOpenChange={(open) => {
          dialog.onOpenChange(open);
          if (!open) onDone?.();
        }}
        title={`Delete "${itemName}"?`}
        description="This action cannot be undone. The item will be permanently removed from your inventory."
        confirmLabel="Delete"
        variant="destructive"
        loading={isPending}
        onConfirm={() => {
          startTransition(async () => {
            const result = await deleteItem(itemId);
            if (result.success) {
              toast.success('Item deleted');
            } else {
              toast.error(result.error);
            }
            dialog.hide();
            onDone?.();
          });
        }}
      />
    </>
  );
}
