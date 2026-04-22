import { supabase } from '@/lib/customSupabaseClient';
import { setCurrentUserAsAdmin } from '@/lib/setupAdmin.js';

/**
 * Updates a user's role in their metadata.
 * Users can only update their own metadata from the client side.
 * 
 * @param {string} role - The new role ('admin', 'editor', 'user')
 * @returns {Promise<{user: object|null, error: object|null}>}
 */
export async function updateUserRole(role) {
  try {
    const { data: { user }, error } = await supabase.auth.updateUser({
      data: { role: role }
    });
    
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { user: null, error };
  }
}

/**
 * Ensures the current user has role metadata. 
 * If missing, defaults to 'admin' (per self-provisioning requirement) or 'user'.
 * 
 * @param {string} defaultRole - Role to set if missing
 */
export async function ensureRoleMetadata(defaultRole = 'admin') {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        console.log("[RoleManager] No user found to ensure metadata.");
        return { user: null, error: "No user logged in" };
    }

    if (!user.user_metadata?.role) {
      console.log(`[RoleManager] User ${user.email} missing role. Setting to: ${defaultRole}`);
      
      let result;
      if (defaultRole === 'admin') {
          result = await setCurrentUserAsAdmin();
      } else {
          result = await updateUserRole(defaultRole);
          await supabase.auth.refreshSession();
      }

      if (result.error) throw result.error;
      
      return { user: result.user, error: null };
    }

    return { user, error: null };
  } catch (err) {
      console.error("[RoleManager] ensureRoleMetadata failed:", err);
      return { user: null, error: err };
  }
}

/**
 * Helper alias specifically for ensuring admin role
 */
export async function ensureAdminRole() {
    return ensureRoleMetadata('admin');
}