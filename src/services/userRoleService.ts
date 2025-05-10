
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/supabase";

/**
 * Fetches the roles for a specific user
 * @param userId The ID of the user to fetch roles for
 * @returns Array of user roles
 */
export async function getUserRoles(userId: string): Promise<UserRole[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }

  return data;
}

/**
 * Checks if a user has a specific role
 * @param userId The ID of the user to check
 * @param role The role to check for
 * @returns Boolean indicating if the user has the specified role
 */
export async function hasRole(userId: string, role: 'admin' | 'staff' | 'customer'): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', userId)
    .eq('role', role)
    .maybeSingle();
  
  if (error) {
    console.error('Error checking user role:', error);
    throw error;
  }

  return !!data;
}

/**
 * Checks if the current authenticated user has a specific role
 * Uses the database function directly for better performance
 * @param role The role to check for
 * @returns Boolean indicating if the current user has the specified role
 */
export async function hasCurrentUserRole(role: 'admin' | 'staff' | 'customer'): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('has_role', { role_name: role });
  
  if (error) {
    console.error('Error checking current user role:', error);
    throw error;
  }

  return data;
}

/**
 * Assigns a role to a user
 * @param userId The ID of the user to assign the role to
 * @param role The role to assign
 * @returns The created user role
 */
export async function assignRole(userId: string, role: 'admin' | 'staff' | 'customer'): Promise<UserRole> {
  // First check if the user already has this role
  const existingRole = await hasRole(userId, role);
  if (existingRole) {
    throw new Error(`User already has the ${role} role`);
  }

  const { data, error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role })
    .select()
    .single();
  
  if (error) {
    console.error('Error assigning user role:', error);
    throw error;
  }

  return data;
}

/**
 * Removes a role from a user
 * @param userId The ID of the user to remove the role from
 * @param role The role to remove
 * @returns Boolean indicating success
 */
export async function removeRole(userId: string, role: 'admin' | 'staff' | 'customer'): Promise<boolean> {
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role', role);
  
  if (error) {
    console.error('Error removing user role:', error);
    throw error;
  }

  return true;
}
