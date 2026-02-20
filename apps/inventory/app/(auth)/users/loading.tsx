export default function UsersLoading(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-56 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="h-80 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
