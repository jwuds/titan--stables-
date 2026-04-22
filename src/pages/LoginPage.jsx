import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/customSupabaseClient';
import { setCurrentUserAsAdmin } from '@/lib/setupAdmin.js';
import { Loader2, Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  
  const { login, refreshToken, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setStatusMsg("");
    setIsLoading(true);

    if (!email || !password) {
        setErrorMsg("Please enter both email and password.");
        setIsLoading(false);
        return;
    }

    try {
      setStatusMsg("Authenticating...");
      // 1. Perform Login
      const { data, error } = await login(email, password);

      if (error) {
        throw new Error(error.message || "Login failed.");
      }

      const user = data.user;
      if (!user) throw new Error("No user returned from login.");

      // 2. Setup Admin Role (Self-provisioning logic)
      if (!user.user_metadata?.role) {
          setStatusMsg("Setting up admin access...");
          console.log("No role detected. Auto-provisioning admin for:", user.email);
          
          const setupResult = await setCurrentUserAsAdmin();
          
          if (!setupResult.success) {
             console.warn("Auto-admin setup incomplete:", setupResult.error);
             // We continue, but they might not have access
          } else {
             setStatusMsg("Refreshing permissions...");
             // Force token refresh to get new claims
             await refreshToken();
          }
      }

      // 3. Verify Final Access
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      const role = freshUser?.user_metadata?.role;
      
      console.log("Final Login Check - Role:", role);

      if (role === 'admin' || role === 'super_admin') {
         toast({
            title: "Administrator Access Granted",
            description: "Welcome to Titan Stables Admin Portal.",
        });
        navigate('/admin', { replace: true });
      } else {
         // Logged in but not admin
         toast({
            title: "Welcome Back",
            description: "Logged in successfully as user.",
         });
         navigate(from === '/admin' ? '/' : from, { replace: true });
      }

    } catch (err) {
      console.error("Login Error:", err);
      setErrorMsg(err.message === 'Failed to fetch' ? "Network error. Please try again." : err.message);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err.message
      });
    } finally {
      setIsLoading(false);
      setStatusMsg("");
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Titan Stables</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 to-black z-0" />
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-30" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] opacity-30" />

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md px-6"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 md:p-10 relative overflow-hidden group">
            <div className="flex flex-col items-center mb-8">
               <div className="h-20 w-20 rounded-full bg-slate-900/50 border border-yellow-600/30 flex items-center justify-center mb-4 shadow-inner">
                 <img 
                   src="https://horizons-cdn.hostinger.com/26e5af24-e95b-4c1d-b14c-1303ec73c93a/6f8c70d2e367901817b1fc0b00615122.jpg" 
                   alt="Titan Stables" 
                   className="h-16 w-16 object-cover rounded-full"
                 />
               </div>
               <h1 className="text-3xl font-bold text-white tracking-tight">Titan Stables</h1>
               <p className="text-slate-400 text-sm mt-2">Admin Management Portal</p>
            </div>

            {errorMsg && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
                >
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{errorMsg}</p>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="admin@titanstables.org" 
                        className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-primary focus:ring-primary/20"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-primary focus:ring-primary/20"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                    className="border-slate-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-400">
                    Remember me
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold py-6 shadow-lg shadow-yellow-900/20" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {statusMsg || "Authenticating..."}
                    </>
                ) : (
                    <>
                        <ShieldCheck className="mr-2 h-5 w-5" />
                        Sign In to Dashboard
                    </>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;