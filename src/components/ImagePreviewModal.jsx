import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../utils/imageUrl';

/**
 * ImagePreviewModal Component
 * Displays a fullscreen preview of a product image with animation
 */
const ImagePreviewModal = ({ isOpen, imageUrl, onClose, productName }) => {
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
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-4xl max-h-[90vh] w-[90%] overflow-hidden rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 md:top-4 md:right-4 z-10 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-black/70 text-white rounded-full hover:bg-primary transition-colors"
              aria-label="Close preview"
            >
              <span className="text-xl md:text-2xl">&times;</span>
            </button>
            
            <img 
              key={`modal-image-${imageUrl}`}
              src={getImageUrl(imageUrl)}
              alt={productName || "Product image"} 
              className="w-full h-full object-contain bg-white"
              onError={(e) => {
                console.error("Preview image failed to load:", imageUrl);
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/800x800?text=Image+Not+Available";
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImagePreviewModal;
