export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const getOptimizedImageUrl = (url, width, format = 'webp', quality = 80) => {
  if (!url || url.startsWith('data:')) return url;
  return url; 
};

export const getImageSrcSet = (url) => {
  if (!url || url.startsWith('data:')) return undefined;
  return [
    `${getOptimizedImageUrl(url, BREAKPOINTS.sm)} ${BREAKPOINTS.sm}w`,
    `${getOptimizedImageUrl(url, BREAKPOINTS.md)} ${BREAKPOINTS.md}w`,
    `${getOptimizedImageUrl(url, BREAKPOINTS.lg)} ${BREAKPOINTS.lg}w`,
    `${getOptimizedImageUrl(url, BREAKPOINTS.xl)} ${BREAKPOINTS.xl}w`,
  ].join(', ');
};

export const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = reject;
    img.src = url;
  });
};

export const preloadImages = (urls) => {
  return Promise.all(urls.map(url => preloadImage(url)));
};

export const getImageDimensions = (aspectRatio = '16/9', width = 1000) => {
  const [w, h] = aspectRatio.split('/').map(Number);
  const height = Math.round((width / w) * h);
  return { width, height };
};