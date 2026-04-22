import { supabase } from '@/lib/customSupabaseClient';

/**
 * Logs a URL redirect event to Supabase.
 * @param {string} originalUrl 
 * @param {string} canonicalUrl 
 * @param {string} type - 'http_to_https', 'www_removal', 'trailing_slash', 'case_normalization', 'parameter_removal'
 */
export async function logRedirect(originalUrl, canonicalUrl, type) {
  // Avoid logging in development to prevent noise
  if (import.meta.env.DEV) {
    // console.log(`[Redirect Logged]: ${type} | ${originalUrl} -> ${canonicalUrl}`);
    return;
  }

  try {
    const { error } = await supabase.from('url_redirects').insert({
      original_url: originalUrl,
      canonical_url: canonicalUrl,
      redirect_type: type,
      user_agent: navigator.userAgent,
      // ip_address is typically handled by the server/Supabase automatically or via edge function
    });

    if (error) {
      console.warn('Failed to log redirect:', error);
    }
  } catch (err) {
    console.error('Error logging redirect:', err);
  }
}