/**
 * Utility functions for URL canonicalization and normalization.
 */

const TARGET_DOMAIN = 'titanstables.org';
const TARGET_ORIGIN = `https://${TARGET_DOMAIN}`;

// Params to explicitly remove from canonical URLs (SEO clean up)
const PARAMS_TO_REMOVE = [
  'sort', 'filter', 'utm_source', 'utm_medium', 'utm_campaign', 
  'utm_term', 'utm_content', 'replytocom', 'fbclid', 'ref', 'page'
];

/**
 * Generates the strict canonical URL for SEO tags (Helmet).
 * ALWAYS returns the production URL (https://titanstables.org)
 * regardless of the current environment.
 */
export function getCanonicalUrl(pathname, search = '') {
  // 1. Normalize pathname: lowercase and ensure trailing slash
  let cleanPath = pathname.toLowerCase();
  
  // Ensure trailing slash for non-file paths
  if (!cleanPath.endsWith('/') && !cleanPath.includes('.')) {
    cleanPath += '/';
  }

  // 2. Clean search params
  const searchParams = new URLSearchParams(search);
  PARAMS_TO_REMOVE.forEach(param => {
    if (param.endsWith('*')) {
      const prefix = param.slice(0, -1);
      [...searchParams.keys()].forEach(key => {
        if (key.startsWith(prefix)) searchParams.delete(key);
      });
    } else {
      searchParams.delete(param);
    }
  });

  searchParams.sort();
  const cleanSearch = searchParams.toString();
  
  return `${TARGET_ORIGIN}${cleanPath}${cleanSearch ? '?' + cleanSearch : ''}`;
}

/**
 * Checks if the current browser URL matches the expected strict format.
 * Returns the URL we should redirect TO, or null if no redirect needed.
 * 
 * LOGIC:
 * 1. If on titanstables.com -> Redirect to titanstables.org
 * 2. If on localhost -> Do NOT redirect domain, only normalize path
 * 3. If on titanstables.org -> Enforce HTTPS, remove www, normalize path
 */
export function getRedirectUrl(currentUrl) {
  try {
    const urlObj = new URL(currentUrl);
    const { hostname, pathname, search, protocol } = urlObj;

    // --- DOMAIN MIGRATION LOGIC ---
    
    // 1. Critical: Migrate FROM old domain
    if (hostname === 'titanstables.com' || hostname === 'www.titanstables.com') {
      // Keep path and search, but switch origin to .org
      return `${TARGET_ORIGIN}${pathname}${search}`;
    }

    // 2. Localhost / Preview Safety
    // If we are developing locally, DO NOT force the domain to production
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1') || hostname.includes('web-app.local')) {
      // Just normalize the path (slash/case) but keep the origin
      const normalizedPath = normalizePath(pathname);
      const newUrl = `${protocol}//${hostname}${urlObj.port ? ':' + urlObj.port : ''}${normalizedPath}${search}`;
      return newUrl === currentUrl ? null : newUrl;
    }

    // 3. Production Normalization (titanstables.org)
    if (hostname === TARGET_DOMAIN || hostname === `www.${TARGET_DOMAIN}`) {
       // Enforce HTTPS
       if (protocol !== 'https:') {
         return `https://${TARGET_DOMAIN}${pathname}${search}`;
       }
       
       // Enforce non-www
       if (hostname === `www.${TARGET_DOMAIN}`) {
         return `https://${TARGET_DOMAIN}${pathname}${search}`;
       }

       // Normalize Path (Slash/Case)
       const normalizedPath = normalizePath(pathname);
       const newUrl = `https://${TARGET_DOMAIN}${normalizedPath}${search}`;
       
       return newUrl === currentUrl ? null : newUrl;
    }

    // Default: Don't interfere with other domains (e.g. preview deployments)
    return null;

  } catch (e) {
    console.error('Invalid URL for normalization:', currentUrl);
    return null;
  }
}

export function isCanonicalUrl(url) {
  const redirectUrl = getRedirectUrl(url);
  return redirectUrl === null;
}

// Helper to normalize path string (lowercase + trailing slash)
function normalizePath(pathname) {
  let cleanPath = pathname.toLowerCase();
  if (!cleanPath.endsWith('/') && !cleanPath.includes('.')) {
    cleanPath += '/';
  }
  return cleanPath;
}

export function getCurrentPage(searchParams) {
  const page = searchParams.get('page');
  return page ? parseInt(page, 10) : 1;
}

export function normalizeUrl(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'titanstables.com') {
       urlObj.hostname = 'titanstables.org';
       urlObj.protocol = 'https:';
    }
    return getCanonicalUrl(urlObj.pathname, urlObj.search);
  } catch (e) {
    return url;
  }
}