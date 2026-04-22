import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';

const GeoBlocker = ({ children }) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        // Using ipwho.is as it's a free, reliable geolocation API that doesn't require an API key for basic use
        // and supports HTTPS.
        const response = await fetch('https://ipwho.is/');
        const data = await response.json();

        if (data.success) {
          // Check if country code is NL (Netherlands)
          if (data.country_code === 'NL') {
            setIsBlocked(true);
          }
        }
      } catch (error) {
        console.error('Geo-blocking check failed:', error);
        // Fail open: if the check fails, we allow access to avoid blocking legitimate users due to API errors
      } finally {
        setIsLoading(false);
      }
    };

    checkLocation();
  }, []);

  if (isLoading) {
    // Render a minimal loading state or just render children hidden to prevent content flash
    return <div className="min-h-screen bg-slate-950" />; 
  }

  if (isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
        <div className="max-w-md text-center p-8 bg-slate-900 rounded-xl border border-red-900/50 shadow-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/20 rounded-full mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-red-500">Access Restricted</h1>
          <p className="text-slate-400 mb-6">
            We apologize, but access to Titan Stables is currently restricted from your location (Netherlands) due to regional compliance policies.
          </p>
          <div className="text-xs text-slate-600 font-mono">
            Error Code: GEO_RESTRICTION_NL
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default GeoBlocker;