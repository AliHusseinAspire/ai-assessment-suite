export default function UsersLoading(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-28 animate-pulse rounded-2xl bg-muted/60" />
        <div className="h-4 w-64 animate-pulse rounded-2xl bg-muted/60" />
      </div>
      <div className="h-80 animate-pulse rounded-2xl bg-muted/60" />
    </div>
  );
}
