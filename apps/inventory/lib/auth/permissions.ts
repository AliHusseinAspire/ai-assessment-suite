import type { Role } from '@/prisma/generated/client';

export type Permission =
  | 'items:read'
  | 'items:create'
  | 'items:update'
  | 'items:delete'
  | 'categories:read'
  | 'categories:create'
  | 'categories:update'
  | 'categories:delete'
  | 'users:read'
  | 'users:manage'
  | 'dashboard:read'
  | 'settings:read'
  | 'settings:manage'
  | 'activity:read';

const PERMISSION_MAP: Record<Role, Permission[]> = {
  ADMIN: [
    'items:read', 'items:create', 'items:update', 'items:delete',
    'categories:read', 'categories:create', 'categories:update', 'categories:delete',
    'users:read', 'users:manage',
    'dashboard:read',
    'settings:read', 'settings:manage',
    'activity:read',
  ],
  MANAGER: [
    'items:read', 'items:create', 'items:update', 'items:delete',
    'categories:read', 'categories:create', 'categories:update',
    'dashboard:read',
    'settings:read',
    'activity:read',
  ],
  VIEWER: [
    'items:read',
    'categories:read',
    'dashboard:read',
    'settings:read',
    'activity:read',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return PERMISSION_MAP[role]?.includes(permission) ?? false;
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Insufficient permissions. Required: ${permission}`);
  }
}

export function getUserPermissions(role: Role): Permission[] {
  return PERMISSION_MAP[role] ?? [];
}
