import type { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  supabaseId: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
