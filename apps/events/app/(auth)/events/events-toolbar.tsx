'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { EVENT_STATUS_OPTIONS } from '@/features/events/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@assessment/ui/components/select';

interface EventsToolbarProps {
  search?: string;
  status?: string;
  aiEnabled: boolean;
}

export function EventsToolbar({ search, status, aiEnabled }: EventsToolbarProps): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(search ?? '');
  const [isAI, setIsAI] = useState(aiEnabled);

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete('page');
    startTransition(() => {
      router.push(`/events?${params.toString()}`);
    });
  }

  async function handleSearch() {
    if (isAI && searchValue.trim()) {
      try {
        const res = await fetch('/api/ai/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchValue }),
        });
        const data = await res.json();
        if (data.filters) {
          const params = new URLSearchParams();
          if (data.filters.search) params.set('search', data.filters.search);
          if (data.filters.status) params.set('status', data.filters.status);
          params.set('ai', '1');
          startTransition(() => {
            router.push(`/events?${params.toString()}`);
          });
          return;
        }
      } catch {
        // Fall through to regular search
      }
    }
    updateParams({ search: searchValue || undefined, ai: undefined });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={isAI ? 'Try: "meetings next week"...' : 'Search events...'}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex h-10 w-full rounded-full border border-input bg-background pl-10 pr-10 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {searchValue && (
          <button
            onClick={() => {
              setSearchValue('');
              updateParams({ search: undefined, ai: undefined });
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <button
        onClick={() => setIsAI(!isAI)}
        className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all ${
          isAI
            ? 'border-primary bg-gradient-to-r from-primary/10 to-teal-400/10 text-primary'
            : 'border-input text-muted-foreground hover:bg-accent'
        }`}
        title="Toggle AI-powered search"
      >
        <Sparkles className="h-4 w-4" />
        AI
      </button>

      <Select
        value={status ?? 'all'}
        onValueChange={(v) => updateParams({ status: v === 'all' ? undefined : v })}
      >
        <SelectTrigger className="h-10 w-[160px] rounded-full">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {EVENT_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending && (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      )}
    </div>
  );
}
