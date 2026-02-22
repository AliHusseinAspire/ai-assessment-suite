'use client';

import { useActionState } from 'react';
import { toast } from 'sonner';
import { updateProfile } from '@/features/users/actions';
import type { AuthUser, ActionResult } from '@/features/auth/types';

interface SettingsFormProps {
  user: AuthUser;
}

export function SettingsForm({ user }: SettingsFormProps): React.ReactElement {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('Profile updated');
      }
      return result;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {state && !state.success && (
        <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Display Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={user.name}
          required
          className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-primary to-teal-400 px-8 text-sm font-medium text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
