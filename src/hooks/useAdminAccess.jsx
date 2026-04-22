import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export const useAdminAccess = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAdminAccess must be used within an AuthProvider');
  }

  const { currentUser, loading, error, isAdmin } = context;

  return {
    isAdmin: isAdmin(),
    adminEmail: currentUser?.email === 'jameswurdy@gmail.com' ? currentUser.email : null,
    isLoading: loading,
    error: error
  };
};