import type { User, UserRole } from '@/types';

export function isAdmin(user: User | null | undefined): boolean {
  return user?.role === 'ADMIN';
}

export function isVerifier(user: User | null | undefined): boolean {
  return user?.role === 'VERIFIER';
}

export function hasRole(
  user: User | null | undefined,
  roles: UserRole[],
): boolean {
  return !!user && roles.includes(user.role);
}

export function getDefaultRoute(user: User | null | undefined): string {
  if (isVerifier(user)) return '/';
  return '/';
}

export function getPortalLabel(user: User | null | undefined): string {
  if (isVerifier(user)) return 'Verifier portal';
  return 'Admin portal';
}
