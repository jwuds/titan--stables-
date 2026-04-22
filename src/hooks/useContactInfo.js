
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { safeQuery } from '@/lib/supabaseErrorHandler';
import { 
  cacheGet, 
  cacheSet, 
  deduplicateRequest, 
  getFromLocalStorageFallback,
  CACHE_KEYS 
} from '@/lib/queryCache';
import { 
  fetchWithRetry, 
  withCircuitBreaker, 
  handleSupabaseError, 
  storeFallbackData, 
  getFallbackData 
} from '@/lib/supabaseErrorRecovery';

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const fallbackContactInfo = {
  id: null,
  business_name: 'Titan Stables',
  phone_number: '+1 (434) 253-5844',
  email_address: 'sales@titanstables.org',
  whatsapp_number: '+1 (434) 253-5844',
  google_maps_url: '',
  social_media: {},
};

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState(fallbackContactInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = cacheGet(CACHE_KEYS.CONTACT_INFO);
      if (cached) {
        setContactInfo(cached);
        setLoading(false);
        return;
      }

      // Check localStorage fallback
      const localFallback = getFromLocalStorageFallback(CACHE_KEYS.CONTACT_INFO);
      if (localFallback) {
        setContactInfo(localFallback);
        setLoading(false);
        // Continue fetching in background
      }

      // Deduplicate concurrent requests
      const data = await deduplicateRequest(
        CACHE_KEYS.CONTACT_INFO,
        () => withCircuitBreaker(
          'contact_info',
          () => fetchWithRetry(
            async () => {
              const query = supabase
                .from('contact_info')
                .select('business_name, phone_number, email_address, whatsapp_number, google_maps_url, social_media')
                .limit(1);

              const { data, error: queryError } = await safeQuery(query.maybeSingle(), null);

              if (queryError) throw queryError;
              return data || fallbackContactInfo;
            },
            { 
              retries: 3,
              timeout: 10000,
              fallbackData: getFallbackData('contact_info', fallbackContactInfo) 
            }
          ),
          getFallbackData('contact_info', fallbackContactInfo)
        )
      );

      if (data) {
        setContactInfo(data);
        storeFallbackData('contact_info', data);
        cacheSet(CACHE_KEYS.CONTACT_INFO, data, CACHE_TTL);
      }
    } catch (err) {
      const errorInfo = handleSupabaseError(err, 'useContactInfo');
      setError(errorInfo.message);
      
      // Use fallback data
      const fallback = getFallbackData('contact_info', fallbackContactInfo);
      setContactInfo(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const updateContactInfo = async (updates) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const result = await fetchWithRetry(
        async () => {
          let query;
          
          if (contactInfo.id) {
            query = supabase
              .from('contact_info')
              .update(payload)
              .eq('id', contactInfo.id)
              .select('business_name, phone_number, email_address, whatsapp_number, google_maps_url, social_media');
          } else {
            query = supabase
              .from('contact_info')
              .insert([payload])
              .select('business_name, phone_number, email_address, whatsapp_number, google_maps_url, social_media');
          }

          const { data, error } = await safeQuery(query.maybeSingle(), null);
          if (error) throw error;
          return data;
        },
        { retries: 2, timeout: 15000 }
      );

      if (result) {
        setContactInfo(result);
        cacheSet(CACHE_KEYS.CONTACT_INFO, result, CACHE_TTL);
        storeFallbackData('contact_info', result);
        return { success: true, data: result };
      }
    } catch (err) {
      const errorInfo = handleSupabaseError(err, 'updateContactInfo');
      setError(errorInfo.message);
      return { success: false, error: errorInfo.message };
    } finally {
      setLoading(false);
    }
  };

  // Memoize contact info to prevent unnecessary re-renders
  const memoizedContactInfo = useMemo(() => contactInfo, [JSON.stringify(contactInfo)]);

  return {
    contactInfo: memoizedContactInfo,
    loading,
    updateContactInfo,
    error,
    refresh: fetchContactInfo,
  };
};
