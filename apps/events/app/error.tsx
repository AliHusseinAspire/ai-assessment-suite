'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="text-6xl font-bold bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">500</div>
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="max-w-md text-center text-muted-foreground">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-teal-400 px-6 text-sm font-medium text-white shadow-md hover:shadow-lg transition-shadow"
      >
        Try again
      </button>
    </div>
  );
}
