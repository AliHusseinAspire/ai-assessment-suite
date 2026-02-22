import { getCurrentUser } from '@/features/auth/actions';
import { redirect } from 'next/navigation';
import { SettingsForm } from './settings-form';
import { RoleBadge } from '@/components/role-badge';

export default async function SettingsPage(): Promise<React.ReactElement> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <SettingsForm user={user} />
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Account Info</h2>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-sm text-muted-foreground">Email</dt>
            <dd className="text-sm font-medium">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-muted-foreground">Role</dt>
            <dd><RoleBadge role={user.role} /></dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
