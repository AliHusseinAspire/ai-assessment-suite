'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  inventory: 'Inventory',
  categories: 'Categories',
  users: 'Users',
  settings: 'Settings',
  new: 'New',
  edit: 'Edit',
};

export function Breadcrumbs(): React.ReactElement {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return <div />;

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:block">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link href="/dashboard" className="hover:text-foreground">
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const label = ROUTE_LABELS[segment] ?? segment;
          const isLast = index === segments.length - 1;

          return (
            <li key={href} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4" />
              {isLast ? (
                <span className="font-medium text-foreground">{label}</span>
              ) : (
                <Link href={href} className="hover:text-foreground">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
