'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { TooltipProps } from 'recharts';

function CustomTooltip({ active, payload }: TooltipProps<number, string>): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-card-foreground shadow-md">
      <p className="text-sm font-medium">{name}</p>
      <p className="text-sm text-muted-foreground">{value} items</p>
    </div>
  );
}

interface CategoryPieChartProps {
  data: { name: string; value: number; color: string }[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps): React.ReactElement {
  const filteredData = data.filter((d) => d.value > 0);

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Category Distribution</h2>
      {filteredData.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center text-muted-foreground">
          No data available
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                paddingAngle={2}
              >
                {filteredData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
