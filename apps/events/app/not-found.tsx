import Link from 'next/link';

export default function NotFound(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="text-6xl font-bold bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">404</div>
      <h2 className="text-xl font-semibold">Page not found</h2>
      <p className="text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-teal-400 px-6 text-sm font-medium text-white shadow-md hover:shadow-lg transition-shadow"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
