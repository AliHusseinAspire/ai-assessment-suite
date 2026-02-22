'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { Search, Plus, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { ItemStatus } from '@/prisma/generated/client';
import { cn } from '@assessment/ui/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@assessment/ui/components/select';
import { ITEM_STATUSES, SORT_OPTIONS } from '@/features/inventory/constants';

interface Category {
  id: string;
  name: string;
}

interface InventoryToolbarProps {
  categories: Category[];
  canCreate: boolean;
}

export function InventoryToolbar({ categories, canCreate }: InventoryToolbarProps): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [aiMode, setAiMode] = useState(false);
  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentCategory = searchParams.get('category') ?? '';
  const currentStatus = searchParams.get('status') ?? '';
  const currentSort = searchParams.get('sort') ?? '';

  // Sync controlled input when URL search param changes externally (e.g. back/forward)
  const urlSearch = searchParams.get('search') ?? '';
  const prevUrlSearch = useRef(urlSearch);
  useEffect(() => {
    if (urlSearch !== prevUrlSearch.current) {
      setSearchText(urlSearch);
      prevUrlSearch.current = urlSearch;
    }
  }, [urlSearch]);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      // Reset page on filter change
      params.delete('page');
      startTransition(() => {
        router.push(`/inventory?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const handleTextSearch = useCallback(
    (value: string) => {
      updateParams({ search: value });
    },
    [updateParams]
  );

  const handleAISearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;
      try {
        const res = await fetch('/api/ai/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });

        if (!res.ok) {
          handleTextSearch(query);
          return;
        }

        const { filters } = await res.json();
        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.categoryId) params.set('category', filters.categoryId);
        if (filters.status) params.set('status', filters.status);
        if (filters.sort) params.set('sort', filters.sort);

        startTransition(() => {
          router.push(`/inventory?${params.toString()}`);
        });
      } catch {
        handleTextSearch(query);
      }
    },
    [handleTextSearch, router]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchText(value);
      if (!aiMode) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => handleTextSearch(value), 300);
      }
    },
    [aiMode, handleTextSearch]
  );

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (aiMode) {
        startTransition(() => {
          handleAISearch(searchText);
        });
      } else {
        handleTextSearch(searchText);
      }
    },
    [aiMode, searchText, handleAISearch, handleTextSearch]
  );

  const clearSearch = useCallback(() => {
    setSearchText('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    handleTextSearch('');
  }, [handleTextSearch]);

  const hasFilters = currentCategory || currentStatus || currentSort;

  const clearAll = useCallback(() => {
    setSearchText('');
    setAiMode(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    startTransition(() => {
      router.push('/inventory');
    });
  }, [router]);

  return (
    <div className="space-y-3">
      {/* Top row: search + add button */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={
              aiMode
                ? "Try: 'show me low stock electronics' then press Enter"
                : 'Search items by name, SKU, or description...'
            }
            className={cn(
              'flex h-11 w-full rounded-lg border bg-background pl-10 pr-20 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              aiMode ? 'border-primary/50' : 'border-input'
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {isPending && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
            {searchText && (
              <button
                onClick={clearSearch}
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => setAiMode(!aiMode)}
              className={cn(
                'rounded-md p-1 transition-colors',
                aiMode
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
              aria-label={aiMode ? 'Disable AI search' : 'Enable AI search'}
              title={aiMode ? 'AI search on — type naturally and press Enter' : 'Enable AI search'}
            >
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>

        {canCreate && (
          <Link
            href="/inventory/new"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Link>
        )}
      </div>

      {/* Filter row: always visible */}
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={currentCategory || 'all'}
          onValueChange={(v: string) => updateParams({ category: v === 'all' ? '' : v })}
        >
          <SelectTrigger className="h-9 w-[150px] rounded-lg text-xs">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentStatus || 'all'}
          onValueChange={(v: string) => updateParams({ status: v === 'all' ? '' : v })}
        >
          <SelectTrigger className="h-9 w-[150px] rounded-lg text-xs">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ITEM_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentSort || 'all'}
          onValueChange={(v: string) => updateParams({ sort: v === 'all' ? '' : v })}
        >
          <SelectTrigger className="h-9 w-[150px] rounded-lg text-xs">
            <SelectValue placeholder="Default Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Default Sort</SelectItem>
            {SORT_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(hasFilters || searchText) && (
          <button
            onClick={clearAll}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
