'use client';

import { LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { signOut } from '@/features/auth/actions';
import type { AuthUser } from '@/features/auth/types';
import { useState, useRef, useEffect } from 'react';
import { RoleBadge } from '@/components/role-badge';

interface UserNavProps {
  user: AuthUser;
}

export function UserNav({ user }: UserNavProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground hover:opacity-90"
        aria-label="User menu"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <RoleBadge role={user.role} className="mt-1" />
          </div>
          <div className="my-1 h-px bg-border" />
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
          <div className="my-1 h-px bg-border" />
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-accent"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
