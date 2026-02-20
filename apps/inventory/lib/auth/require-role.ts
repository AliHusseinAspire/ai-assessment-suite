import { redirect } from 'next/navigation';
import type { Role } from '@prisma/client';
import { getCurrentUser } from '@/features/auth/actions';

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireRole(roles: Role[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    redirect('/unauthorized');
  }
  return user;
}
