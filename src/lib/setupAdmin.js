import { supabase as defaultSupabase } from '@/lib/customSupabaseClient';

/**
 * Sets the CURRENTLY authenticated user as an admin.
 * @returns {Promise<{success: boolean, user: object|null, error: object|null}>}
 */
export async function setCurrentUserAsAdmin() {
  console.log("[AdminSetup] Attempting to set current user as admin...");

  try {
    const { data: { user: currentUser }, error: getUserError } = await defaultSupabase.auth.getUser();

    if (getUserError || !currentUser) {
      throw new Error("No authenticated user found. Please login first.");
    }

    const { data, error: updateError } = await defaultSupabase.auth.updateUser({
      data: { role: 'admin' }
    });

    if (updateError) {
      console.error("[AdminSetup] Error updating user role:", updateError);
      return { success: false, error: updateError };
    }

    console.log("[AdminSetup] Metadata updated. Refreshing session...");
    const { data: refreshData, error: refreshError } = await defaultSupabase.auth.refreshSession();
    
    if (refreshError) {
      console.warn("[AdminSetup] Session refresh warning:", refreshError);
    }

    const updatedUser = refreshData?.user || data.user;
    console.log("[AdminSetup] Success! User is now admin:", updatedUser);

    return { success: true, user: updatedUser, error: null };

  } catch (err) {
    console.error("[AdminSetup] Unexpected error:", err);
    return { success: false, error: err };
  }
}

/**
 * Sets the user as admin using a provided or default supabase instance.
 * @param {object} supabase - Supabase client instance
 * @returns {Promise<{success: boolean, user?: object, session?: object, error?: string}>}
 */
export async function setUserAsAdmin(supabase = defaultSupabase) {
  try {
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    
    if (getUserError || !user) {
      return { success: false, error: getUserError?.message || "No authenticated user found" };
    }

    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      data: { role: 'admin' }
    });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();

    if (sessionError) {
      return { success: false, error: sessionError.message };
    }

    return { 
      success: true, 
      user: sessionData?.user || updateData?.user, 
      session: sessionData?.session 
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Updates a user's role in their metadata.
 * @param {string} role - The new role ('admin', 'editor', 'user')
 * @returns {Promise<{user: object|null, error: object|null}>}
 */
export async function updateUserRole(role) {
  try {
    const { data: { user }, error } = await defaultSupabase.auth.updateUser({
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
 * @param {string} defaultRole - Role to set if missing
 */
export async function ensureRoleMetadata(defaultRole = 'admin') {
  try {
    const { data: { user } } = await defaultSupabase.auth.getUser();
    
    if (!user) {
        return { user: null, error: "No user logged in" };
    }

    if (!user.user_metadata?.role) {
      let result;
      if (defaultRole === 'admin') {
          result = await setCurrentUserAsAdmin();
      } else {
          result = await updateUserRole(defaultRole);
          await defaultSupabase.auth.refreshSession();
      }

      if (result.error) throw result.error;
      
      return { user: result.user, error: null };
    }

    return { user, error: null };
  } catch (err) {
      return { user: null, error: err };
  }
}

/**
 * Helper alias specifically for ensuring admin role
 */
export async function ensureAdminRole() {
    return ensureRoleMetadata('admin');
}