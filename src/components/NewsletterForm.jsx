import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const NewsletterForm = ({ className, variant = 'default' }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email, status: 'subscribed' }]);

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Already Subscribed",
            description: "This email is already on our list!",
          });
          setSuccess(true); // Treat as success for UX
        } else {
          throw error;
        }
      } else {
        setSuccess(true);
        toast({
          title: "Subscribed!",
          description: "Thank you for joining our newsletter.",
        });
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      toast({
        variant: "destructive",
        title: "Subscription Failed",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn("flex items-center gap-2 text-green-500 font-medium p-2 animate-in fade-in", className)}>
        <CheckCircle2 className="w-5 h-5" />
        <span>You're subscribed!</span>
      </div>
    );
  }

  const isFooter = variant === 'footer';

  return (
    <form onSubmit={handleSubmit} className={cn("flex w-full gap-2", className)}>
      <div className="relative flex-grow">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={cn(
            "w-full",
            isFooter 
              ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-offset-slate-900" 
              : "bg-white"
          )}
        />
        {isFooter && <Mail className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />}
      </div>
      <Button 
        type="submit" 
        disabled={loading}
        className={cn(isFooter ? "bg-primary hover:bg-primary/90" : "")}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isFooter ? "Join" : "Subscribe")}
      </Button>
    </form>
  );
};

export default NewsletterForm;