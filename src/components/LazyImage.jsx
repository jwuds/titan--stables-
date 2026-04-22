import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { getImageSrcSet } from '@/lib/imageOptimization';

const LazyImage = ({ src, alt, className, wrapperClassName, priority = false, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inView, setInView] = useState(priority);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => setIsLoaded(true);

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden bg-slate-100', wrapperClassName)}>
      {inView && (
        <img
          src={src}
          srcSet={getImageSrcSet(src)}
          alt={alt || ''}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-700 ease-in-out',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          onLoad={handleLoad}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          {...props}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 animate-pulse">
           <span className="sr-only">Loading image...</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;