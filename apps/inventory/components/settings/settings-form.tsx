'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/features/settings/actions';
import { toast } from 'sonner';
import type { AuthUser, ActionResult } from '@/features/auth/types';

interface SettingsFormProps {
  user: AuthUser;
}

export function SettingsForm({ user }: SettingsFormProps): React.ReactElement {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    async (_prevState, formData) => {
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
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="settings-name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="settings-name"
          name="name"
          type="text"
          defaultValue={user.name}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
