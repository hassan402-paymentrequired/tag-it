import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import type { UserRole } from '@/types';

type Props = {
  allowedRoles: UserRole[];
  redirectTo?: string;
};

export function RoleRoute({ allowedRoles, redirectTo = '/' }: Props) {
  const user = useAuthStore((state) => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
