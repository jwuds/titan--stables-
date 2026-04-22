import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

const SuccessPage = () => {
  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Payment Successful | Titan Stables</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="max-w-md w-full bg-slate-900/80 border border-white/10 backdrop-blur-md rounded-3xl p-8 text-center shadow-2xl"
        >
          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 bg-green-500/20 rounded-full flex items-center justify-center">
               <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-slate-400 mb-8">
            Thank you for your purchase. You will receive a confirmation email shortly with your order details.
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full h-12 text-lg" size="lg">
              <Link to="/store">
                Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-12 text-lg border-white/10 text-slate-300 hover:bg-white/5">
              <Link to="/">
                <Home className="ml-2 h-4 w-4" /> Return Home
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SuccessPage;