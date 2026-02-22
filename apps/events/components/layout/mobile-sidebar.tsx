'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, LayoutDashboard, CalendarDays, Calendar, Mail, Users, Settings } from 'lucide-react';
import { cn } from '@assessment/ui/lib/utils';
import { Logo } from '@/components/logo';
import type { EventRole } from '@/prisma/generated/client';
import { hasPermission } from '@/lib/auth/permissions';
import { useEffect } from 'react';

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

interface MobileSidebarProps {
  role: EventRole;
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ role, open, onClose }: MobileSidebarProps): React.ReactElement | null {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!open) return null;

  const filteredItems = NAV_ITEMS.filter(
    (item) => !item.permission || hasPermission(role, item.permission)
  );

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-foreground shadow-xl lg:hidden">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Logo />
          <button onClick={onClose} className="rounded-md p-2 hover:bg-sidebar-accent" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 px-2 py-4">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
