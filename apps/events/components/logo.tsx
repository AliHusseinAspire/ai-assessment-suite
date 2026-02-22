import { cn } from '@assessment/ui/lib/utils';

interface LogoIconProps {
  className?: string;
}

export function LogoIcon({ className }: LogoIconProps): React.ReactElement {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-7 w-7', className)}
    >
      <rect width="32" height="32" rx="8" fill="#10b981" />
      {/* Calendar icon */}
      <rect x="7" y="10" width="18" height="15" rx="2" stroke="white" strokeWidth="2" fill="none" />
      <line x1="7" y1="15" x2="25" y2="15" stroke="white" strokeWidth="2" />
      <line x1="12" y1="7" x2="12" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="7" x2="20" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="20" r="1.5" fill="white" />
      <circle cx="16" cy="20" r="1.5" fill="white" />
      <circle cx="20" cy="20" r="1.5" fill="white" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
}

export function Logo({ className, iconClassName, showText = true }: LogoProps): React.ReactElement {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoIcon className={iconClassName} />
      {showText && (
        <span className="text-lg font-bold tracking-tight">
          Event<span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">Flow</span>
        </span>
      )}
    </span>
  );
}
