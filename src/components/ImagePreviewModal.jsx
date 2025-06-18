import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../utils/imageUrl';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * ImagePreviewModal Component
 * Displays a fullscreen preview of a product image with animation
 */
const ImagePreviewModal = ({ isOpen, imageUrl, onClose, productName, images = [] }) => {
  const [scale, setScale] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(
    images.indexOf(imageUrl) !== -1 ? images.indexOf(imageUrl) : 0
  );

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleClose = () => {
    setScale(1);
    onClose();
  };

  const handleZoom = () => {
    setScale(scale === 1 ? 2 : 1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === images.length - 1 ? 0 : prev + 1
      );
      setScale(1);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? images.length - 1 : prev - 1
      );
      setScale(1);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={handleClose}
        >
          <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
            <button
              onClick={handleZoom}
              className="text-white hover:text-gray-300 transition-colors p-2"
              title={scale === 1 ? 'Zoom in' : 'Zoom out'}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {scale === 1 ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" 
                  />
                )}
              </svg>
            </button>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-300 transition-colors p-2"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2"
              >
                <FaChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2"
              >
                <FaChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-4xl max-h-[90vh] w-[90%] overflow-hidden rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={images.length > 0 ? images[currentImageIndex] : imageUrl}
              alt={productName}
              className="max-h-[80vh] w-auto mx-auto object-contain cursor-zoom-in"
              style={{ 
                transform: `scale(${scale})`,
                transition: 'transform 0.3s ease-in-out'
              }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x600?text=Image+Not+Available";
              }}
            />
            
            {productName && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 text-white">
                <h3 className="text-xl font-medium">
                  {productName}
                </h3>
              </div>
            )}
          </motion.div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                    setScale(1);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentImageIndex === index 
                      ? 'bg-white' 
                      : 'bg-gray-500 hover:bg-gray-300'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImagePreviewModal;
