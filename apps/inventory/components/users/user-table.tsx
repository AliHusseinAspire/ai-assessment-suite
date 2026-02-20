'use client';

import { useTransition } from 'react';
import { updateUserRole } from '@/features/users/actions';
import { toast } from 'sonner';
import { RoleBadge } from '@/components/role-badge';
import { formatDistanceToNow } from 'date-fns';
import type { User } from '@prisma/client';


interface UserTableProps {
  users: (User & { _count: { activities: number } })[];
  currentUserId: string;
}

export function UserTable({ users, currentUserId }: UserTableProps): React.ReactElement {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">User</th>
            <th className="px-4 py-3 text-left font-medium">Role</th>
            <th className="px-4 py-3 text-right font-medium">Activities</th>
            <th className="px-4 py-3 text-left font-medium">Joined</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isCurrentUser={user.id === currentUserId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserRow({
  user,
  isCurrentUser,
}: {
  user: User & { _count: { activities: number } };
  isCurrentUser: boolean;
}): React.ReactElement {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (role: string) => {
    startTransition(async () => {
      const result = await updateUserRole(user.id, role as 'ADMIN' | 'MANAGER' | 'VIEWER');
      if (result.success) {
        toast.success(`Updated ${user.name}'s role to ${role}`);
      } else {
        toast.error(result.error);
      }
    });
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <tr className="hover:bg-muted/50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {initials}
          </div>
          <div>
            <p className="font-medium">
              {user.name}
              {isCurrentUser && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-4 py-3 text-right tabular-nums">{user._count.activities}</td>
      <td className="px-4 py-3 text-muted-foreground">
        {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
      </td>
      <td className="px-4 py-3 text-right">
        {isCurrentUser ? (
          <span className="text-xs text-muted-foreground">-</span>
        ) : (
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(e.target.value)}
            disabled={isPending}
            className="h-8 rounded-md border bg-background px-2 text-xs disabled:opacity-50"
          >
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="VIEWER">Viewer</option>
          </select>
        )}
      </td>
    </tr>
  );
}
