'use client';

import { useState } from 'react';
import { InfoTooltip } from '@/components/ui/info-tooltip';

const STATUSES = [
  { key: 'ATTENDING', label: 'Attending', color: '#10b981', bg: 'bg-[#10b981]' },
  { key: 'MAYBE', label: 'Maybe', color: '#14b8a6', bg: 'bg-[#14b8a6]' },
  { key: 'DECLINED', label: 'Declined', color: '#ef4444', bg: 'bg-[#ef4444]' },
  { key: 'PENDING', label: 'Pending', color: '#94a3b8', bg: 'bg-[#94a3b8]' },
] as const;

interface RsvpChartProps {
  data: Record<string, number>;
}

export function RsvpChart({ data }: RsvpChartProps): React.ReactElement {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const total = STATUSES.reduce((sum, s) => sum + (data[s.key] ?? 0), 0);
  const hasData = total > 0;

  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <h2 className="text-sm font-semibold">RSVP Distribution</h2>
        <InfoTooltip
          label="What is RSVP Distribution?"
          text="Breakdown of how invitees have responded to your events — attending, maybe, declined, or still pending."
        />
      </div>

      {!hasData ? (
        <p className="mt-4 text-sm text-muted-foreground">No RSVP data yet</p>
      ) : (
        <div className="mt-5 space-y-5">
          {/* Total */}
          <p className="text-3xl font-bold">{total} <span className="text-sm font-normal text-muted-foreground">responses</span></p>

          {/* Stacked bar */}
          <div className="relative">
            <div className="flex h-4 overflow-hidden rounded-full bg-muted/50">
              {STATUSES.map((s) => {
                const value = data[s.key] ?? 0;
                if (value === 0) return null;
                const pct = (value / total) * 100;
                return (
                  <div
                    key={s.key}
                    className="relative h-full transition-opacity duration-150"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: s.color,
                      opacity: hoveredKey && hoveredKey !== s.key ? 0.4 : 1,
                    }}
                    onMouseEnter={() => setHoveredKey(s.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                  />
                );
              })}
            </div>

            {/* Hover tooltip */}
            {hoveredKey && (
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-lg border bg-popover px-2.5 py-1 text-xs font-medium text-popover-foreground shadow-md whitespace-nowrap">
                {STATUSES.find((s) => s.key === hoveredKey)?.label}: {data[hoveredKey] ?? 0} ({Math.round(((data[hoveredKey] ?? 0) / total) * 100)}%)
              </div>
            )}
          </div>

          {/* Legend rows with counts */}
          <div className="grid grid-cols-2 gap-3">
            {STATUSES.map((s) => {
              const value = data[s.key] ?? 0;
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <div
                  key={s.key}
                  className="flex items-center gap-2.5 rounded-xl p-2 transition-colors hover:bg-muted/50"
                  onMouseEnter={() => setHoveredKey(s.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${s.bg}`} />
                  <div className="flex flex-1 items-baseline justify-between gap-1">
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <span className="text-sm font-semibold tabular-nums">
                      {value}
                      <span className="ml-1 text-[10px] font-normal text-muted-foreground">{pct}%</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
