'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AuthUser, AuthState } from '@/features/auth/types';

const AuthContext = createContext<AuthState>({ user: null, isLoading: true });

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: AuthUser | null;
}): React.ReactElement {
  const [state, setState] = useState<AuthState>({
    user: initialUser,
    isLoading: false,
  });

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_OUT') {
          setState({ user: null, isLoading: false });
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // User state is server-managed; trigger a refresh
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
