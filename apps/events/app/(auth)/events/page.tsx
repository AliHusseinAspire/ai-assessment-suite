import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getCurrentUser } from '@/features/auth/actions';
import { getEvents } from '@/features/events/queries';
import { hasPermission } from '@/lib/auth/permissions';
import { EventsToolbar } from './events-toolbar';
import { EventsTable } from './events-table';
import type { EventStatus } from '@/prisma/generated/client';

interface EventsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    ai?: string;
  }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const user = await getCurrentUser();

  const { events, total } = await getEvents({
    search: params.search,
    status: params.status as EventStatus | undefined,
    all: true,
  });

  const canCreate = user ? hasPermission(user.role, 'events:create') : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Manage and track all your events
            <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {total}
            </span>
          </p>
        </div>
        {canCreate && (
          <Link
            href="/events/new"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-teal-400 px-5 text-sm font-medium text-white shadow-md hover:shadow-lg transition-shadow"
          >
            <Plus className="h-4 w-4" />
            New Event
          </Link>
        )}
      </div>

      <EventsToolbar
        search={params.search}
        status={params.status}
        aiEnabled={params.ai === '1'}
      />

      <EventsTable events={events} />
    </div>
  );
}
