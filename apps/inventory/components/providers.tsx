'use client';

import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth/auth-provider';
import type { AuthUser } from '@/features/auth/types';

export function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AuthUser | null;
}): React.ReactElement {
  return (
    <AuthProvider initialUser={user}>
      {children}
      <Toaster richColors position="bottom-right" />
    </AuthProvider>
  );
}
