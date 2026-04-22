
import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { safeQuery } from '@/lib/supabaseErrorHandler';
import { 
  cacheGet, 
  cacheSet, 
  deduplicateRequest, 
  invalidateCache, 
  CACHE_KEYS 
} from '@/lib/queryCache';
import { 
  fetchWithRetry, 
  withCircuitBreaker, 
  handleSupabaseError 
} from '@/lib/supabaseErrorRecovery';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const HORSES_PER_PAGE = 12;

export const useHorses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllHorses = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    const {
      status,
      breed,
      minPrice,
      maxPrice,
      minAge,
      maxAge,
      page = 1,
      limit = HORSES_PER_PAGE,
    } = filters;

    const cacheKey = `${CACHE_KEYS.HORSES}_${JSON.stringify(filters)}`;

    try {
      const cached = cacheGet(cacheKey);
      if (cached) {
        setLoading(false);
        return cached;
      }

      const data = await deduplicateRequest(
        cacheKey,
        () => withCircuitBreaker(
          'horses',
          () => fetchWithRetry(
            async () => {
              let query = supabase
                .from('horses')
                .select('id, name, breed, age, price, images, status, is_featured', { count: 'exact' });

              // Apply filters
              if (status) query = query.eq('status', status);
              if (breed) query = query.eq('breed', breed);
              if (minPrice) query = query.gte('price', minPrice);
              if (maxPrice) query = query.lte('price', maxPrice);
              if (minAge) query = query.gte('age', minAge);
              if (maxAge) query = query.lte('age', maxAge);

              // Sorting: featured first, then by created_at
              query = query.order('is_featured', { ascending: false })
                .order('created_at', { ascending: false });

              // Pagination
              const from = (page - 1) * limit;
              const to = from + limit - 1;
              query = query.range(from, to);

              const { data, error: queryError, count } = await safeQuery(query, []);

              if (queryError) throw queryError;

              // Extract first image URL
              const horses = (data || []).map(horse => ({
                ...horse,
                featured_image_url: Array.isArray(horse.images) && horse.images.length > 0 
                  ? horse.images[0] 
                  : null,
              }));

              return {
                horses,
                total: count || 0,
                page,
                totalPages: Math.ceil((count || 0) / limit),
              };
            },
            { retries: 3, timeout: 10000, fallbackData: { horses: [], total: 0, page, totalPages: 0 } }
          ),
          { horses: [], total: 0, page, totalPages: 0 }
        )
      );

      cacheSet(cacheKey, data, CACHE_TTL);
      setLoading(false);
      return data;
    } catch (err) {
      const errorInfo = handleSupabaseError(err, 'fetchAllHorses');
      setError(errorInfo.message);
      setLoading(false);
      return { horses: [], total: 0, page, totalPages: 0 };
    }
  }, []);

  const fetchHorseById = async (id) => {
    setLoading(true);
    setError(null);

    const cacheKey = `${CACHE_KEYS.HORSES}_id_${id}`;

    try {
      const cached = cacheGet(cacheKey);
      if (cached) {
        setLoading(false);
        return cached;
      }

      const data = await deduplicateRequest(
        cacheKey,
        () => withCircuitBreaker(
          'horse_detail',
          () => fetchWithRetry(
            async () => {
              const query = supabase
                .from('horses')
                .select('*')
                .eq('id', id);

              const { data, error: queryError } = await safeQuery(query.single(), null);

              if (queryError) throw queryError;
              return data;
            },
            { retries: 3, timeout: 10000, fallbackData: null }
          ),
          null
        )
      );

      if (data) {
        cacheSet(cacheKey, data, CACHE_TTL);
      }

      setLoading(false);
      return data;
    } catch (err) {
      const errorInfo = handleSupabaseError(err, 'fetchHorseById');
      setError(errorInfo.message);
      setLoading(false);
      return null;
    }
  };

  const createHorse = async (data) => {
    setError(null);

    try {
      const result = await fetchWithRetry(
        async () => {
          const insertQuery = supabase
            .from('horses')
            .insert([data])
            .select();

          const { data: result, error: queryError } = await safeQuery(insertQuery.single(), null);

          if (queryError) throw queryError;
          return result;
        },
        { retries: 2, timeout: 15000 }
      );

      invalidateCache(CACHE_KEYS.HORSES);
      return result;
    } catch (err) {
      const errorInfo = handleSupabaseError(err, 'createHorse');
      setError(errorInfo.message);
      throw new Error(errorInfo.message);
    }
  };

  const updateHorse = async (id, data) => {
    setError(null);

    try {
      const result = await fetchWithRetry(
        async () => {
          const updateQuery = supabase
            .from('horses')
            .update({ ...data, updated_at: new Date() })
            .eq('id', id)
            .select();

          const { data: result, error: queryError } = await safeQuery(updateQuery.single(), null);

          if (queryError) throw queryError;
          return result;
        },
        { retries: 2, timeout: 15000 }
      );

      invalidateCache(CACHE_KEYS.HORSES);
      return result;
    } catch (err) {
      const errorInfo = handleSupabaseError(err, 'updateHorse');
      setError(errorInfo.message);
      throw new Error(errorInfo.message);
    }
  };

  const deleteHorse = async (id) => {
    setError(null);

    try {
      await fetchWithRetry(
        async () => {
          const deleteQuery = supabase
            .from('horses')
            .delete()
            .eq('id', id);

          const { error: queryError } = await safeQuery(deleteQuery, null);

          if (queryError) throw queryError;
        },
        { retries: 2, timeout: 15000 }
      );

      invalidateCache(CACHE_KEYS.HORSES);
    } catch (err) {
      const errorInfo = handleSupabaseError(err, 'deleteHorse');
      setError(errorInfo.message);
      throw new Error(errorInfo.message);
    }
  };

  const uploadHorseImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('horse-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('horse-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (err) {
      const errorInfo = handleSupabaseError(err, 'uploadHorseImage');
      throw new Error(errorInfo.message);
    }
  };

  return {
    loading,
    error,
    fetchAllHorses,
    fetchHorseById,
    createHorse,
    updateHorse,
    deleteHorse,
    uploadHorseImage,
  };
};
