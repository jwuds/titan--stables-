import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Destructure to ensure we have direct access to user
  const { currentUser } = context;

  // Explicit helper function, robust against null/undefined
  const isAdmin = () => {
    if (!currentUser) return false;
    const role = currentUser.user_metadata?.role;
    return role === 'admin' || role === 'super_admin';
  };

  return {
    ...context,
    isAdmin // Override/ensure this specific function implementation
  };
};