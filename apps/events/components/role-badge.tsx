import { cn } from '@assessment/ui/lib/utils';

const ROLE_STYLES: Record<string, string> = {
  OWNER: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  MEMBER: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  GUEST: 'bg-stone-100 text-stone-600 dark:bg-stone-800/30 dark:text-stone-400',
};

interface RoleBadgeProps {
  role: string;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
        ROLE_STYLES[role] ?? ROLE_STYLES.GUEST,
        className
      )}
    >
      {role}
    </span>
  );
}
