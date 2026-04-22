import { useState, useEffect } from 'react';
import { preloadImages } from '@/lib/imageOptimization';

export function useImagePreloader(imageUrls) {
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!imageUrls || imageUrls.length === 0) {
      setImagesPreloaded(true);
      return;
    }

    preloadImages(imageUrls)
      .then(() => {
        if (isMounted) setImagesPreloaded(true);
      })
      .catch((err) => {
        console.error("Failed to preload images", err);
        if (isMounted) setImagesPreloaded(true); // Still set true to not block UI forever
      });

    return () => {
      isMounted = false;
    };
  }, [imageUrls]);

  return { imagesPreloaded };
}