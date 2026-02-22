import { notFound, redirect } from 'next/navigation';
import { getEvent } from '@/features/events/queries';
import { getCurrentUser } from '@/features/auth/actions';
import { EventForm } from '../../event-form';

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const [event, user] = await Promise.all([getEvent(id), getCurrentUser()]);

  if (!event || !user) notFound();

  const canEdit =
    user.role === 'OWNER' || (user.role === 'MEMBER' && event.ownerId === user.id);
  if (!canEdit) redirect(`/events/${id}`);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
        <p className="text-muted-foreground">Update the event details below.</p>
      </div>
      <EventForm userId={user.id} event={event} />
    </div>
  );
}
