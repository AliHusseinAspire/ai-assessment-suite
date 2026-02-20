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
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
      <polyline
        points="8,22 13,16 17,19 24,10"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="20,10 24,10 24,14"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
          Stock<span className="text-primary">Smart</span>
        </span>
      )}
    </span>
  );
}
