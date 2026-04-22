/**
 * Security Headers Utility
 * Provides standard security headers for API requests to mitigate ModSecurity blocks
 * and enhance client-side security.
 */

export const getSecurityHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Helps identify AJAX requests, prevents some CSRF
    'X-Content-Type-Options': 'nosniff',
    // Note: Some headers like X-Frame-Options are response headers, but sending them
    // in requests sometimes helps WAFs understand the client's intent or capability.
    'X-Client-Version': '1.0.0' 
  };
};

/**
 * Generates a simple CSRF-like token for form submissions.
 * In a static frontend/Supabase setup, true CSRF is handled by auth tokens,
 * but this adds a layer of randomness to prevent replay/bot attacks if checked by Edge Functions.
 */
export const generateClientToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};