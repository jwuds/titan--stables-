/**
 * Font optimization utilities
 */

export const fontDisplaySwap = `
  @font-face {
    font-display: swap;
  }
`;

/**
 * Injects preconnect links for font providers
 */
export const injectFontPreconnect = () => {
  const links = [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  ];

  links.forEach(attr => {
    if (!document.querySelector(`link[href="${attr.href}"]`)) {
      const link = document.createElement('link');
      Object.keys(attr).forEach(key => link.setAttribute(key, attr[key]));
      document.head.appendChild(link);
    }
  });
};

/**
 * Check if a font is loaded
 */
export const isFontLoaded = async (fontFamily) => {
  if ('fonts' in document) {
    try {
      await document.fonts.load(`1em ${fontFamily}`);
      return true;
    } catch (e) {
      console.warn('Font loading check failed', e);
      return false;
    }
  }
  return false;
};