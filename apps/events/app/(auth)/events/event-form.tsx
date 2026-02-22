'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { createEvent, updateEvent } from '@/features/events/actions';
import { EVENT_COLORS } from '@/features/events/constants';
import { NLInput } from './nl-input';
import type { ActionResult } from '@/features/auth/types';

interface EventFormProps {
  userId: string;
  event?: {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    isRecurring: boolean;
    color: string;
    maxAttendees: number | null;
  };
}

export function EventForm({ userId, event }: EventFormProps): React.ReactElement {
  const router = useRouter();
  const isEdit = !!event;

  const [title, setTitle] = useState(event?.title ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [location, setLocation] = useState(event?.location ?? '');
  const [startDate, setStartDate] = useState(
    event ? formatDateTimeLocal(event.startDate) : ''
  );
  const [endDate, setEndDate] = useState(
    event ? formatDateTimeLocal(event.endDate) : ''
  );
  const [allDay, setAllDay] = useState(event?.allDay ?? false);
  const [color, setColor] = useState(event?.color ?? '#10b981');
  const [maxAttendees, setMaxAttendees] = useState(event?.maxAttendees?.toString() ?? '');
  const [conflicts, setConflicts] = useState<Array<{ id: string; title: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [state, formAction, isPending] = useActionState<ActionResult<{ id: string }> | ActionResult | null, FormData>(
    async (_prev, formData) => {
      if (isEdit) {
        const result = await updateEvent(event.id, formData);
        if (result.success) {
          toast.success('Event updated');
          router.push(`/events/${event.id}`);
        }
        return result;
      } else {
        const result = await createEvent(formData);
        if (result.success && 'data' in result && result.data) {
          toast.success('Event created');
          router.push(`/events/${result.data.id}`);
        }
        return result;
      }
    },
    null
  );

  function handleNLFill(parsed: Record<string, string>) {
    if (parsed.title) setTitle(parsed.title);
    if (parsed.description) setDescription(parsed.description);
    if (parsed.location) setLocation(parsed.location);
    if (parsed.startDate) setStartDate(parsed.startDate);
    if (parsed.endDate) setEndDate(parsed.endDate);
    if (parsed.allDay === 'true') setAllDay(true);
  }

  async function checkConflicts() {
    if (!startDate || !endDate) return;
    try {
      const res = await fetch('/api/ai/conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate,
          endDate,
          userId,
          excludeEventId: event?.id,
        }),
      });
      const data = await res.json();
      setConflicts(data.conflicts ?? []);
    } catch {
      // ignore
    }
  }

  async function generateDescription() {
    if (!title) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, location }),
      });
      const data = await res.json();
      if (data.description) setDescription(data.description);
    } catch {
      toast.error('Failed to generate description');
    } finally {
      setIsGenerating(false);
    }
  }

  const inputClass = 'flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  return (
    <div className="space-y-6">
      {!isEdit && <NLInput onParsed={handleNLFill} />}

      <form action={formAction} className="space-y-6">
        {state && !state.success && (
          <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </div>
        )}

        {conflicts.length > 0 && (
          <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-center gap-2 text-sm font-medium text-yellow-800 dark:text-yellow-300">
              <AlertTriangle className="h-4 w-4" />
              Scheduling conflict detected
            </div>
            <ul className="mt-1 space-y-1">
              {conflicts.map((c) => (
                <li key={c.id} className="text-xs text-yellow-700 dark:text-yellow-400">
                  Overlaps with: {c.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Basic Details</h3>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title *</label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClass}
              placeholder="Event title"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={!title || isGenerating}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                Generate
              </button>
            </div>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="What is this event about?"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">Location</label>
            <input
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass}
              placeholder="Room 101, Zoom link, etc."
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date & Time</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">Start *</label>
              <input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (!endDate && e.target.value) {
                    const d = new Date(e.target.value);
                    d.setHours(d.getHours() + 1);
                    setEndDate(formatDateTimeLocal(d));
                  }
                }}
                onBlur={checkConflicts}
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium">End *</label>
              <input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onBlur={checkConflicts}
                required
                className={inputClass}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="allDay"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              value="true"
              className="h-4 w-4 rounded border-input"
            />
            All day
          </label>
        </div>

        <input type="hidden" name="allDay" value={allDay ? 'true' : 'false'} />
        <input type="hidden" name="isRecurring" value="false" />

        {/* Options */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Options</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex gap-2">
                {EVENT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-10 w-10 rounded-full border-2 transition-transform ${
                      color === c ? 'scale-110 border-foreground' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
              <input type="hidden" name="color" value={color} />
            </div>
            <div className="space-y-2">
              <label htmlFor="maxAttendees" className="text-sm font-medium">Max Attendees</label>
              <input
                id="maxAttendees"
                name="maxAttendees"
                type="number"
                min="1"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
                className={inputClass}
                placeholder="Unlimited"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-primary to-teal-400 px-8 text-sm font-medium text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
          >
            {isPending ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-11 items-center justify-center rounded-full border border-input px-6 text-sm font-medium hover:bg-accent"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function formatDateTimeLocal(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
