'use client';

import { useActionState, useState } from 'react';
import { createCategory } from '@/features/categories/actions';
import { toast } from 'sonner';
import type { ActionResult } from '@/features/auth/types';
import type { Category } from '@/prisma/generated/client';

export function CategoryForm(): React.ReactElement {
  const [color, setColor] = useState('#6366f1');
  const [name, setName] = useState('');
  const [state, formAction, isPending] = useActionState<ActionResult<Category> | null, FormData>(
    async (_prevState, formData) => {
      const result = await createCategory(formData);
      if (result.success) {
        toast.success('Category created');
        setName('');
      }
      return result;
    },
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      {state && !state.success && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive sm:col-span-full">
          {state.error}
        </div>
      )}

      <div className="flex-1 space-y-2">
        <label htmlFor="cat-name" className="text-sm font-medium">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="cat-name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Electronics"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="flex-1 space-y-2">
        <label htmlFor="cat-description" className="text-sm font-medium">
          Description <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          id="cat-description"
          name="description"
          type="text"
          placeholder="Brief description"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="flex items-end gap-4">
        <div className="space-y-2">
          <label htmlFor="cat-color" className="text-sm font-medium">
            Color
          </label>
          <div className="relative h-10 w-10">
            <input
              id="cat-color"
              name="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <div
              className="pointer-events-none h-10 w-10 rounded-full border-2 border-muted shadow-sm"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || !name.trim()}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPending ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
}
