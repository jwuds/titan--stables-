import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldAlert, ShieldCheck, RefreshCw, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx';
import { setCurrentUserAsAdmin } from '@/lib/setupAdmin.js';

const AdminRoleSetterPage = () => {
  const { currentUser, userRole, isAdmin, refreshToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSetRole = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await setCurrentUserAsAdmin();
      if (result.success) {
        setMessage({ type: 'success', text: 'Success! Role updated to ADMIN. Redirecting...' });
        setTimeout(() => navigate('/admin'), 2000);
      } else {
        setMessage({ type: 'error', text: `Failed: ${result.error?.message || 'Unknown error'}` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: `Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    await refreshToken();
    setLoading(false);
  };

  if (!currentUser) {
      return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
              <Card className="w-full max-w-md">
                  <CardHeader>
                      <CardTitle>Not Authenticated</CardTitle>
                      <CardDescription>Please login to set your role.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button onClick={() => navigate('/login')} className="w-full">Go to Login</Button>
                  </CardContent>
              </Card>
          </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-lg shadow-xl border-slate-200">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-slate-100 p-3 rounded-full w-fit mb-4">
             {isAdmin() ? <ShieldCheck className="w-8 h-8 text-green-600" /> : <ShieldAlert className="w-8 h-8 text-amber-600" />}
          </div>
          <CardTitle className="text-2xl">Admin Role Setup</CardTitle>
          <CardDescription>
            Manually promote your current account to Administrator.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm">
             <div className="flex justify-between">
                <span className="text-slate-500">User ID:</span>
                <span className="font-mono text-xs">{currentUser.id}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium">{currentUser.email}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-slate-500">Current Role:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${isAdmin() ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {userRole || 'NONE'}
                </span>
             </div>
          </div>

          {message && (
            <Alert variant={message.type === 'error' ? "error" : "success"}>
               <AlertTitle>{message.type === 'error' ? "Error" : "Success"}</AlertTitle>
               <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
             {!isAdmin() && (
                 <Button 
                    onClick={handleSetRole} 
                    disabled={loading}
                    className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
                 >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
                    Set Current User as Admin
                 </Button>
             )}
             
             {isAdmin() && (
                 <Button onClick={() => navigate('/admin')} className="w-full py-6 text-lg bg-green-600 hover:bg-green-700">
                    Go to Admin Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                 </Button>
             )}

             <Button variant="outline" onClick={handleVerify} disabled={loading} className="w-full">
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Verify / Refresh Role
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRoleSetterPage;