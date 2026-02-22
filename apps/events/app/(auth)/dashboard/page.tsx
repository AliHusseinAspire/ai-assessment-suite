import { getCurrentUser } from '@/features/auth/actions';
import { getDashboardStats } from '@/features/dashboard/queries';
import { redirect } from 'next/navigation';
import { CalendarDays, CalendarCheck, UserCheck, Mail } from 'lucide-react';
import { StatCard } from './stat-card';
import { UpcomingEvents } from './upcoming-events';
import { RsvpChart } from './rsvp-chart';
import { RecentActivity } from './recent-activity';
import { AISuggestions } from './ai-suggestions';

export default async function DashboardPage(): Promise<React.ReactElement> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const stats = await getDashboardStats(user.id);

  return (
    <div className="space-y-8">
      {/* Greeting banner */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-teal-400/5 to-transparent p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {user.name.split(' ')[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening with your events today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Events"
          value={stats.totalEvents.toString()}
          description="Events created"
          icon={CalendarDays}
        />
        <StatCard
          title="Upcoming"
          value={stats.upcomingEvents.toString()}
          description="Scheduled ahead"
          icon={CalendarCheck}
          variant={stats.upcomingEvents > 0 ? 'success' : 'default'}
        />
        <StatCard
          title="Attending"
          value={stats.attendingCount.toString()}
          description="Events you're joining"
          icon={UserCheck}
        />
        <StatCard
          title="Pending Invites"
          value={stats.pendingInvitations.toString()}
          description="Waiting for your reply"
          icon={Mail}
          variant={stats.pendingInvitations > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Charts & Widgets */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingEvents events={stats.upcomingList} />
        <RsvpChart data={stats.rsvpCounts} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity activities={stats.recentActivity} />
        <AISuggestions userId={user.id} />
      </div>
    </div>
  );
}
