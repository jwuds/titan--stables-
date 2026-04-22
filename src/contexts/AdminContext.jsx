import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if user is authenticated. In a real app, you'd check roles/emails.
          // For this example, we assume authenticated users have admin privileges 
          // based on the RLS policies created.
          setIsAdmin(true);
          setAdminUser(session.user);
        } else {
          setIsAdmin(false);
          setAdminUser(null);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAdmin(true);
        setAdminUser(session.user);
      } else {
        setIsAdmin(false);
        setAdminUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, adminUser, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);