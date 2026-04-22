import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to inject or update the canonical tag in the document head.
 * @param {string} [customUrl] - Optional custom full URL. If not provided, it builds from current path.
 */
export const useCanonical = (customUrl) => {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = 'https://titanstables.org';
    const canonicalUrl = customUrl || `${baseUrl}${location.pathname === '/' ? '' : location.pathname}`;

    // Find existing canonical tag
    let link = document.querySelector("link[rel='canonical']");

    if (link) {
      link.setAttribute('href', canonicalUrl);
    } else {
      // Create new canonical tag
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonicalUrl);
      document.head.appendChild(link);
    }

    // Cleanup not strictly necessary as we want it to persist until next route,
    // but good practice if component unmounts and isn't replaced by another page.
    return () => {
      // We don't remove it on unmount so the last valid page keeps its tag,
      // the next page will update it.
    };
  }, [location.pathname, customUrl]);
};

export default useCanonical;