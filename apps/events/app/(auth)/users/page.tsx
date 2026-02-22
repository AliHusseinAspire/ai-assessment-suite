import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/actions';
import { getUsers } from '@/features/users/queries';
import { hasPermission } from '@/lib/auth/permissions';
import { UserTable } from './user-table';

export default async function UsersPage(): Promise<React.ReactElement> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!hasPermission(user.role, 'users:manage')) redirect('/dashboard');

  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage user accounts and role assignments.
        </p>
      </div>

      <UserTable users={users} currentUserId={user.id} />
    </div>
  );
}
