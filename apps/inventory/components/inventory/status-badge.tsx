import type { ItemStatus } from '@prisma/client';
import { cn } from '@assessment/ui/lib/utils';
import { ITEM_STATUSES } from '@/features/inventory/constants';

interface StatusBadgeProps {
  status: ItemStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps): React.ReactElement {
  const config = ITEM_STATUSES.find((s) => s.value === status);

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config?.color ?? 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {config?.label ?? status}
    </span>
  );
}
