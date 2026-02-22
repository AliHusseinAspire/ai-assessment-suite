'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  Mail,
  Users,
  Settings,
  Search,
} from 'lucide-react';
import { cn } from '@assessment/ui/lib/utils';
import { Logo } from '@/components/logo';
import { ThemeToggle } from './theme-toggle';
import { UserNav } from './user-nav';
import type { AuthUser } from '@/features/auth/types';
import type { EventRole } from '@/prisma/generated/client';
import { hasPermission } from '@/lib/auth/permissions';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Parameters<typeof hasPermission>[1];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, permission: 'dashboard:read' },
  { label: 'Events', href: '/events', icon: CalendarDays, permission: 'events:read' },
  { label: 'Calendar', href: '/calendar', icon: Calendar, permission: 'calendar:read' },
  { label: 'Invitations', href: '/invitations', icon: Mail, permission: 'invitations:read' },
  { label: 'Users', href: '/users', icon: Users, permission: 'users:manage' },
  { label: 'Settings', href: '/settings', icon: Settings, permission: 'settings:read' },
];

interface TopNavProps {
  user: AuthUser;
  onCommandPalette?: () => void;
}

export function TopNav({ user, onCommandPalette }: TopNavProps): React.ReactElement {
  const pathname = usePathname();

  const filteredItems = NAV_ITEMS.filter(
    (item) => !item.permission || hasPermission(user.role as EventRole, item.permission)
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="shrink-0">
          <Logo />
        </Link>

        {/* Center nav — desktop only */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {filteredItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {onCommandPalette && (
            <button
              onClick={onCommandPalette}
              className="hidden items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:flex"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search...</span>
              <kbd className="pointer-events-none rounded bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </button>
          )}
          <ThemeToggle />
          <UserNav user={user} />
        </div>
      </div>
    </header>
  );
}
