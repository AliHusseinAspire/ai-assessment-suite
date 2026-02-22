'use client';

import { useState, useCallback } from 'react';
import { TopNav } from './layout/top-nav';
import { BottomTabBar } from './layout/bottom-tab-bar';
import { NavigationProgress } from './navigation-progress';
import { CommandPalette } from './command-palette';
import type { AuthUser } from '@/features/auth/types';
import type { EventRole } from '@/prisma/generated/client';

interface AppShellProps {
  children: React.ReactNode;
  user: AuthUser;
}

export function AppShell({ children, user }: AppShellProps): React.ReactElement {
  const [commandOpen, setCommandOpen] = useState(false);

  const handleCommandPalette = useCallback(() => setCommandOpen(true), []);

  return (
    <div className="min-h-screen">
      <NavigationProgress />
      <TopNav user={user} onCommandPalette={handleCommandPalette} />

      <main className="mx-auto max-w-7xl px-4 py-6 pb-20 sm:px-6 lg:pb-6">
        {children}
      </main>

      <BottomTabBar role={user.role as EventRole} />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} role={user.role as EventRole} />
    </div>
  );
}
