'use client';

import { useAdminContext } from '@/lib/admin/AdminContext';
import { AdminLoginPage } from '@/components/pages/AdminLoginPage';

export default function Page() {
  const { session, isLoggingIn, login } = useAdminContext();
  return <AdminLoginPage session={session} onLogin={login} isLoading={isLoggingIn} />;
}
