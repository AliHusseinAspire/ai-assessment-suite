'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@assessment/ui/lib/utils';
import Link from 'next/link';

interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  color: string;
  status: string;
}

interface CalendarViewProps {
  initialYear: number;
  initialMonth: number;
  initialEvents?: CalendarEvent[];
}

export function CalendarView({ initialYear, initialMonth, initialEvents = [] }: CalendarViewProps): React.ReactElement {
  const [currentDate, setCurrentDate] = useState(new Date(initialYear, initialMonth, 1));
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const router = useRouter();

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    fetch(`/api/calendar?year=${year}&month=${month}`)
      .then((res) => res.json())
      .then((data) => setEvents(data.events ?? []))
      .catch(() => setEvents([]));
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  function getEventsForDay(day: Date): CalendarEvent[] {
    return events.filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return day >= new Date(start.toDateString()) && day <= new Date(end.toDateString());
    });
  }

  function goToPrev() {
    setCurrentDate(subMonths(currentDate, 1));
  }

  function goToNext() {
    setCurrentDate(addMonths(currentDate, 1));
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  const dayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="inline-flex h-9 items-center rounded-full border border-input px-4 text-sm hover:bg-accent"
          >
            Today
          </button>
          <button
            onClick={goToPrev}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-input hover:bg-accent"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToNext}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-input hover:bg-accent"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-2xl border shadow-sm">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-muted/30">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="px-2 py-2.5 text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const dayEvts = getEventsForDay(day);
            const inMonth = isSameMonth(day, currentDate);
            const today = isToday(day);
            const selected = selectedDay && isSameDay(day, selectedDay);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  'relative min-h-[80px] border-b border-r p-1.5 text-left transition-colors hover:bg-muted/30',
                  !inMonth && 'bg-muted/10 text-muted-foreground/50',
                  selected && 'bg-primary/5 ring-2 ring-primary ring-inset'
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium',
                    today && 'bg-gradient-to-br from-primary to-teal-400 font-bold text-white ring-2 ring-primary/30'
                  )}
                >
                  {format(day, 'd')}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayEvts.slice(0, 3).map((evt) => (
                    <div
                      key={evt.id}
                      className="truncate rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
                      style={{ backgroundColor: evt.color }}
                      title={evt.title}
                    >
                      {evt.title}
                    </div>
                  ))}
                  {dayEvts.length > 3 && (
                    <p className="px-1.5 text-[10px] text-muted-foreground">
                      +{dayEvts.length - 3} more
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day detail panel */}
      {selectedDay && (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold">
            {format(selectedDay, 'EEEE, MMMM d, yyyy')}
          </h3>
          {dayEvents.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No events</p>
          ) : (
            <div className="mt-3 space-y-2">
              {dayEvents.map((evt) => (
                <Link
                  key={evt.id}
                  href={`/events/${evt.id}`}
                  className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/50"
                >
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: evt.color }}
                  />
                  <div>
                    <p className="text-sm font-medium">{evt.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {evt.allDay
                        ? 'All day'
                        : `${format(new Date(evt.startDate), 'h:mm a')} – ${format(new Date(evt.endDate), 'h:mm a')}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
