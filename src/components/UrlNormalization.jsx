import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRedirectUrl } from '@/lib/canonicalUrl';
import { logRedirect } from '@/lib/redirectLogger';

const UrlNormalization = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // We use window.location.href because we need to check protocol and hostname,
    // which React Router's 'location' object doesn't always provide fully for the current page context.
    const currentUrl = window.location.href;
    
    // Check if we need to redirect
    const targetUrl = getRedirectUrl(currentUrl);

    if (targetUrl && targetUrl !== currentUrl) {
      // Determine if this is an external redirect (domain change) or internal (path fix)
      const currentObj = new URL(currentUrl);
      const targetObj = new URL(targetUrl);

      // Log the attempt (safely)
      logRedirect(currentUrl, targetUrl, 'normalization_auto');

      if (currentObj.origin !== targetObj.origin) {
        // Domain/Protocol change: Must use window.location
        // This handles .com -> .org migration
        window.location.replace(targetUrl);
      } else {
        // Same domain, just path/query normalization: Use Router for smoother UX
        // However, if we need to force trailing slash or case, router might replace history
        const routerPath = targetObj.pathname + targetObj.search;
        navigate(routerPath, { replace: true });
      }
    }
  }, [location, navigate]);

  return <>{children}</>;
};

export default UrlNormalization;