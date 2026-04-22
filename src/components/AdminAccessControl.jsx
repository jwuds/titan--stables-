import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminAccessControl = ({ children }) => {
  const { user, loading } = useAuth();
  const [showError, setShowError] = useState(false);

  // Determine admin status directly from user metadata
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'super_admin';

  useEffect(() => {
    if (!loading && !isAdmin) {
      setShowError(true);
    }
  }, [loading, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-slate-600 font-medium">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin && showError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-red-100">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-6">
            You do not have permission to view this area. This section is restricted to the system administrator.
          </p>
          <Button onClick={() => window.location.href = '/'} className="w-full">
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return isAdmin ? <>{children}</> : null;
};

export default AdminAccessControl;