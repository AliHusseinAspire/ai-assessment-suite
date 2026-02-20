import { cn } from '@assessment/ui/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  variant?: 'default' | 'warning';
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'default',
}: StatCardProps): React.ReactElement {
  return (
    <div className={cn(
      'rounded-lg border bg-card p-6',
      variant === 'warning' && 'border-yellow-300 dark:border-yellow-700'
    )}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className={cn(
          'h-5 w-5',
          variant === 'warning' ? 'text-yellow-500' : 'text-muted-foreground'
        )} />
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
