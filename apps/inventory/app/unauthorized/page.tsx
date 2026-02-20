import Link from 'next/link';
import { ShieldX } from 'lucide-react';

export default function UnauthorizedPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <ShieldX className="h-16 w-16 text-destructive" />
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p className="text-muted-foreground">
        You don&apos;t have permission to access this page.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
