'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createItem, updateItem } from '@/features/inventory/actions';
import { ITEM_STATUSES } from '@/features/inventory/constants';
import type { InventoryItem, Category } from '@prisma/client';
import type { ActionResult } from '@/features/auth/types';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

interface ItemFormProps {
  item?: InventoryItem | null;
  categories: Category[];
}

export function ItemForm({ item, categories }: ItemFormProps): React.ReactElement {
  const router = useRouter();
  const isEdit = !!item;
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState<ActionResult<InventoryItem> | null, FormData>(
    async (_prevState, formData) => {
      const result = isEdit ? await updateItem(formData) : await createItem(formData);
      if (result.success) {
        toast.success(isEdit ? 'Item updated' : 'Item created');
        router.push('/inventory');
      }
      return result;
    },
    null
  );

  const handleAICategorize = async (name: string) => {
    if (!name.trim()) return;
    setAiLoading('categorize');
    try {
      const res = await fetch('/api/ai/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestedCategory(data.categoryId);
      }
    } catch {
      // AI feature is non-blocking
    } finally {
      setAiLoading(null);
    }
  };

  const handleAIDescribe = async (name: string) => {
    if (!name.trim()) return;
    setAiLoading('describe');
    try {
      const res = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedDescription(data.description);
      }
    } catch {
      // AI feature is non-blocking
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      {isEdit && <input type="hidden" name="id" value={item.id} />}

      {state && !state.success && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={item?.name}
            onBlur={(e) => {
              if (!isEdit) handleAICategorize(e.target.value);
            }}
            placeholder="e.g., Wireless Keyboard"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* Description */}
        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <button
              type="button"
              onClick={() => {
                const nameInput = document.getElementById('name') as HTMLInputElement;
                if (nameInput?.value) handleAIDescribe(nameInput.value);
              }}
              disabled={aiLoading === 'describe'}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
            >
              <Sparkles className="h-3 w-3" />
              {aiLoading === 'describe' ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={generatedDescription ?? item?.description ?? ''}
            key={generatedDescription ?? 'default'}
            placeholder="Describe this item..."
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* SKU */}
        <div className="space-y-2">
          <label htmlFor="sku" className="text-sm font-medium">
            SKU <span className="text-destructive">*</span>
          </label>
          <input
            id="sku"
            name="sku"
            type="text"
            required
            defaultValue={item?.sku}
            placeholder="e.g., ELEC-001"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="categoryId" className="text-sm font-medium">
            Category <span className="text-destructive">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={suggestedCategory ?? item?.categoryId ?? ''}
            key={suggestedCategory ?? 'default'}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {suggestedCategory && aiLoading !== 'categorize' && (
            <p className="text-xs text-primary">
              <Sparkles className="inline h-3 w-3 mr-1" />
              AI suggested this category
            </p>
          )}
          {aiLoading === 'categorize' && (
            <p className="text-xs text-muted-foreground">AI is suggesting a category...</p>
          )}
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <label htmlFor="quantity" className="text-sm font-medium">
            Quantity <span className="text-destructive">*</span>
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            required
            min="0"
            defaultValue={item?.quantity ?? 0}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">
            Price ($) <span className="text-destructive">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            required
            min="0"
            step="0.01"
            defaultValue={item?.price ?? 0}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={item?.status ?? 'IN_STOCK'}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {ITEM_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Supplier */}
        <div className="space-y-2">
          <label htmlFor="supplier" className="text-sm font-medium">
            Supplier
          </label>
          <input
            id="supplier"
            name="supplier"
            type="text"
            defaultValue={item?.supplier ?? ''}
            placeholder="e.g., Apple Inc."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* Min Stock */}
        <div className="space-y-2">
          <label htmlFor="minStock" className="text-sm font-medium">
            Min Stock Threshold
          </label>
          <input
            id="minStock"
            name="minStock"
            type="number"
            min="0"
            defaultValue={item?.minStock ?? 10}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* Max Stock */}
        <div className="space-y-2">
          <label htmlFor="maxStock" className="text-sm font-medium">
            Max Stock Capacity
          </label>
          <input
            id="maxStock"
            name="maxStock"
            type="number"
            min="1"
            defaultValue={item?.maxStock ?? 100}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : isEdit ? 'Update Item' : 'Create Item'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-10 items-center justify-center rounded-md border px-6 py-2 text-sm font-medium hover:bg-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
