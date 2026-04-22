import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Small delay to not overwhelm user immediately on load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-6xl mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-6 md:flex items-center justify-between gap-6">
            <div className="flex items-start gap-4 mb-4 md:mb-0">
              <div className="p-3 bg-primary/20 rounded-full shrink-0 text-primary">
                <Cookie className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">We value your privacy</h3>
                <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies. Read our <a href="/policies" className="text-primary hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button 
                variant="outline" 
                onClick={handleDecline}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Decline
              </Button>
              <Button 
                onClick={handleAccept}
                className="bg-primary hover:bg-primary/90 text-white font-semibold"
              >
                Accept All
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;