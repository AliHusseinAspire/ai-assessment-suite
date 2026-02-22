import type { EventRole } from '@/prisma/generated/client';

export type Permission =
  | 'events:read'
  | 'events:create'
  | 'events:update'
  | 'events:delete'
  | 'invitations:send'
  | 'invitations:read'
  | 'users:read'
  | 'users:manage'
  | 'dashboard:read'
  | 'calendar:read'
  | 'settings:read'
  | 'settings:manage'
  | 'activity:read';

const PERMISSION_MAP: Record<EventRole, Permission[]> = {
  OWNER: [
    'events:read', 'events:create', 'events:update', 'events:delete',
    'invitations:send', 'invitations:read',
    'users:read', 'users:manage',
    'dashboard:read', 'calendar:read',
    'settings:read', 'settings:manage',
    'activity:read',
  ],
  MEMBER: [
    'events:read', 'events:create', 'events:update',
    'invitations:send', 'invitations:read',
    'dashboard:read', 'calendar:read',
    'settings:read',
    'activity:read',
  ],
  GUEST: [
    'events:read',
    'invitations:read',
    'dashboard:read', 'calendar:read',
    'settings:read',
    'activity:read',
  ],
};

export function hasPermission(role: EventRole, permission: Permission): boolean {
  return PERMISSION_MAP[role]?.includes(permission) ?? false;
}

export function requirePermission(role: EventRole, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Insufficient permissions. Required: ${permission}`);
  }
}

export function getUserPermissions(role: EventRole): Permission[] {
  return PERMISSION_MAP[role] ?? [];
}
