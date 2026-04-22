import { useState, useEffect, useRef } from 'react';
import { trackQueryTime } from '@/lib/performanceOptimization';

// Global cache object to persist across unmounts
const globalCache = new Map();

// In-flight request deduplication
const inFlightRequests = new Map();

export const useQueryCache = (key, fetcher, options = {}) => {
  const {
    ttl = 5 * 60 * 1000, // Default 5 minutes
    enabled = true,
    initialData = null,
    staleTime = 0
  } = options;

  const [data, setData] = useState(() => {
    if (globalCache.has(key)) {
      const cached = globalCache.get(key);
      if (Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }
    }
    return initialData;
  });
  
  const [loading, setLoading] = useState(!globalCache.has(key) && enabled);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = async (force = false) => {
    if (!key || !enabled) return;

    // Check cache
    if (!force && globalCache.has(key)) {
      const cached = globalCache.get(key);
      if (Date.now() - cached.timestamp < ttl) {
        setData(cached.data);
        setLoading(false);
        // Only refetch silently if stale
        if (staleTime > 0 && Date.now() - cached.timestamp > staleTime) {
          // Proceed to fetch silently
        } else {
          return cached.data;
        }
      }
    }

    // Deduplicate in-flight requests
    if (inFlightRequests.has(key)) {
      try {
        setLoading(true);
        const result = await inFlightRequests.get(key);
        if (isMounted.current) {
          setData(result);
          setLoading(false);
        }
        return result;
      } catch (err) {
        if (isMounted.current) {
          setError(err);
          setLoading(false);
        }
        return null;
      }
    }

    setLoading(true);
    setError(null);

    const fetchPromise = trackQueryTime(`cache_query_${key}`, fetcher());
    inFlightRequests.set(key, fetchPromise);

    try {
      const result = await fetchPromise;
      globalCache.set(key, {
        timestamp: Date.now(),
        data: result
      });
      
      if (isMounted.current) {
        setData(result);
        setError(null);
      }
      return result;
    } catch (err) {
      console.error(`Error fetching data for ${key}:`, err);
      if (isMounted.current) {
        setError(err);
      }
      throw err;
    } finally {
      inFlightRequests.delete(key);
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  const invalidate = () => {
    globalCache.delete(key);
  };

  return { data, loading, error, refetch: () => fetchData(true), invalidate };
};