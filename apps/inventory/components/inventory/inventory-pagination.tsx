'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@assessment/ui/lib/utils';

interface InventoryPaginationProps {
  page: number;
  totalPages: number;
  total: number;
}

export function InventoryPagination({ page, totalPages, total }: InventoryPaginationProps): React.ReactElement | null {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete('page');
    } else {
      params.set('page', String(newPage));
    }
    router.push(`/inventory?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {total} item{total !== 1 ? 's' : ''} total
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm',
            page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .map((p, idx, arr) => {
            const prev = arr[idx - 1];
            const showEllipsis = prev !== undefined && p - prev > 1;
            return (
              <span key={p} className="flex items-center">
                {showEllipsis && <span className="px-1 text-muted-foreground">...</span>}
                <button
                  onClick={() => goToPage(p)}
                  className={cn(
                    'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm',
                    p === page ? 'bg-primary text-primary-foreground' : 'border hover:bg-accent'
                  )}
                >
                  {p}
                </button>
              </span>
            );
          })}

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm',
            page >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'
          )}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
