import { getCurrentUser } from '@/features/auth/actions';
import { getEventsForMonth } from '@/features/events/queries';
import { redirect } from 'next/navigation';
import { CalendarView } from './calendar-view';

interface CalendarPageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function CalendarPage({ searchParams }: CalendarPageProps): Promise<React.ReactElement> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year) : now.getFullYear();
  const month = params.month ? parseInt(params.month) - 1 : now.getMonth();

  const rawEvents = await getEventsForMonth(year, month);
  const initialEvents = rawEvents.map((e) => ({
    id: e.id,
    title: e.title,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate.toISOString(),
    allDay: e.allDay,
    color: e.color,
    status: e.status,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">View all your events at a glance</p>
      </div>
      <CalendarView initialYear={year} initialMonth={month} initialEvents={initialEvents} />
    </div>
  );
}
