'use client';

import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@assessment/ui/lib/utils';

interface InfoTooltipProps {
  label: string;
  text: string;
  className?: string;
}

export function InfoTooltip({ label, text, className }: InfoTooltipProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className={cn('relative inline-flex items-center', className)} ref={ref}>
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label={label}
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-10 mt-1.5 w-56 -translate-x-1/2 rounded-xl border bg-popover p-3 text-xs text-popover-foreground shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
}
