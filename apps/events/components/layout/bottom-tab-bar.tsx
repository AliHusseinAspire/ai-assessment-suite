'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  Mail,
  MoreHorizontal,
  Users,
  Settings,
} from 'lucide-react';
import { cn } from '@assessment/ui/lib/utils';
import type { EventRole } from '@/prisma/generated/client';
import { hasPermission } from '@/lib/auth/permissions';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Parameters<typeof hasPermission>[1];
}

const PRIMARY_TABS: NavItem[] = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard, permission: 'dashboard:read' },
  { label: 'Events', href: '/events', icon: CalendarDays, permission: 'events:read' },
  { label: 'Calendar', href: '/calendar', icon: Calendar, permission: 'calendar:read' },
  { label: 'Inbox', href: '/invitations', icon: Mail, permission: 'invitations:read' },
];

const OVERFLOW_ITEMS: NavItem[] = [
  { label: 'Users', href: '/users', icon: Users, permission: 'users:manage' },
  { label: 'Settings', href: '/settings', icon: Settings, permission: 'settings:read' },
];

interface BottomTabBarProps {
  role: EventRole;
}

export function BottomTabBar({ role }: BottomTabBarProps): React.ReactElement {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const filteredPrimary = PRIMARY_TABS.filter(
    (item) => !item.permission || hasPermission(role, item.permission)
  );

  const filteredOverflow = OVERFLOW_ITEMS.filter(
    (item) => !item.permission || hasPermission(role, item.permission)
  );

  const isOverflowActive = OVERFLOW_ITEMS.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <>
      {/* Overflow menu */}
      {moreOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setMoreOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed bottom-16 right-2 z-50 w-48 rounded-2xl border bg-popover p-1 shadow-xl lg:hidden">
            {filteredOverflow.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/90 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
          {filteredPrimary.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 text-[11px] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {isActive && (
                  <span className="h-1 w-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}

          {filteredOverflow.length > 0 && (
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 text-[11px] font-medium transition-colors',
                isOverflowActive || moreOpen ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <MoreHorizontal className="h-5 w-5" />
              <span>More</span>
              {isOverflowActive && (
                <span className="h-1 w-1 rounded-full bg-primary" />
              )}
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
