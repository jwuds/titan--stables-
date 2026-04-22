
export const validateSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error('Missing Supabase configuration. Please check your environment variables.');
    return false;
  }
  return true;
};

export const handleSupabaseError = (error, defaultReturnValue = null) => {
  if (!error) return { data: null, error: null };
  
  console.error("Supabase Query Error:", error);
  
  // Handle specific error codes
  if (error.code === 'PGRST116') {
    // No rows returned when expecting one
    console.warn("Query returned 0 rows when 1 was expected. Returning default.");
    return { data: defaultReturnValue, error: null };
  }
  
  if (error.code === '42501') {
    // Permission denied / RLS policy violation
    console.error("Permission denied. Check RLS policies for this table.");
    return { data: defaultReturnValue, error: new Error('Permission denied. You may not have access to this resource.') };
  }
  
  if (error.code === '23505') {
    // Unique constraint violation
    console.error("Duplicate entry detected.");
    return { data: defaultReturnValue, error: new Error('This record already exists.') };
  }
  
  if (error.message && error.message.includes('JWT')) {
    // Authentication issues
    console.error("Authentication error. User may need to re-login.");
    return { data: defaultReturnValue, error: new Error('Authentication error. Please try logging in again.') };
  }
  
  return { data: defaultReturnValue, error };
};

export const fetchWithTimeout = async (promise, timeoutMs = 10000) => {
  let timeoutHandle;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } catch (error) {
    if (error.message === 'Request timed out') {
      console.error('Supabase request timed out after', timeoutMs, 'ms');
    }
    throw error;
  } finally {
    clearTimeout(timeoutHandle);
  }
};

export const fetchWithRetry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    console.warn(`Retrying... (${retries} attempts left)`, error.message);
    await new Promise(res => setTimeout(res, delay));
    return fetchWithRetry(fn, retries - 1, delay * 2);
  }
};

// Safe query wrapper that always returns data or empty array/null
export const safeQuery = async (queryPromise, defaultValue = null) => {
  try {
    const result = await queryPromise;
    if (result.error) {
      console.error('Supabase query error:', result.error);
      return { data: defaultValue, error: result.error };
    }
    return { data: result.data || defaultValue, error: null };
  } catch (error) {
    console.error('Unexpected error in safeQuery:', error);
    return { data: defaultValue, error };
  }
};
