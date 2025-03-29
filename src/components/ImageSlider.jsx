import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

const ImageSlider = ({ images, productName, onPreviewClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const autoPlayRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sliderRef = useRef(null);
  
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    if (isAutoPlay) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 3000);
    } else {
      clearInterval(autoPlayRef.current);
    }
    
    return () => {
      clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlay, currentIndex, images]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleThumbnailClick = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) { // threshold for swipe
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };
  
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsZoomed(true);
    }
  };
  
  const handleMouseLeave = () => {
    setIsZoomed(false);
  };
  
  const handleMouseMove = (e) => {
    if (!sliderRef.current) return;
    
    const { left, top, width, height } = sliderRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setMousePosition({ x, y });
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const thumbnailVariants = {
    inactive: { 
      opacity: 0.6,
      border: '2px solid transparent',
      scale: 0.95,
    },
    active: { 
      opacity: 1,
      border: '2px solid #3B82F6',
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      opacity: 0.9,
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  };

  // If there are no images, display a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col md:flex-row gap-3 md:gap-6 h-full">
        {/* Vertical thumbnails for desktop */}
        {!isMobile && images.length > 1 && (
          <div className="hidden md:flex flex-col gap-3 w-24">
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="w-full h-24 rounded-lg overflow-hidden cursor-pointer bg-white border border-gray-200"
                variants={thumbnailVariants}
                animate={index === currentIndex ? 'active' : 'inactive'}
                whileHover="hover"
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={image}
                  alt={`${productName} - view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Main image slider */}
        <div 
          className="relative w-full rounded-lg overflow-hidden bg-white"
          style={{ aspectRatio: '4/3' }}
          ref={sliderRef}
        >
          {/* Touch events for mobile swipe */}
          <div
            className="w-full h-full"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full"
                onClick={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                {isZoomed ? (
                  <div 
                    className="w-full h-full overflow-hidden cursor-zoom-in"
                    onClick={() => onPreviewClick && onPreviewClick(images[currentIndex])}
                  >
                    <img
                      src={images[currentIndex]}
                      alt={`${productName} - view ${currentIndex + 1}`}
                      className="w-full h-full object-cover transform scale-150 transition-transform duration-300"
                      style={{ 
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                        objectPosition: `${mousePosition.x}% ${mousePosition.y}%`
                      }}
                    />
                  </div>
                ) : (
                  <img
                    src={images[currentIndex]}
                    alt={`${productName} - view ${currentIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300 cursor-zoom-in"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevSlide}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <motion.button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextSlide}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </>
          )}

          {/* Autoplay control */}
          {images.length > 1 && (
            <motion.button
              className={`absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full ${isAutoPlay ? 'bg-primary text-white' : 'bg-white text-gray-800'} flex items-center justify-center shadow-md`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleAutoPlay}
            >
              {isAutoPlay ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </motion.button>
          )}

          {/* Image count indicator */}
          <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium z-10">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Mobile thumbnails - horizontal scroll */}
      {isMobile && images.length > 1 && (
        <div className="mt-4 flex space-x-2 overflow-x-auto hide-scrollbar">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className={`flex-none w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${index === currentIndex ? 'border-primary' : 'border-transparent'}`}
              variants={thumbnailVariants}
              animate={index === currentIndex ? 'active' : 'inactive'}
              whileHover="hover"
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={image}
                alt={`${productName} - view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Preview instruction */}
      <div className="mt-3 text-center text-sm text-gray-500">
        Click image to zoom or view full size
      </div>
    </div>
  );
};

export default ImageSlider; 