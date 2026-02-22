'use client';

import { usePathname } from 'next/navigation';

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  events: 'Events',
  calendar: 'Calendar',
  invitations: 'Invitations',
  users: 'Users',
  settings: 'Settings',
  new: 'New',
  edit: 'Edit',
};

export function Breadcrumbs(): React.ReactElement {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const label = segments.length > 0
    ? ROUTE_LABELS[segments[segments.length - 1]] ?? segments[segments.length - 1]
    : '';

  if (!label) return <div />;

  const parentLabel = segments.length > 1
    ? ROUTE_LABELS[segments[segments.length - 2]] ?? null
    : null;

  return (
    <div className="text-sm text-muted-foreground">
      {parentLabel && (
        <>
          <span>{parentLabel}</span>
          <span className="mx-1.5">/</span>
        </>
      )}
      <span className="font-medium text-foreground">{label}</span>
    </div>
  );
}
