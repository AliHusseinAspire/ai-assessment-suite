import { format } from 'date-fns';
import Link from 'next/link';

interface Activity {
  id: string;
  action: string;
  createdAt: Date;
  user: { id: string; name: string };
  event: { id: string; title: string } | null;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps): React.ReactElement {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      <h2 className="text-sm font-semibold">Recent Activity</h2>
      {activities.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No recent activity</p>
      ) : (
        <div className="relative mt-4 space-y-4 pl-6">
          {/* Vertical timeline line */}
          <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />

          {activities.map((activity) => (
            <div key={activity.id} className="relative text-sm">
              {/* Timeline dot */}
              <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
              <div className="min-w-0">
                <p>
                  <span className="font-medium">{activity.user.name}</span>{' '}
                  {activity.action}
                  {activity.event != null ? (
                    <>
                      {' '}
                      <Link
                        href={`/events/${activity.event.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {activity.event.title}
                      </Link>
                    </>
                  ) : null}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(activity.createdAt), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
