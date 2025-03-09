import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImagePreviewModal = ({ isOpen, imageUrl, onClose, productName }) => {
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
            >
              <span className="text-xl md:text-2xl">&times;</span>
            </button>
            
            <img 
              src={imageUrl} 
              alt={productName || "Product image"} 
              className="w-full h-full object-contain bg-white"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/600x600?text=Image+Not+Available";
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImagePreviewModal;
