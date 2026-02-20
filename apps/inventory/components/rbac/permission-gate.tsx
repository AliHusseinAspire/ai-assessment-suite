'use client';

import { useAuth } from '@/lib/auth/auth-provider';
import { hasPermission, type Permission } from '@/lib/auth/permissions';

interface PermissionGateProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps): React.ReactElement | null {
  const { user } = useAuth();

  if (!user || !hasPermission(user.role, permission)) {
    return fallback as React.ReactElement | null;
  }

  return children as React.ReactElement;
}
