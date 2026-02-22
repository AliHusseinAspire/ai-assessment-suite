import type { EventRole } from '@/prisma/generated/client';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: EventRole;
  supabaseId: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
