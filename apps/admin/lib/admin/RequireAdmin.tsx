'use client';

import type { ReactNode } from 'react';
import type { AdminSession } from './adminAuth';

interface RequireAdminProps {
  session: AdminSession | null;
  children: ReactNode;
}

export function RequireAdmin({ session, children }: RequireAdminProps) {
  if (!session) return null;
  return <>{children}</>;
}
