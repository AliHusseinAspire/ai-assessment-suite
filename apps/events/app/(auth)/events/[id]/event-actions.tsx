'use client';

import { useTransition } from 'react';
import { Trash2, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { deleteEvent, cancelEvent } from '@/features/events/actions';
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/confirm-dialog';

interface EventActionsProps {
  eventId: string;
}

export function EventActions({ eventId }: EventActionsProps): React.ReactElement {
  const deleteDialog = useConfirmDialog();
  const cancelDialog = useConfirmDialog();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteEvent(eventId);
      if (!result.success) {
        toast.error(result.error);
      }
    });
  }

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelEvent(eventId);
      if (result.success) {
        toast.success('Event cancelled');
        cancelDialog.hide();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <button
        onClick={cancelDialog.show}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-input px-4 text-sm text-yellow-600 hover:bg-accent"
      >
        <Ban className="h-4 w-4" />
        Cancel
      </button>
      <button
        onClick={deleteDialog.show}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-input px-4 text-sm text-destructive hover:bg-accent"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={deleteDialog.onOpenChange}
        title="Delete Event"
        description="This will permanently delete this event and all associated RSVPs and invitations. This cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={isPending}
        onConfirm={handleDelete}
      />
      <ConfirmDialog
        open={cancelDialog.open}
        onOpenChange={cancelDialog.onOpenChange}
        title="Cancel Event"
        description="This will mark the event as cancelled. Attendees will see the updated status."
        confirmLabel="Cancel Event"
        variant="destructive"
        loading={isPending}
        onConfirm={handleCancel}
      />
    </>
  );
}
