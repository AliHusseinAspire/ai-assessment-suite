'use client';

import { ThemeProvider } from 'next-themes';
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
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider initialUser={user}>
        {children}
        <Toaster richColors position="bottom-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}
