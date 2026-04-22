
import React, { useState } from 'react';

const ImageOptimizer = ({ src, alt, className = '' }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-xl"></div>
      )}
      
      <img
        src={error ? 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&h=800&fit=crop' : src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        srcSet={error ? undefined : `
          ${src}?w=400 400w,
          ${src}?w=800 800w,
          ${src}?w=1200 1200w,
          ${src}?w=1600 1600w
        `}
        sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
      />
    </div>
  );
};

export default ImageOptimizer;
