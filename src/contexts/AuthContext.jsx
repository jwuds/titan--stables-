import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { setUserAsAdmin as setUserAsAdminHelper } from '@/lib/setupAdmin.js';
import { isAdminUser } from '@/lib/adminAuthCheck';

export const AuthContext = createContext(undefined);

const clearLocalAuth = () => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.error("Failed to clear local auth:", e);
  }
};

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSession = useCallback((currentSession) => {
    setLoading(true);
    setSession(currentSession);
    
    const user = currentSession?.user ?? null;
    setCurrentUser(user);

    if (user) {
      const isSuperAdmin = isAdminUser(user);
      const metadata = user.user_metadata || {};
      const role = isSuperAdmin ? 'admin' : (metadata.role || null);
      setUserRole(role);
      
      if (isSuperAdmin) {
        console.log(`[AuthContext] Admin verified: ${user.email}`);
      }
    } else {
      setUserRole(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
            if (error.message.includes('refresh_token_not_found') || error.message.includes('Invalid Refresh Token')) {
               clearLocalAuth();
            }
            throw error;
        }
        handleSession(initialSession);
      } catch (err) {
        console.error("Session check error:", err);
        clearLocalAuth();
        setError(err.message);
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        try {
          if (event === 'SIGNED_OUT') {
             clearLocalAuth();
             setCurrentUser(null);
             setUserRole(null);
             setSession(null);
             setLoading(false);
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
             handleSession(newSession);
          } else if (event === 'TOKEN_REFRESH_FAILED') {
             clearLocalAuth();
             setCurrentUser(null);
             setUserRole(null);
             setSession(null);
             setLoading(false);
             console.error("Token refresh failed. User logged out silently.");
          }
        } catch (err) {
          console.error("Auth state listener error:", err);
          clearLocalAuth();
          setCurrentUser(null);
          setSession(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
          clearLocalAuth();
          handleSession(null);
          return { data: null, error };
      }
      if (data?.session) {
          handleSession(data.session);
      }
      return { data, error: null };
    } catch (err) {
      clearLocalAuth();
      handleSession(null);
      return { data: null, error: err };
    }
  }, [handleSession]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      clearLocalAuth();
      setCurrentUser(null);
      setUserRole(null);
      setSession(null);
      return { error: null };
    } catch (err) {
      clearLocalAuth();
      setCurrentUser(null);
      setUserRole(null);
      setSession(null);
      return { error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!currentUser && !!session;
  }, [currentUser, session]);

  const isAdmin = useCallback(() => {
    if (!currentUser) return false;
    return isAdminUser(currentUser);
  }, [currentUser]);

  const setUserAsAdmin = useCallback(async () => {
    try {
        const result = await setUserAsAdminHelper(supabase);
        if (result.success) {
            await refreshSession();
            toast({
                title: "Role Updated",
                description: "You are now an admin.",
            });
        }
        return result;
    } catch (err) {
        return { success: false, error: err.message };
    }
  }, [refreshSession, toast]);

  const value = useMemo(() => ({
    currentUser,
    user: currentUser,
    session,
    userRole,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    adminEmail: isAdmin() ? currentUser?.email : null,
    login,
    logout,
    refreshToken: refreshSession,
    refreshSession,
    signIn: login,
    signOut: logout,
    signUp: async (email, password, options) => await supabase.auth.signUp({ email, password, options }),
    setUserAsAdmin
  }), [currentUser, session, userRole, loading, error, isAuthenticated, isAdmin, login, logout, refreshSession, setUserAsAdmin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};