export default function EventsLoading(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 animate-pulse rounded-2xl bg-muted/60" />
          <div className="h-4 w-64 animate-pulse rounded-2xl bg-muted/60" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-full bg-muted/60" />
      </div>
      <div className="h-10 w-full animate-pulse rounded-full bg-muted/60" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl bg-muted/60" />
        ))}
      </div>
    </div>
  );
}
