'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signIn } from '@/features/auth/actions';
import { PasswordInput } from '@/components/ui/password-input';
import type { ActionResult } from '@/features/auth/types';

export function LoginForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    async (_prevState, formData) => {
      return signIn(formData);
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
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <PasswordInput
          id="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        {isPending ? 'Signing in...' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
