import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ShieldAlert, LogOut, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const AdminDeniedPage = () => {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title>Access Denied | Titan Stables</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-red-50 p-6 flex flex-col items-center justify-center border-b border-red-100">
             <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="h-10 w-10 text-red-600" />
             </div>
             <h1 className="text-2xl font-bold text-red-900">Access Denied</h1>
             <p className="text-red-700 font-medium mt-1">Admin Privileges Required</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
                <p className="text-slate-600">
                   You are currently logged in as <strong>{currentUser?.email}</strong>.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-700">
                    <span>Current Role:</span>
                    <span className="uppercase text-primary">{userRole || 'USER'}</span>
                </div>
                <p className="text-slate-500 text-sm mt-4">
                    The page you are trying to access requires administrative privileges. 
                    If you believe this is an error, please contact the system administrator.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <Button onClick={handleLogout} variant="outline" className="w-full border-red-200 hover:bg-red-50 text-red-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
                <Button asChild className="w-full bg-slate-900 hover:bg-slate-800">
                    <Link to="/">
                        <Home className="mr-2 h-4 w-4" />
                        Go Home
                    </Link>
                </Button>
            </div>
            
            <div className="text-center">
                 <Button variant="link" onClick={() => navigate(-1)} className="text-slate-400 text-sm">
                    <ArrowLeft className="mr-2 h-3 w-3" />
                    Go Back
                 </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDeniedPage;