'use client';

import { useState, useTransition } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { sendInvitation } from '@/features/invitations/actions';

interface InviteButtonProps {
  eventId: string;
}

export function InviteButton({ eventId }: InviteButtonProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleInvite() {
    if (!email.trim()) return;
    startTransition(async () => {
      const result = await sendInvitation(eventId, email.trim(), message || undefined);
      if (result.success) {
        toast.success('Invitation sent');
        setEmail('');
        setMessage('');
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-8 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-teal-400 px-4 text-xs font-medium text-white hover:shadow-md transition-shadow"
      >
        <UserPlus className="h-3.5 w-3.5" />
        Invite
      </button>
    );
  }

  return (
    <div className="mt-3 space-y-3 rounded-2xl bg-muted/50 p-4 shadow-sm">
      <div className="space-y-2">
        <label htmlFor="invite-email" className="text-xs font-medium">
          Email address
        </label>
        <input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="colleague@company.com"
          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="invite-message" className="text-xs font-medium">
          Message (optional)
        </label>
        <input
          id="invite-message"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="You're invited to..."
          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleInvite}
          disabled={isPending || !email.trim()}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-teal-400 px-4 text-xs font-medium text-white hover:shadow-md transition-shadow disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
          Send
        </button>
        <button
          onClick={() => setOpen(false)}
          className="inline-flex h-9 items-center rounded-full border border-input px-4 text-xs hover:bg-accent"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
