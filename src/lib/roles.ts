// Define all possible user roles in the system
export type UserRole = 'admin' | 'user' | 'agent' | 'senior_agent';

// Interface for the user_roles table structure
export interface UserRolesRecord {
  id: string;
  user_id: string;
  roles: UserRole[];
  created_at: string;
  updated_at: string;
}

/**
 * Check if a user has a specific role
 * @param userRoles Array of user roles
 * @param role Role to check for
 * @returns Boolean indicating if the user has the role
 */
export function hasRole(userRoles: UserRole[] | undefined, role: UserRole): boolean {
  return userRoles?.includes(role) || false;
}

/**
 * Check if a user is an admin
 * @param userRoles Array of user roles
 * @returns Boolean indicating if the user is an admin
 */
export function isAdmin(userRoles: UserRole[] | undefined): boolean {
  return hasRole(userRoles, 'admin');
}

/**
 * Check if a user is a senior agent
 * @param userRoles Array of user roles
 * @returns Boolean indicating if the user is a senior agent
 */
export function isSeniorAgent(userRoles: UserRole[] | undefined): boolean {
  return hasRole(userRoles, 'senior_agent');
}

/**
 * Check if a user is an agent
 * @param userRoles Array of user roles
 * @returns Boolean indicating if the user is an agent
 */
export function isAgent(userRoles: UserRole[] | undefined): boolean {
  return hasRole(userRoles, 'agent');
}

/**
 * Check if a user has a management role (admin or senior agent)
 * @param userRoles Array of user roles
 * @returns Boolean indicating if the user has a management role
 */
export function hasManagementRole(userRoles: UserRole[] | undefined): boolean {
  return isAdmin(userRoles) || isSeniorAgent(userRoles);
}
