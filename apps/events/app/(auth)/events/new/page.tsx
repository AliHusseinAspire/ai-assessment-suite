import { getCurrentUser } from '@/features/auth/actions';
import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/permissions';
import { EventForm } from '../event-form';

export default async function NewEventPage(): Promise<React.ReactElement> {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, 'events:create')) {
    redirect('/events');
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Event</h1>
        <p className="text-muted-foreground">
          Fill in the details below or use AI to create an event from a description.
        </p>
      </div>
      <EventForm userId={user.id} />
    </div>
  );
}
