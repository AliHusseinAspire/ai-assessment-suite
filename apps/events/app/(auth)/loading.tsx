export default function AuthLoading(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-2xl bg-muted/60" />
        <div className="h-4 w-96 animate-pulse rounded-2xl bg-muted/60" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted/60" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-2xl bg-muted/60" />
    </div>
  );
}
