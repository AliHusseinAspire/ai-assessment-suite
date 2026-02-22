export default function DashboardLoading(): React.ReactElement {
  return (
    <div className="space-y-8">
      <div className="h-28 animate-pulse rounded-2xl bg-muted/60" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted/60" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl bg-muted/60" />
        <div className="h-72 animate-pulse rounded-2xl bg-muted/60" />
      </div>
    </div>
  );
}
