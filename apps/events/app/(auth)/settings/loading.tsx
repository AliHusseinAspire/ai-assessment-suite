export default function SettingsLoading(): React.ReactElement {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-32 animate-pulse rounded-2xl bg-muted/60" />
        <div className="h-4 w-72 animate-pulse rounded-2xl bg-muted/60" />
      </div>
      <div className="h-52 animate-pulse rounded-2xl bg-muted/60" />
      <div className="h-36 animate-pulse rounded-2xl bg-muted/60" />
    </div>
  );
}
