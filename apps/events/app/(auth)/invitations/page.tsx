import { getCurrentUser } from '@/features/auth/actions';
import { getReceivedInvitations } from '@/features/invitations/queries';
import { redirect } from 'next/navigation';
import { InvitationCard } from './invitation-card';
import { Mail } from 'lucide-react';

export default async function InvitationsPage(): Promise<React.ReactElement> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const invitations = await getReceivedInvitations(user.id);

  const pending = invitations.filter((i) => i.status === 'PENDING');
  const responded = invitations.filter((i) => i.status !== 'PENDING');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invitations</h1>
        <p className="text-muted-foreground">
          Manage your event invitations
          <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {invitations.length}
          </span>
        </p>
      </div>

      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            Pending
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              {pending.length}
            </span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((inv) => (
              <InvitationCard key={inv.id} invitation={inv} />
            ))}
          </div>
        </div>
      )}

      {responded.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            Responded
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
              {responded.length}
            </span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {responded.map((inv) => (
              <InvitationCard key={inv.id} invitation={inv} />
            ))}
          </div>
        </div>
      )}

      {invitations.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed bg-gradient-to-br from-primary/5 to-teal-400/5 text-muted-foreground">
          <Mail className="mb-2 h-8 w-8" />
          <p>No invitations yet</p>
        </div>
      )}
    </div>
  );
}
