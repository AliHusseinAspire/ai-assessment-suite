import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/actions';
import { Providers } from '@/components/providers';
import { AppShell } from '@/components/app-shell';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <Providers user={user}>
      <AppShell user={user}>
        {children}
      </AppShell>
    </Providers>
  );
}
