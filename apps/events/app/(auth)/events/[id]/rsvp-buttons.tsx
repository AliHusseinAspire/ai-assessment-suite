'use client';

import { useTransition } from 'react';
import { Check, HelpCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { updateRsvp } from '@/features/events/actions';
import { cn } from '@assessment/ui/lib/utils';
import type { RsvpStatus } from '@/prisma/generated/client';

interface RsvpButtonsProps {
  eventId: string;
  currentStatus: RsvpStatus | null;
}

const RSVP_OPTIONS: { status: 'ATTENDING' | 'MAYBE' | 'DECLINED'; label: string; icon: typeof Check; activeClass: string; inactiveClass: string }[] = [
  {
    status: 'ATTENDING',
    label: 'Attending',
    icon: Check,
    activeClass: 'border-green-500 bg-green-500 text-white',
    inactiveClass: 'border-2 border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20',
  },
  {
    status: 'MAYBE',
    label: 'Maybe',
    icon: HelpCircle,
    activeClass: 'border-yellow-500 bg-yellow-500 text-white',
    inactiveClass: 'border-2 border-yellow-300 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/20',
  },
  {
    status: 'DECLINED',
    label: 'Decline',
    icon: X,
    activeClass: 'border-red-500 bg-red-500 text-white',
    inactiveClass: 'border-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20',
  },
];

export function RsvpButtons({ eventId, currentStatus }: RsvpButtonsProps): React.ReactElement {
  const [isPending, startTransition] = useTransition();

  function handleRsvp(status: 'ATTENDING' | 'MAYBE' | 'DECLINED') {
    startTransition(async () => {
      const result = await updateRsvp(eventId, status);
      if (result.success) {
        toast.success(`RSVP updated to ${status.toLowerCase()}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="mt-3 flex gap-3">
      {RSVP_OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const isActive = currentStatus === opt.status;
        return (
          <button
            key={opt.status}
            onClick={() => handleRsvp(opt.status)}
            disabled={isPending}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-all disabled:opacity-50',
              isActive ? opt.activeClass : opt.inactiveClass
            )}
          >
            <Icon className="h-4 w-4" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
