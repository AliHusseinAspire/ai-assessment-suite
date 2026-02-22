'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface NLInputProps {
  onParsed: (data: Record<string, string>) => void;
}

export function NLInput({ onParsed }: NLInputProps): React.ReactElement {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleParse() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/parse-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      if (data.parsed) {
        onParsed(data.parsed);
        toast.success('Event details filled from your description');
        setInput('');
      } else {
        toast.error('Could not parse event details');
      }
    } catch {
      toast.error('Failed to parse event');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-teal-400/5 p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Sparkles className="h-4 w-4" />
        Quick Create with AI
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Describe your event in natural language (e.g., &quot;Team standup tomorrow at 9am in Room 101&quot;)
      </p>
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleParse()}
          placeholder='Try: "Team standup every weekday at 9am"'
          className="flex h-11 flex-1 rounded-xl border border-input bg-background px-4 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <button
          type="button"
          onClick={handleParse}
          disabled={loading || !input.trim()}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-teal-400 px-5 text-sm font-medium text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Parse
        </button>
      </div>
    </div>
  );
}
