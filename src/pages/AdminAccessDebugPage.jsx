import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { setCurrentUserAsAdmin } from '@/lib/setupAdmin.js';
import { RefreshCw, Shield, LogOut, Home, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminAccessDebugPage = () => {
  const { currentUser, userRole, isAdmin, logout, refreshToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleSetAdmin = async () => {
    setLoading(true);
    setStatus("Updating...");
    try {
      const result = await setCurrentUserAsAdmin();
      if (result.success) {
        setStatus("Success: Admin role set.");
        await refreshToken();
      } else {
        setStatus(`Error: ${result.error?.message}`);
      }
    } catch (e) {
      setStatus(`Exception: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">Admin Access Debugger</h1>
            <Button variant="outline" onClick={() => navigate('/')}><Home className="mr-2 h-4 w-4"/> Home</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current State */}
            <Card>
                <CardHeader><CardTitle>Current Authentication State</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm border-b pb-4">
                        <span className="font-medium">User ID:</span>
                        <span className="font-mono text-xs">{currentUser?.id || 'Not logged in'}</span>
                        
                        <span className="font-medium">Email:</span>
                        <span>{currentUser?.email || '-'}</span>

                        <span className="font-medium">Role (State):</span>
                        <span className={isAdmin() ? "text-green-600 font-bold" : "text-red-600"}>{userRole || 'None'}</span>

                        <span className="font-medium">isAdmin() Check:</span>
                        <span>{isAdmin() ? <CheckCircle className="inline h-4 w-4 text-green-500"/> : <XCircle className="inline h-4 w-4 text-red-500"/>}</span>
                    </div>

                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md overflow-x-auto">
                        <pre className="text-xs">
                            {JSON.stringify(currentUser?.user_metadata, null, 2)}
                        </pre>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <Card>
                <CardHeader><CardTitle>Troubleshooting Actions</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <Button 
                        onClick={handleSetAdmin} 
                        disabled={loading} 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin"/> : <Shield className="mr-2 h-4 w-4"/>}
                        Force Set Admin Role (Self)
                    </Button>
                    {status && <p className="text-sm text-center font-mono bg-slate-100 p-2 rounded">{status}</p>}

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={() => refreshToken()}>
                            <RefreshCw className="mr-2 h-4 w-4"/> Refresh Session
                        </Button>
                        <Button variant="destructive" onClick={() => logout()}>
                            <LogOut className="mr-2 h-4 w-4"/> Logout
                        </Button>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                        <h4 className="font-medium mb-2">Checklist:</h4>
                        <ul className="text-sm space-y-1 text-slate-600 list-disc pl-5">
                            <li>Is <code>user_metadata.role</code> set to 'admin'?</li>
                            <li>Try refreshing the session if metadata is stale.</li>
                            <li>Check browser console for 'AuthContext' logs.</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAccessDebugPage;