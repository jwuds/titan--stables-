import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const ImageOptimizer = ({ 
  src, 
  alt, 
  className, 
  wrapperClassName,
  width,
  height,
  priority = false,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inView, setInView] = useState(priority);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Load slightly before coming into view
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Generate a tiny placeholder color or blur based on src (mock implementation)
  const placeholderStyle = {
    backgroundColor: '#f1f5f9', // slate-100 fallback
    backgroundImage: `url(${src}?w=20&q=10&blur=20)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div 
      ref={imgRef}
      className={cn(
        "relative overflow-hidden", 
        !isLoaded && "animate-pulse",
        wrapperClassName
      )}
      style={!isLoaded ? placeholderStyle : undefined}
    >
      {(inView || priority) && (
        <img
          src={src}
          alt={alt || ""}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default React.memo(ImageOptimizer);