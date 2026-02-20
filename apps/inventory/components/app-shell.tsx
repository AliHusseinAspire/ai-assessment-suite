'use client';

import { useState, useCallback } from 'react';
import { Sidebar } from './layout/sidebar';
import { Header } from './layout/header';
import { MobileSidebar } from './layout/mobile-sidebar';
import { NavigationProgress } from './navigation-progress';
import type { AuthUser } from '@/features/auth/types';

interface AppShellProps {
  children: React.ReactNode;
  user: AuthUser;
}

export function AppShell({ children, user }: AppShellProps): React.ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileClose = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="flex h-screen overflow-hidden">
      <NavigationProgress />
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          role={user.role}
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile sidebar */}
      <MobileSidebar
        role={user.role}
        open={mobileOpen}
        onClose={handleMobileClose}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
