import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      // Successful authentication, redirect to /admin
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1128] flex items-center justify-center p-4 font-body relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-1000"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="bg-[#0A1128] p-8 text-center border-b-[4px] border-[#D4AF37] relative">
          <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-[#0A1128]" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Titan Stables</h1>
          <p className="text-[#D4AF37] tracking-widest text-sm uppercase font-semibold">Admin Portal</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2 relative">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@titanstables.com"
                  className={`pl-10 py-6 bg-slate-50 border-slate-200 text-slate-900 focus:border-[#D4AF37] focus:ring-[#D4AF37] ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } })}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 relative">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                <button type="button" className="text-sm text-[#0A1128] hover:text-[#D4AF37] font-medium transition-colors" onClick={() => alert("Contact system administrator to reset password.")}>Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 py-6 bg-slate-50 border-slate-200 text-slate-900 focus:border-[#D4AF37] focus:ring-[#D4AF37] ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-slate-300 data-[state=checked]:bg-[#0A1128] data-[state=checked]:text-white" />
              <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600">
                Remember me for 30 days
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 text-lg font-bold bg-[#0A1128] hover:bg-[#0A1128]/90 text-white rounded-xl shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#D4AF37]" />
                  Authenticating...
                </>
              ) : (
                'Sign In Securely'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}