
/**
 * Advanced Image Optimization Utility
 * Progressive loading, responsive images, WebP support
 */

const SUPABASE_STORAGE_URL = import.meta.env.VITE_SUPABASE_URL;

/**
 * Image size breakpoints
 */
const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Generate optimized image URL with transformations
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  const {
    width,
    height,
    quality = 80,
    format = 'auto',
    fit = 'cover',
  } = options;

  if (!url) return '';

  // Check if it's a Supabase storage URL
  const isSupabaseUrl = url.includes(SUPABASE_STORAGE_URL);

  if (isSupabaseUrl) {
    // Supabase storage transformation
    const params = new URLSearchParams();
    if (width) params.append('width', width);
    if (height) params.append('height', height);
    if (quality) params.append('quality', quality);
    if (format && format !== 'auto') params.append('format', format);
    
    return `${url}?${params.toString()}`;
  }

  // For external URLs, return as-is
  return url;
};

/**
 * Generate responsive srcSet for different screen sizes
 */
export const generateSrcSet = (url, sizes = [320, 640, 768, 1024, 1280]) => {
  if (!url) return '';

  const srcSet = sizes
    .map((size) => {
      const optimizedUrl = getOptimizedImageUrl(url, { width: size });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');

  return srcSet;
};

/**
 * Generate sizes attribute for responsive images
 */
export const generateSizes = (breakpoints = {}) => {
  const defaultBreakpoints = {
    xs: '100vw',
    sm: '100vw',
    md: '50vw',
    lg: '33vw',
    xl: '25vw',
  };

  const merged = { ...defaultBreakpoints, ...breakpoints };
  
  const sizes = Object.entries(merged)
    .map(([breakpoint, size]) => {
      const width = BREAKPOINTS[breakpoint];
      return width ? `(min-width: ${width}px) ${size}` : size;
    })
    .join(', ');

  return sizes;
};

/**
 * Create blur placeholder (LQIP - Low Quality Image Placeholder)
 */
export const createBlurPlaceholder = (url, width = 20, height = 20) => {
  if (!url) return '';
  
  return getOptimizedImageUrl(url, {
    width,
    height,
    quality: 10,
    fit: 'cover',
  });
};

/**
 * Check if browser supports WebP format
 */
export const supportsWebP = () => {
  if (typeof window === 'undefined') return false;

  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

/**
 * Lazy load image with Intersection Observer
 */
export const lazyLoadImage = (imageElement, options = {}) => {
  const {
    rootMargin = '50px',
    threshold = 0.01,
    onLoad,
    onError,
  } = options;

  if (!imageElement) return;

  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback: load image immediately
    loadImage(imageElement, onLoad, onError);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage(entry.target, onLoad, onError);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin,
      threshold,
    }
  );

  observer.observe(imageElement);

  return () => observer.disconnect();
};

/**
 * Load image helper
 */
const loadImage = (imageElement, onLoad, onError) => {
  const src = imageElement.dataset.src;
  const srcset = imageElement.dataset.srcset;

  if (!src) return;

  // Create temporary image to preload
  const tempImage = new Image();

  tempImage.onload = () => {
    imageElement.src = src;
    if (srcset) imageElement.srcset = srcset;
    imageElement.classList.add('loaded');
    imageElement.classList.remove('loading');
    if (onLoad) onLoad(imageElement);
  };

  tempImage.onerror = () => {
    imageElement.classList.add('error');
    imageElement.classList.remove('loading');
    if (onError) onError(imageElement);
  };

  imageElement.classList.add('loading');
  tempImage.src = src;
  if (srcset) tempImage.srcset = srcset;
};

/**
 * Progressive image component data
 */
export const getProgressiveImageData = (url, alt = '') => {
  const placeholder = createBlurPlaceholder(url);
  const srcSet = generateSrcSet(url);
  const sizes = generateSizes();

  return {
    src: url,
    placeholder,
    srcSet,
    sizes,
    alt,
    loading: 'lazy',
  };
};

/**
 * Optimize image compression recommendations
 */
export const getCompressionRecommendations = (fileSize, imageType) => {
  const recommendations = [];

  // File size in MB
  const sizeMB = fileSize / (1024 * 1024);

  if (sizeMB > 2) {
    recommendations.push({
      level: 'critical',
      message: `Image size (${sizeMB.toFixed(2)}MB) is too large. Recommended: < 500KB`,
      action: 'Compress image to reduce file size',
    });
  } else if (sizeMB > 0.5) {
    recommendations.push({
      level: 'warning',
      message: `Image size (${sizeMB.toFixed(2)}MB) could be optimized further`,
      action: 'Consider compressing to < 500KB for faster loading',
    });
  }

  if (imageType === 'image/png' && sizeMB > 0.3) {
    recommendations.push({
      level: 'suggestion',
      message: 'PNG detected - consider converting to WebP or JPEG',
      action: 'WebP format typically provides 25-35% better compression',
    });
  }

  return recommendations;
};

/**
 * Preload critical images
 */
export const preloadImage = (url) => {
  if (!url) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  
  // Add WebP support if available
  if (supportsWebP()) {
    link.type = 'image/webp';
  }

  document.head.appendChild(link);
};

/**
 * Batch preload multiple images
 */
export const preloadImages = (urls = []) => {
  urls.forEach((url) => preloadImage(url));
};

/**
 * Get optimal image format based on browser support
 */
export const getOptimalFormat = () => {
  if (supportsWebP()) return 'webp';
  return 'auto';
};

/**
 * Calculate image dimensions maintaining aspect ratio
 */
export const calculateDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
  const aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
};

export { BREAKPOINTS };
