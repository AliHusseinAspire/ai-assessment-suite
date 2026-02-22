'use client';

import { useEffect, useCallback } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  Mail,
  Users,
  Settings,
  Plus,
  Search,
} from 'lucide-react';
import type { EventRole } from '@/prisma/generated/client';
import { hasPermission } from '@/lib/auth/permissions';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: EventRole;
}

interface CommandItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
  permission?: Parameters<typeof hasPermission>[1];
}

const ITEMS: CommandItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, group: 'Navigation', permission: 'dashboard:read' },
  { label: 'Events', href: '/events', icon: CalendarDays, group: 'Navigation', permission: 'events:read' },
  { label: 'Calendar', href: '/calendar', icon: Calendar, group: 'Navigation', permission: 'calendar:read' },
  { label: 'Invitations', href: '/invitations', icon: Mail, group: 'Navigation', permission: 'invitations:read' },
  { label: 'Users', href: '/users', icon: Users, group: 'Navigation', permission: 'users:manage' },
  { label: 'Settings', href: '/settings', icon: Settings, group: 'Navigation', permission: 'settings:read' },
  { label: 'Create New Event', href: '/events/new', icon: Plus, group: 'Actions', permission: 'events:create' },
];

export function CommandPalette({ open, onOpenChange, role }: CommandPaletteProps): React.ReactElement | null {
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    },
    [open, onOpenChange]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const filteredItems = ITEMS.filter(
    (item) => !item.permission || hasPermission(role, item.permission)
  );

  const groups = filteredItems.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div className="fixed inset-x-0 top-[20%] z-50 mx-auto w-full max-w-lg px-4">
        <Command
          className="overflow-hidden rounded-2xl border bg-popover shadow-2xl"
          shouldFilter={true}
        >
          <div className="flex items-center gap-2 border-b px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              placeholder="Search pages, actions..."
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
          </div>
          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            {Object.entries(groups).map(([group, items]) => (
              <Command.Group key={group} heading={group} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Command.Item
                      key={item.href}
                      value={item.label}
                      onSelect={() => {
                        router.push(item.href);
                        onOpenChange(false);
                      }}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm aria-selected:bg-accent"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {item.label}
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </div>
    </>
  );
}
