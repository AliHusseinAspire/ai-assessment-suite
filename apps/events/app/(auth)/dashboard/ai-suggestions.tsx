'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Clock } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/info-tooltip';

interface Suggestion {
  startTime: string;
  endTime: string;
  reason: string;
}

interface AISuggestionsProps {
  userId: string;
}

export function AISuggestions({ userId }: AISuggestionsProps): React.ReactElement {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  async function fetchSuggestions() {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/suggest-times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
      setFetched(true);
    } catch {
      setSuggestions([]);
      setFetched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-card p-6 shadow-sm">
      {/* Gradient border accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary via-teal-400 to-primary/0" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-semibold">AI Scheduling Suggestions</h2>
          <InfoTooltip
            label="What are AI Scheduling Suggestions?"
            text="AI analyzes your upcoming schedule and suggests open time slots for new events, helping you avoid conflicts."
          />
        </div>
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          {fetched ? 'Refresh' : 'Find free slots'}
        </button>
      </div>

      {!fetched && !loading && (
        <p className="mt-4 text-sm text-muted-foreground">
          Click &quot;Find free slots&quot; to get AI-powered scheduling suggestions based on your week.
        </p>
      )}

      {fetched && suggestions.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          No suggestions available. Your schedule may be wide open!
        </p>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4 space-y-2">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-muted/50 p-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">
                  {s.startTime} – {s.endTime}
                </p>
                <p className="text-xs text-muted-foreground">{s.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
