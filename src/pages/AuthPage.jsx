import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { LogIn } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { validateEmail, sanitizeInput } from '@/lib/inputValidation';
import { checkRateLimit } from '@/lib/formSubmissionHelper';

const AuthPage = () => {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin/horses');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // 1. Rate Limit Check
    if (!checkRateLimit('login_attempt', 5, 300)) { // 5 attempts per 5 mins
        toast({
            variant: "destructive",
            title: "Too many attempts",
            description: "Please try again in 5 minutes.",
        });
        return;
    }

    setLoading(true);

    // 2. Input Validation
    if (!validateEmail(email)) {
        toast({ variant: "destructive", title: "Invalid Input", description: "Please enter a valid email." });
        setLoading(false);
        return;
    }
    
    // 3. Sanitization (Email only, never sanitize password as it breaks hashes)
    const cleanEmail = sanitizeInput(email);

    const { error } = await signIn(cleanEmail, password);
    if (!error) {
      toast({
        title: 'Sign In Successful',
        description: 'Redirecting to admin dashboard...',
      });
      navigate('/admin/horses');
    } else {
        // Generic error message for security
        toast({
            variant: "destructive",
            title: "Sign In Failed",
            description: "Invalid credentials.",
        });
    }
    setLoading(false);
  };

  return (
    <>
    <Helmet>
        <title>Admin Sign In - Titan Stables</title>
        <meta name="description" content="Sign in to the administrative dashboard to manage horse listings." />
    </Helmet>
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Sign In
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="email-address">Email address</Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                maxLength={100}
              />
            </div>
            <div className='pt-4'>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                maxLength={100}
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : <><LogIn className="mr-2 h-4 w-4" /> Sign In</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default AuthPage;