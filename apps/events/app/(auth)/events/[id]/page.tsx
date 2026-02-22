import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { CalendarDays, MapPin, Users, Clock, Pencil } from 'lucide-react';
import { cn } from '@assessment/ui/lib/utils';
import { getEvent } from '@/features/events/queries';
import { getCurrentUser } from '@/features/auth/actions';
import { hasPermission } from '@/lib/auth/permissions';
import { EVENT_STATUS_COLORS, RSVP_STATUS_COLORS } from '@/features/events/constants';
import { RsvpButtons } from './rsvp-buttons';
import { EventActions } from './event-actions';
import { InviteButton } from './invite-button';
import { InfoTooltip } from '@/components/ui/info-tooltip';

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const [event, user] = await Promise.all([getEvent(id), getCurrentUser()]);

  if (!event || !user) notFound();

  const canEdit =
    user.role === 'OWNER' || (user.role === 'MEMBER' && event.ownerId === user.id);
  const canDelete = user.role === 'OWNER';
  const canInvite = hasPermission(user.role, 'invitations:send');

  const userRsvp = event.rsvps.find((r) => r.userId === user.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Hero banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{
          background: `linear-gradient(135deg, ${event.color}20, ${event.color}08)`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{event.title}</h1>
              <span
                className={cn(
                  'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                  EVENT_STATUS_COLORS[event.status]
                )}
              >
                {event.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Created by {event.owner.name}
            </p>
          </div>
          <div className="flex gap-2">
            {canEdit && (
              <Link
                href={`/events/${id}/edit`}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-input bg-background/80 px-4 text-sm hover:bg-accent"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            )}
            {canDelete && <EventActions eventId={id} />}
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="h-4 w-4 text-primary" />
            Date & Time
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {event.allDay ? (
              <p>{format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}</p>
            ) : (
              <>
                <p>{format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}</p>
                <p>
                  {format(new Date(event.startDate), 'h:mm a')} – {format(new Date(event.endDate), 'h:mm a')}
                </p>
              </>
            )}
          </div>
        </div>
        {event.location && (
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              Location
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{event.location}</p>
          </div>
        )}
        {event.maxAttendees != null && (
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-primary" />
              Capacity
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {event.rsvps.filter((r) => r.status === 'ATTENDING').length} / {event.maxAttendees} attending
            </p>
          </div>
        )}
      </div>

      {event.description && (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-sm font-medium">Description</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {event.description}
          </p>
        </div>
      )}

      {/* RSVP */}
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-medium">Your RSVP</h2>
          <InfoTooltip
            label="What is RSVP?"
            text="RSVP (R&eacute;pondez s'il vous pla&icirc;t) — let the organizer know if you're attending, might attend, or won't make it."
          />
        </div>
        <RsvpButtons
          eventId={id}
          currentStatus={userRsvp?.status ?? null}
        />
      </div>

      {/* Invite */}
      {canInvite && event.status !== 'CANCELLED' && (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Invite People</h2>
            <InviteButton eventId={id} />
          </div>
        </div>
      )}

      {/* Attendees */}
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <h2 className="text-sm font-medium">
          Attendees
          <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs">
            {event.rsvps.length}
          </span>
        </h2>
        {event.rsvps.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No RSVPs yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {event.rsvps.map((rsvp) => (
              <div key={rsvp.id} className="flex items-center justify-between rounded-xl p-2 text-sm hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-teal-400/20 text-xs font-medium">
                    {rsvp.user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                  <div>
                    <span className="font-medium">{rsvp.user.name}</span>
                    <p className="text-xs text-muted-foreground">{rsvp.user.email}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                    RSVP_STATUS_COLORS[rsvp.status]
                  )}
                >
                  {rsvp.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity */}
      {event.activities.length > 0 && (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-sm font-medium">Recent Activity</h2>
          <div className="relative mt-3 space-y-4 pl-6">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
            {event.activities.map((activity) => (
              <div key={activity.id} className="relative text-sm">
                <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                <div>
                  <p>
                    <span className="font-medium">{activity.user.name}</span>{' '}
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.createdAt), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
