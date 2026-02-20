'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { TooltipProps } from 'recharts';

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-card-foreground shadow-md">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm text-muted-foreground">count: {payload[0].value}</p>
    </div>
  );
}

interface StockChartProps {
  statusCounts: Record<string, number>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  IN_STOCK: { label: 'In Stock', color: '#22c55e' },
  LOW_STOCK: { label: 'Low Stock', color: '#eab308' },
  ORDERED: { label: 'Ordered', color: '#3b82f6' },
  DISCONTINUED: { label: 'Discontinued', color: '#ef4444' },
};

export function StockChart({ statusCounts }: StockChartProps): React.ReactElement {
  const data = Object.entries(STATUS_CONFIG).map(([key, config]) => ({
    name: config.label,
    count: statusCounts[key] ?? 0,
    color: config.color,
  }));

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Stock Status</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
