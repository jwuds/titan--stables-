import { supabase } from '@/lib/customSupabaseClient';
import { isCanonicalUrl } from '@/lib/canonicalUrl';

/**
 * Validates canonical tags on the current page.
 * Checks for duplicates, non-canonical formats, etc.
 */
export async function validatePageCanonicals() {
  const canonicals = document.querySelectorAll('link[rel="canonical"]');
  const errors = [];

  // 1. Check for multiple tags
  if (canonicals.length > 1) {
    errors.push(`Multiple canonical tags found: ${canonicals.length}`);
  }

  // 2. Validate format of each tag
  canonicals.forEach(tag => {
    const href = tag.getAttribute('href');
    if (!href) return;

    if (!href.startsWith('https://')) {
      errors.push(`Non-HTTPS canonical: ${href}`);
    }
    
    if (!isCanonicalUrl(href)) {
      errors.push(`Canonical URL format incorrect (should be normalized): ${href}`);
    }
  });

  if (errors.length > 0) {
    console.warn('[Canonical Validation Failed]', errors);
    
    // Log to Supabase
    if (!import.meta.env.DEV) {
      try {
        await supabase.from('canonical_validation_errors').insert({
          url: window.location.href,
          error_message: errors.join('; '),
        });
      } catch (err) {
        console.error('Failed to log validation error', err);
      }
    }
  } else {
    // console.log('[Canonical Validation Passed]');
  }
  
  return errors;
}