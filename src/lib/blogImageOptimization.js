
/**
 * Blog Image Optimization Utilities
 * Handles responsive images, lazy loading, placeholders, and caching
 */

import { supabase } from '@/lib/customSupabaseClient';

const SUPABASE_STORAGE_URL = import.meta.env.VITE_SUPABASE_URL;
const BLOG_IMAGES_BUCKET = 'blog-images';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=800';

/**
 * Image size breakpoints for responsive loading
 */
const IMAGE_SIZES = {
  mobile: 400,
  tablet: 600,
  desktop: 800,
  hero: 1200,
};

/**
 * Get optimized blog image URL with transformations
 */
export const getOptimizedBlogImageUrl = (url, options = {}) => {
  const {
    width,
    quality = 80,
    format = 'webp',
  } = options;

  if (!url) return DEFAULT_PLACEHOLDER;

  // Check if it's a Supabase storage URL
  const isSupabaseUrl = url.includes(SUPABASE_STORAGE_URL) || url.includes('/storage/v1/object/public/');

  if (isSupabaseUrl) {
    const params = new URLSearchParams();
    if (width) params.append('width', width);
    if (quality) params.append('quality', quality);
    if (format) params.append('format', format);
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  }

  // External URL - return as-is
  return url;
};

/**
 * Generate responsive srcSet for blog images
 */
export const generateBlogImageSrcSet = (url) => {
  if (!url) return '';

  const sizes = [
    IMAGE_SIZES.mobile,
    IMAGE_SIZES.tablet,
    IMAGE_SIZES.desktop,
  ];

  const srcSet = sizes
    .map((size) => {
      const optimizedUrl = getOptimizedBlogImageUrl(url, { width: size });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');

  return srcSet;
};

/**
 * Generate sizes attribute for responsive images
 */
export const generateBlogImageSizes = (isHero = false) => {
  if (isHero) {
    return '100vw';
  }
  
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
};

/**
 * Get blur placeholder for progressive loading
 */
export const getBlogImagePlaceholder = (url) => {
  if (!url) return DEFAULT_PLACEHOLDER;
  
  // Generate tiny blur placeholder (20px width, low quality)
  return getOptimizedBlogImageUrl(url, { width: 20, quality: 10 });
};

/**
 * Validate blog image URL
 */
export const validateBlogImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  // Check if URL is valid
  try {
    new URL(url);
    return true;
  } catch {
    // Try relative URL
    return url.startsWith('/') || url.startsWith('http');
  }
};

/**
 * Get cached image URL from localStorage
 */
export const getCachedImageUrl = (imageId) => {
  try {
    const cached = localStorage.getItem(`blog_image_${imageId}`);
    if (!cached) return null;

    const { url, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    if (isExpired) {
      localStorage.removeItem(`blog_image_${imageId}`);
      return null;
    }

    return url;
  } catch (error) {
    console.warn('Failed to get cached image URL:', error);
    return null;
  }
};

/**
 * Cache image URL in localStorage
 */
export const cacheImageUrl = (imageId, url) => {
  try {
    const cacheData = {
      url,
      timestamp: Date.now(),
    };
    localStorage.setItem(`blog_image_${imageId}`, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to cache image URL:', error);
  }
};

/**
 * Get signed URL for private blog images
 */
export const getSignedBlogImageUrl = async (filePath, expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from(BLOG_IMAGES_BUCKET)
      .createSignedUrl(filePath, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Failed to create signed URL:', error);
    return DEFAULT_PLACEHOLDER;
  }
};

/**
 * Get public URL for blog image
 */
export const getBlogImagePublicUrl = (filePath) => {
  if (!filePath) return DEFAULT_PLACEHOLDER;

  const { data } = supabase.storage
    .from(BLOG_IMAGES_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

/**
 * Preload critical blog images
 */
export const preloadBlogImage = (url) => {
  if (!url || !validateBlogImageUrl(url)) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  link.type = 'image/webp';
  
  document.head.appendChild(link);
};

/**
 * Batch preload multiple blog images
 */
export const preloadBlogImages = (urls = []) => {
  urls.filter(validateBlogImageUrl).forEach((url) => preloadBlogImage(url));
};

/**
 * Get optimized image data for component
 */
export const getOptimizedBlogImageData = (url, alt = '', isHero = false) => {
  const validUrl = validateBlogImageUrl(url) ? url : DEFAULT_PLACEHOLDER;
  
  return {
    src: getOptimizedBlogImageUrl(validUrl, { width: isHero ? IMAGE_SIZES.hero : IMAGE_SIZES.desktop }),
    srcSet: generateBlogImageSrcSet(validUrl),
    sizes: generateBlogImageSizes(isHero),
    placeholder: getBlogImagePlaceholder(validUrl),
    alt,
    loading: 'lazy',
  };
};

/**
 * Extract image URL from blog post data
 */
export const extractBlogImageUrl = (post) => {
  // Priority: featured_image_url > hero_image_url > image_url > default
  return post.featured_image_url || 
         post.hero_image_url || 
         post.image_url || 
         DEFAULT_PLACEHOLDER;
};

export { IMAGE_SIZES, DEFAULT_PLACEHOLDER, BLOG_IMAGES_BUCKET };
