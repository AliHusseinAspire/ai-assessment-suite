'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { CalendarDays, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface UpcomingEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
  owner: { id: string; name: string };
  _count: { rsvps: number };
}

interface UpcomingEventsProps {
  events: UpcomingEvent[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps): React.ReactElement {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      <h2 className="text-sm font-semibold">Upcoming Events</h2>
      {events.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No upcoming events</p>
      ) : (
        <div className="mt-4 space-y-2">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Link
                href={`/events/${event.id}`}
                className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/60"
              >
                <div
                  className="h-10 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{event.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {format(new Date(event.startDate), 'MMM d, h:mm a')}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                      <Users className="h-3 w-3" />
                      {event._count.rsvps}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
