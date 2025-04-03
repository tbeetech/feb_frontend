import React, { useState, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = '',
  aspectRatio = '1/1',
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Create placeholder blur version of the image
  const placeholderSrc = src?.replace(/\.\w+$/, (match) => `-placeholder${match}`) || '';
  
  // Handle successful image load
  const handleImageLoaded = () => {
    setIsLoaded(true);
  };
  
  // Handle image error
  const handleImageError = (e) => {
    setError(true);
    if (onError) {
      onError(e);
    } else {
      e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
    }
  };
  
  // Use IntersectionObserver for loading
  useEffect(() => {
    if (!src) return;
    
    // Reset states when src changes
    setIsLoaded(false);
    setError(false);
    
    const imgElement = document.createElement('img');
    
    // Create a new observer for this image
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // When the image is visible, start loading
        if (entry.isIntersecting) {
          imgElement.src = src;
          imgElement.onload = handleImageLoaded;
          imgElement.onerror = handleImageError;
          
          // Disconnect after starting to load
          observer.disconnect();
        }
      });
    }, {
      rootMargin: '100px', // Start loading 100px before it comes into view
      threshold: 0.01,     // Trigger when 1% is visible
    });
    
    // Start observing
    observer.observe(document.getElementById(`lazy-image-${src}`));
    
    return () => {
      observer.disconnect();
    };
  }, [src]);
  
  return (
    <div 
      id={`lazy-image-${src}`}
      className={`relative overflow-hidden ${className}`} 
      style={{ aspectRatio }}
      {...props}
    >
      {/* Placeholder or low-res blurred image */}
      {!isLoaded && !error && (
        <div className={`absolute inset-0 w-full h-full bg-gray-200 animate-pulse ${placeholderClassName}`} />
      )}
      
      {/* Main image with fade-in effect */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={handleImageLoaded}
        onError={handleImageError}
      />
    </div>
  );
};

export default LazyImage; 