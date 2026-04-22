import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const AnalyticsTracker = () => {
  const location = useLocation();
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    let sid = sessionStorage.getItem('session_id');
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('session_id', sid);
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    const trackView = async () => {
      if (!sessionId) return;
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const userAgent = navigator.userAgent;
        const deviceType = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent) ? 'Mobile' : /Tablet|iPad|Playbook/.test(userAgent) ? 'Tablet' : 'Desktop';
        
        await supabase.from('site_analytics_events').insert({
          event_type: 'page_view',
          page_path: location.pathname,
          device_type: deviceType,
          location: timeZone.split('/')[0] || 'Unknown',
          user_agent: userAgent,
          session_id: sessionId,
          referrer: document.referrer || 'Direct'
        });
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    trackView();
  }, [location, sessionId]);

  return null;
};

export default AnalyticsTracker;