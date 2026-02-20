import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowRightLeft } from 'lucide-react';

interface Activity {
  id: string;
  action: string;
  details: unknown;
  createdAt: Date;
  user: { id: string; name: string };
  item: { id: string; name: string } | null;
}

interface RecentActivityProps {
  activities: Activity[];
}

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CREATED: Plus,
  UPDATED: Pencil,
  DELETED: Trash2,
  STATUS_CHANGE: ArrowRightLeft,
};

export function RecentActivity({ activities }: RecentActivityProps): React.ReactElement {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent activity.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = ACTION_ICONS[activity.action] ?? Pencil;
            return (
              <div key={activity.id} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>
                    {' '}
                    <span className="text-muted-foreground">
                      {activity.action.toLowerCase().replace('_', ' ')}
                    </span>
                    {activity.item && (
                      <>
                        {' '}
                        <Link
                          href={`/inventory/${activity.item.id}`}
                          className="font-medium hover:underline"
                        >
                          {activity.item.name}
                        </Link>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
