'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { CalendarDays, MapPin, Check, HelpCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { respondToInvitation } from '@/features/invitations/actions';
import type { InvitationStatus, EventStatus } from '@/prisma/generated/client';
import { motion } from 'framer-motion';

interface InvitationCardProps {
  invitation: {
    id: string;
    status: InvitationStatus;
    message: string | null;
    sender: { id: string; name: string; email: string };
    event: {
      id: string;
      title: string;
      startDate: Date;
      endDate: Date;
      location: string | null;
      color: string;
      status: EventStatus;
    };
  };
}

export function InvitationCard({ invitation }: InvitationCardProps): React.ReactElement {
  const [isPending, startTransition] = useTransition();
  const isPendingInvite = invitation.status === 'PENDING';

  function handleResponse(response: 'ACCEPTED' | 'DECLINED' | 'MAYBE') {
    startTransition(async () => {
      const result = await respondToInvitation(invitation.id, response);
      if (result.success) {
        toast.success(`Invitation ${response.toLowerCase()}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-card shadow-sm">
        {/* Left accent bar */}
        <div
          className="absolute inset-y-0 left-0 w-1"
          style={{ backgroundColor: invitation.event.color }}
        />
        <div className="p-4 pl-5">
          <div className="flex-1">
            <Link
              href={`/events/${invitation.event.id}`}
              className="font-medium hover:text-primary transition-colors"
            >
              {invitation.event.title}
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              Invited by {invitation.sender.name}
            </p>
            {invitation.message && (
              <p className="mt-1 text-xs italic text-muted-foreground">
                &quot;{invitation.message}&quot;
              </p>
            )}
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {format(new Date(invitation.event.startDate), 'MMM d, h:mm a')}
              </div>
              {invitation.event.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {invitation.event.location}
                </div>
              )}
            </div>
          </div>

          {isPendingInvite && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleResponse('ACCEPTED')}
                disabled={isPending}
                className="inline-flex h-8 items-center gap-1 rounded-full bg-green-600 px-3 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                Accept
              </button>
              <button
                onClick={() => handleResponse('MAYBE')}
                disabled={isPending}
                className="inline-flex h-8 items-center gap-1 rounded-full border border-input px-3 text-xs font-medium hover:bg-accent disabled:opacity-50"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Maybe
              </button>
              <button
                onClick={() => handleResponse('DECLINED')}
                disabled={isPending}
                className="inline-flex h-8 items-center gap-1 rounded-full border border-input px-3 text-xs font-medium text-destructive hover:bg-accent disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
                Decline
              </button>
            </div>
          )}

          {!isPendingInvite && (
            <div className="mt-3">
              <span className="text-xs font-medium capitalize">{invitation.status.toLowerCase()}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
