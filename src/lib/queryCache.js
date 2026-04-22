
/**
 * Smart Query Cache with TTL and Request Deduplication
 * Prevents duplicate requests and provides efficient caching
 */

const cache = new Map();
const pendingRequests = new Map();
const CACHE_KEYS = {
  CONTACT_INFO: 'contact_info',
  BLOG_ARTICLES: 'blog_articles',
  HORSES: 'horses',
  FAQS: 'faqs',
  SETTINGS: 'settings',
};

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

/**
 * Cache entry structure
 */
class CacheEntry {
  constructor(data, ttl = DEFAULT_TTL) {
    this.data = data;
    this.timestamp = Date.now();
    this.ttl = ttl;
  }

  isExpired() {
    return Date.now() - this.timestamp > this.ttl;
  }

  getData() {
    return this.data;
  }
}

/**
 * Get data from cache
 */
export const cacheGet = (key) => {
  const entry = cache.get(key);
  
  if (!entry) {
    return null;
  }

  if (entry.isExpired()) {
    cache.delete(key);
    return null;
  }

  return entry.getData();
};

/**
 * Set data in cache with TTL
 */
export const cacheSet = (key, data, ttl = DEFAULT_TTL) => {
  const entry = new CacheEntry(data, ttl);
  cache.set(key, entry);

  // Also store in localStorage for non-critical data (with size limit)
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
  } catch (error) {
    // Silently fail if localStorage is full
    console.warn('localStorage cache failed:', error);
  }

  return data;
};

/**
 * Invalidate cache entry
 */
export const invalidateCache = (key) => {
  if (key) {
    cache.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.warn('localStorage invalidation failed:', error);
    }
  } else {
    // Invalidate all
    cache.clear();
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('cache_')) {
          localStorage.removeItem(k);
        }
      });
    } catch (error) {
      console.warn('localStorage clear failed:', error);
    }
  }
};

/**
 * Get data from localStorage fallback
 */
export const getFromLocalStorageFallback = (key) => {
  try {
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;

    const { data, timestamp, ttl } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > ttl;

    if (isExpired) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }

    return data;
  } catch (error) {
    console.warn('localStorage fallback failed:', error);
    return null;
  }
};

/**
 * Deduplicate concurrent requests
 */
export const deduplicateRequest = async (key, fetchFn) => {
  // Check if request is already pending
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  // Check cache first
  const cached = cacheGet(key);
  if (cached !== null) {
    return Promise.resolve(cached);
  }

  // Execute request and store promise
  const promise = fetchFn()
    .then((data) => {
      cacheSet(key, data);
      pendingRequests.delete(key);
      return data;
    })
    .catch((error) => {
      pendingRequests.delete(key);
      throw error;
    });

  pendingRequests.set(key, promise);
  return promise;
};

/**
 * Exponential backoff retry logic
 */
export const fetchWithRetry = async (fetchFn, retries = MAX_RETRIES) => {
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await fetchFn();
      return result;
    } catch (error) {
      lastError = error;
      
      if (attempt < retries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = RETRY_DELAY * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

/**
 * Batch multiple queries together
 */
export const batchQuery = async (queries) => {
  try {
    const results = await Promise.all(
      queries.map(({ key, fetchFn }) => deduplicateRequest(key, fetchFn))
    );
    return results;
  } catch (error) {
    console.error('Batch query failed:', error);
    throw error;
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  const stats = {
    entries: cache.size,
    pendingRequests: pendingRequests.size,
    memoryUsage: 0,
    keys: [],
  };

  cache.forEach((entry, key) => {
    stats.keys.push({
      key,
      size: JSON.stringify(entry.getData()).length,
      age: Date.now() - entry.timestamp,
      ttl: entry.ttl,
      expired: entry.isExpired(),
    });
    stats.memoryUsage += JSON.stringify(entry.getData()).length;
  });

  return stats;
};

/**
 * Clean expired entries
 */
export const cleanExpiredCache = () => {
  let cleaned = 0;
  cache.forEach((entry, key) => {
    if (entry.isExpired()) {
      cache.delete(key);
      cleaned++;
    }
  });
  return cleaned;
};

/**
 * Prefetch data before it's needed
 */
export const prefetchData = async (key, fetchFn, ttl) => {
  try {
    const data = await fetchFn();
    cacheSet(key, data, ttl);
    return data;
  } catch (error) {
    console.warn('Prefetch failed:', error);
    return null;
  }
};

// Auto-clean expired cache every 5 minutes
setInterval(() => {
  const cleaned = cleanExpiredCache();
  if (cleaned > 0) {
    console.log(`Cleaned ${cleaned} expired cache entries`);
  }
}, 5 * 60 * 1000);

export { CACHE_KEYS, DEFAULT_TTL };
