import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { setCurrentUserAsAdmin } from '@/lib/setupAdmin.js';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminAccessGranter = () => {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const { refreshToken, currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const grantAccess = async () => {
    setStatus('loading');
    setErrorMessage('');
    
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to request admin access.');
      }

      const result = await setCurrentUserAsAdmin();
      
      if (result.success) {
        setStatus('success');
        toast({
          title: "Admin Access Granted",
          description: "Your account has been upgraded to Administrator.",
          variant: "success",
        });
        
        // Refresh session to update context
        await refreshToken();
        
        // Redirect after delay
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        throw new Error(result.error?.message || "Failed to set admin role");
      }
    } catch (err) {
      console.error("Admin grant failed:", err);
      setStatus('error');
      setErrorMessage(err.message);
      toast({
        title: "Access Request Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Only attempt if not already successful
    if (status !== 'success') {
      grantAccess();
    }
  }, [currentUser]); // Trigger when user loads

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 bg-slate-100 p-3 rounded-full w-fit">
          {status === 'loading' && <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />}
          {status === 'success' && <ShieldCheck className="w-8 h-8 text-green-600" />}
          {status === 'error' && <AlertCircle className="w-8 h-8 text-red-600" />}
        </div>
        <CardTitle className="text-2xl">Admin Authorization</CardTitle>
        <CardDescription>
          Provisioning administrator privileges for your account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <p className="text-slate-600">Please wait while we configure your permissions...</p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-1/2 animate-pulse rounded-full"></div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
              <p className="font-semibold">Success! Admin access granted.</p>
              <p className="text-sm mt-1">Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 text-sm">
              <p className="font-semibold mb-1">Error</p>
              <p>{errorMessage}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/')} variant="outline">
                Cancel
              </Button>
              <Button onClick={grantAccess} className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="w-4 h-4 mr-2" /> Retry
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAccessGranter;