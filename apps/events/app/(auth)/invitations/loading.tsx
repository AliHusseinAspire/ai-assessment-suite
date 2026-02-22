export default function InvitationsLoading(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded-2xl bg-muted/60" />
        <div className="h-4 w-72 animate-pulse rounded-2xl bg-muted/60" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl bg-muted/60" />
        ))}
      </div>
    </div>
  );
}
