import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onINP } from 'web-vitals';
import { supabase } from '@/lib/customSupabaseClient';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Only monitor in production or when explicitly enabled
    // We'll run it always for now but check environment for logging
    const isDev = import.meta.env.DEV;

    function sendToAnalytics(metric) {
      // Log to console in Dev
      if (isDev) {
        console.log(`[Web Vitals] ${metric.name}:`, metric.value, `Rating: ${metric.rating}`);
      }

      // Send to Supabase
      // Use navigator.sendBeacon or fetch. Since Supabase client uses fetch, we use that.
      // We wrap in a requestIdleCallback or setTimeout to not block main thread
      const body = {
        metric_name: metric.name,
        value: metric.value,
        rating: metric.rating,
        navigation_type: metric.navigationType,
        path: window.location.pathname,
        user_agent: navigator.userAgent
      };

      // Fire and forget
      if (!isDev) {
          // In production, we send this to DB
          supabase.from('web_vitals').insert(body).then(({ error }) => {
            if (error) console.error('Failed to log web vital', error);
          });
      }
    }

    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onINP(sendToAnalytics);

  }, []);

  return null; // Headless component
};

export default PerformanceMonitor;