'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { MapPin, Users, CalendarDays } from 'lucide-react';
import { cn } from '@assessment/ui/lib/utils';
import { EVENT_STATUS_COLORS } from '@/features/events/constants';
import { motion } from 'framer-motion';
import type { EventStatus } from '@/prisma/generated/client';

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  status: EventStatus;
  color: string;
  owner: { id: string; name: string; email: string };
  _count: { rsvps: number; invitations: number };
}

interface EventsTableProps {
  events: EventRow[];
}

export function EventsTable({ events }: EventsTableProps): React.ReactElement {
  if (events.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed text-muted-foreground">
        No events found. Create your first event to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
        >
          <Link
            href={`/events/${event.id}`}
            className="group block overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Gradient top bar */}
            <div
              className="h-1.5"
              style={{
                background: `linear-gradient(to right, ${event.color}, ${event.color}88)`,
              }}
            />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="truncate font-semibold group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase',
                    EVENT_STATUS_COLORS[event.status]
                  )}
                >
                  {event.status}
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>
                    {event.allDay
                      ? format(new Date(event.startDate), 'MMM d, yyyy')
                      : format(new Date(event.startDate), 'MMM d, h:mm a')}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  by {event.owner.name}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {event._count.rsvps}
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
