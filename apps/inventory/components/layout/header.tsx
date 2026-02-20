'use client';

import { Menu } from 'lucide-react';
import { UserNav } from './user-nav';
import { ThemeToggle } from './theme-toggle';
import { Breadcrumbs } from './breadcrumbs';
import type { AuthUser } from '@/features/auth/types';

interface HeaderProps {
  user: AuthUser;
  onMenuClick: () => void;
}

export function Header({ user, onMenuClick }: HeaderProps): React.ReactElement {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 hover:bg-accent lg:hidden"
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Breadcrumbs />

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <UserNav user={user} />
      </div>
    </header>
  );
}
