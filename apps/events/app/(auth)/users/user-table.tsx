'use client';

import { useTransition } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { RoleBadge } from '@/components/role-badge';
import { updateUserRole } from '@/features/users/actions';
import type { EventRole } from '@/prisma/generated/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@assessment/ui/components/select';

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: EventRole;
  createdAt: Date;
}

interface UserTableProps {
  users: UserRow[];
  currentUserId: string;
}

const ROLES: EventRole[] = ['OWNER', 'MEMBER', 'GUEST'];

export function UserTable({ users, currentUserId }: UserTableProps): React.ReactElement {
  const [isPending, startTransition] = useTransition();

  function handleRoleChange(userId: string, newRole: EventRole) {
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        toast.success('Role updated');
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
              <th className="hidden px-4 py-3 text-left text-sm font-medium text-muted-foreground sm:table-cell">Joined</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              return (
                <tr key={u.id} className="border-b transition-colors hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                    {format(new Date(u.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    {isSelf ? (
                      <span className="text-xs text-muted-foreground">-</span>
                    ) : (
                      <Select
                        value={u.role}
                        onValueChange={(v) => handleRoleChange(u.id, v as EventRole)}
                        disabled={isPending}
                      >
                        <SelectTrigger className="h-8 w-[120px] rounded-full text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.charAt(0) + role.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
