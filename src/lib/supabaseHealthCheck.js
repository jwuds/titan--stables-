import { supabase } from '@/lib/customSupabaseClient';
import { validateSupabaseConfig, fetchWithRetry, fetchWithTimeout } from './supabaseErrorHandler';

export const checkSupabaseHealth = async () => {
  if (!validateSupabaseConfig()) {
    return { status: 'error', message: 'Missing configuration' };
  }

  try {
    const result = await fetchWithRetry(
      () => fetchWithTimeout(supabase.from('site_content').select('key').limit(1), 5000),
      2,
      1000
    );

    if (result.error && result.error.code !== 'PGRST116') {
      throw result.error;
    }

    console.log('Supabase connection verified successfully.');
    return { status: 'ok' };
  } catch (error) {
    console.error('Supabase health check failed:', error);
    return { status: 'error', message: error.message };
  }
};