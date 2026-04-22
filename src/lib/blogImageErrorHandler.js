
/**
 * Blog Image Error Handler
 * Handles image load failures with retry logic and fallback
 */

import { trackError } from '@/lib/performanceMonitoring';
import { DEFAULT_PLACEHOLDER } from '@/lib/blogImageOptimization';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second
const failedImages = new Set();
const loadTimes = new Map();

/**
 * Handle image load error with retry logic
 */
export const handleImageError = async (imgElement, originalSrc, retryCount = 0) => {
  const imageKey = `${originalSrc}_${retryCount}`;
  
  // Log error
  console.warn(`Image load failed (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`, originalSrc);
  
  // Track error in performance monitoring
  trackError(new Error(`Blog image load failed: ${originalSrc}`), {
    component: 'BlogImage',
    retryCount,
    imageUrl: originalSrc,
  });

  // If max retries reached, use fallback
  if (retryCount >= MAX_RETRIES) {
    failedImages.add(originalSrc);
    imgElement.src = DEFAULT_PLACEHOLDER;
    imgElement.alt = 'Blog post image unavailable';
    imgElement.classList.add('image-error');
    
    console.error(`Image permanently failed after ${MAX_RETRIES + 1} attempts:`, originalSrc);
    return;
  }

  // Wait before retry
  await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

  // Retry loading
  console.log(`Retrying image load (attempt ${retryCount + 2}/${MAX_RETRIES + 1}):`, originalSrc);
  
  const newImg = new Image();
  newImg.onload = () => {
    imgElement.src = originalSrc;
    imgElement.classList.remove('image-loading', 'image-error');
    imgElement.classList.add('image-loaded');
    console.log(`Image loaded successfully on retry ${retryCount + 1}:`, originalSrc);
  };
  
  newImg.onerror = () => {
    handleImageError(imgElement, originalSrc, retryCount + 1);
  };

  newImg.src = originalSrc;
};

/**
 * Setup image error handling for an img element
 */
export const setupImageErrorHandling = (imgElement, src) => {
  if (!imgElement || !src) return;

  // Check if this image has already failed
  if (failedImages.has(src)) {
    imgElement.src = DEFAULT_PLACEHOLDER;
    imgElement.alt = 'Blog post image unavailable';
    imgElement.classList.add('image-error');
    return;
  }

  // Add error handler
  imgElement.addEventListener('error', () => {
    handleImageError(imgElement, src, 0);
  }, { once: true });

  // Track load time
  const startTime = performance.now();
  imgElement.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    loadTimes.set(src, loadTime);
    
    if (loadTime > 3000) {
      console.warn(`Slow image load (${loadTime.toFixed(0)}ms):`, src);
    }
    
    imgElement.classList.remove('image-loading');
    imgElement.classList.add('image-loaded');
  }, { once: true });
};

/**
 * Preload image with error handling
 */
export const preloadImageWithErrorHandling = (src) => {
  return new Promise((resolve, reject) => {
    if (failedImages.has(src)) {
      resolve(DEFAULT_PLACEHOLDER);
      return;
    }

    const img = new Image();
    const startTime = performance.now();

    img.onload = () => {
      const loadTime = performance.now() - startTime;
      loadTimes.set(src, loadTime);
      resolve(src);
    };

    img.onerror = async () => {
      console.warn('Preload failed, attempting retry:', src);
      
      // Single retry for preload
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
      
      const retryImg = new Image();
      retryImg.onload = () => resolve(src);
      retryImg.onerror = () => {
        failedImages.add(src);
        resolve(DEFAULT_PLACEHOLDER);
      };
      retryImg.src = src;
    };

    img.src = src;
  });
};

/**
 * Get image load statistics
 */
export const getImageLoadStats = () => {
  const times = Array.from(loadTimes.values());
  
  if (times.length === 0) {
    return {
      totalImages: 0,
      failedImages: failedImages.size,
      avgLoadTime: 0,
      maxLoadTime: 0,
      minLoadTime: 0,
    };
  }

  return {
    totalImages: times.length,
    failedImages: failedImages.size,
    avgLoadTime: times.reduce((a, b) => a + b, 0) / times.length,
    maxLoadTime: Math.max(...times),
    minLoadTime: Math.min(...times),
  };
};

/**
 * Reset failed images cache
 */
export const resetFailedImages = () => {
  failedImages.clear();
  console.log('Failed images cache cleared');
};

/**
 * Check if image URL has failed before
 */
export const hasImageFailed = (src) => {
  return failedImages.has(src);
};

/**
 * Log image load performance
 */
export const logImagePerformance = () => {
  const stats = getImageLoadStats();
  console.log('Blog Image Load Statistics:', {
    ...stats,
    avgLoadTime: `${stats.avgLoadTime.toFixed(0)}ms`,
    maxLoadTime: `${stats.maxLoadTime.toFixed(0)}ms`,
    minLoadTime: `${stats.minLoadTime.toFixed(0)}ms`,
  });
};

export { failedImages, loadTimes };
