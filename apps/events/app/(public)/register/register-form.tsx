'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signUp } from '@/features/auth/actions';
import { PasswordInput } from '@/components/ui/password-input';
import type { ActionResult } from '@/features/auth/types';

export function RegisterForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    async (_prevState, formData) => {
      return signUp(formData);
    },
    null
  );

  if (state?.success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/20">
        <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Check your email</h3>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
          We sent a verification link to your email. Please confirm it, then{' '}
          <Link href="/login" className="font-medium underline">sign in</Link>.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state && !state.success && (
        <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="John Doe"
          className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

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
          className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
          autoComplete="new-password"
          placeholder="At least 6 characters"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          required
          autoComplete="new-password"
          placeholder="Repeat your password"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-teal-400 px-4 py-2 text-sm font-medium text-white shadow-md transition-shadow hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
      >
        {isPending ? 'Creating account...' : 'Create account'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
