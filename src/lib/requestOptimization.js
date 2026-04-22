export const fetchWithRetryBackoff = async (fn, maxRetries = 3, initialDelay = 1000) => {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        throw error;
      }
      
      const delay = initialDelay * Math.pow(2, attempt - 1);
      console.warn(`Request failed. Retrying in ${delay}ms... (Attempt ${attempt} of ${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Batch requests to reduce API calls
const batchQueue = new Map();
const BATCH_WINDOW_MS = 50;

export const batchedRequest = (key, fetcher) => {
  return new Promise((resolve, reject) => {
    if (!batchQueue.has(key)) {
      batchQueue.set(key, {
        callbacks: [],
        timeout: setTimeout(async () => {
          const { callbacks } = batchQueue.get(key);
          batchQueue.delete(key);
          
          try {
            const result = await fetcher();
            callbacks.forEach(cb => cb.resolve(result));
          } catch (error) {
            callbacks.forEach(cb => cb.reject(error));
          }
        }, BATCH_WINDOW_MS)
      });
    }
    
    batchQueue.get(key).callbacks.push({ resolve, reject });
  });
};