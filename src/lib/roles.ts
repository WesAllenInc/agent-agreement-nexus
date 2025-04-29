export type UserRole = 'admin' | 'user';

export interface UserRoles {
  roles: UserRole[];
}

export function hasRole(userRoles: UserRole[] | undefined, role: UserRole): boolean {
  return userRoles?.includes(role) || false;
}

export function isAdmin(userRoles: UserRole[] | undefined): boolean {
  return hasRole(userRoles, 'admin');
}
