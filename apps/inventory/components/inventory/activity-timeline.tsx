import { formatDistanceToNow } from 'date-fns';
import { Plus, Pencil, Trash2, ArrowRightLeft } from 'lucide-react';

interface Activity {
  id: string;
  action: string;
  details: unknown;
  createdAt: Date;
  user: { id: string; name: string; email: string };
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CREATED: Plus,
  UPDATED: Pencil,
  DELETED: Trash2,
  STATUS_CHANGE: ArrowRightLeft,
};

export function ActivityTimeline({ activities }: ActivityTimelineProps): React.ReactElement {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = ACTION_ICONS[activity.action] ?? Pencil;
        const details = activity.details as Record<string, unknown> | null;

        return (
          <div key={activity.id} className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span>
                {' '}
                <span className="text-muted-foreground">
                  {activity.action.toLowerCase().replace('_', ' ')}
                </span>
              </p>
              {details?.message != null ? (
                <p className="text-xs text-muted-foreground">
                  {String(details.message)}
                </p>
              ) : null}
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
