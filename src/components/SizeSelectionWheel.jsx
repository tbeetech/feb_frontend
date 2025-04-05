import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SizeGuideModal = ({ isOpen, onClose, sizeType }) => {
  if (!isOpen) return null;
  
  // Different charts based on size type
  const getSizeChart = () => {
    switch(sizeType) {
      case 'footwear':
        return (
          <div className="space-y-4">
            <h3 className="font-bold">Women</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Standard</th>
                    <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Italy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-4 py-2">XXXS</td><td className="px-4 py-2">36</td></tr>
                  <tr><td className="px-4 py-2">XXS</td><td className="px-4 py-2">38</td></tr>
                  <tr><td className="px-4 py-2">XS</td><td className="px-4 py-2">40</td></tr>
                  <tr><td className="px-4 py-2">S</td><td className="px-4 py-2">42</td></tr>
                  <tr><td className="px-4 py-2">M</td><td className="px-4 py-2">44</td></tr>
                  <tr><td className="px-4 py-2">L</td><td className="px-4 py-2">46</td></tr>
                  <tr><td className="px-4 py-2">XL</td><td className="px-4 py-2">48</td></tr>
                  <tr><td className="px-4 py-2">XXL</td><td className="px-4 py-2">50</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <h3 className="font-bold">Women</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Standard</th>
                    <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Italy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-4 py-2">XXXS</td><td className="px-4 py-2">36</td></tr>
                  <tr><td className="px-4 py-2">XXS</td><td className="px-4 py-2">38</td></tr>
                  <tr><td className="px-4 py-2">XS</td><td className="px-4 py-2">40</td></tr>
                  <tr><td className="px-4 py-2">S</td><td className="px-4 py-2">42</td></tr>
                  <tr><td className="px-4 py-2">M</td><td className="px-4 py-2">44</td></tr>
                  <tr><td className="px-4 py-2">L</td><td className="px-4 py-2">46</td></tr>
                  <tr><td className="px-4 py-2">XL</td><td className="px-4 py-2">48</td></tr>
                  <tr><td className="px-4 py-2">XXL</td><td className="px-4 py-2">50</td></tr>
                  <tr><td className="px-4 py-2">XXXL</td><td className="px-4 py-2">52</td></tr>
                  <tr><td className="px-4 py-2">4XL</td><td className="px-4 py-2">54</td></tr>
                  <tr><td className="px-4 py-2">5XL</td><td className="px-4 py-2">56</td></tr>
                  <tr><td className="px-4 py-2">6XL</td><td className="px-4 py-2">58</td></tr>
                  <tr><td className="px-4 py-2">7XL</td><td className="px-4 py-2">60</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 italic mt-4">*Please note that this is a guide only. Measurements may vary according to brand and style.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <motion.div 
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  SIZE GUIDE
                </h3>
                <div className="mt-4">
                  {getSizeChart()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const SizeSelectionWheel = ({ sizes = [], sizeType = 'none', onSizeSelect, outOfStock = [] }) => {
  const [selectedSize, setSelectedSize] = useState(sizes.length > 0 ? sizes[0] : null);
  const [hoverInfo, setHoverInfo] = useState({ visible: false, size: null, position: { x: 0, y: 0 } });
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Set initial selected size when component mounts
  useEffect(() => {
    if (sizes.length > 0) {
      // Find first available size (not out of stock)
      const firstAvailableSize = sizes.find(size => !outOfStock.includes(size));
      setSelectedSize(firstAvailableSize || sizes[0]);
      if (onSizeSelect) {
        onSizeSelect(firstAvailableSize || sizes[0]);
      }
    }
  }, [sizes, outOfStock, onSizeSelect]);

  if (!sizes.length || sizeType === 'none') {
    return null;
  }

  const handleSizeSelect = (size) => {
    // Don't allow selecting out of stock sizes
    if (outOfStock.includes(size)) return;
    
    setSelectedSize(size);
    if (onSizeSelect) {
      onSizeSelect(size);
    }
  };

  const handleMouseEnter = (size, e) => {
    if (outOfStock.includes(size)) {
      setHoverInfo({
        visible: true,
        size,
        position: { x: e.clientX, y: e.clientY }
      });
    }
  };

  const handleMouseLeave = () => {
    setHoverInfo({ ...hoverInfo, visible: false });
  };

  // Get the appropriate label for the size type
  const getSizeTypeLabel = () => {
    switch(sizeType) {
      case 'roman': return 'Size';
      case 'numeric': return 'Size';
      case 'footwear': return 'Shoe Size';
      default: return 'Size';
    }
  };

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="text-sm font-medium text-gray-700">{getSizeTypeLabel()}:</h3>
          <button 
            className="ml-2 text-xs text-black underline font-medium hover:text-gray-700 transition-colors"
            onClick={() => setIsSizeGuideOpen(true)}
          >
            Size Guide
          </button>
        </div>
        <motion.span 
          className="text-xs text-gray-600 font-medium px-3 py-1 bg-gray-50 rounded-full"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          key={selectedSize}
          transition={{ duration: 0.3 }}
        >
          {selectedSize ? `Selected: ${selectedSize}` : 'Select a size'}
        </motion.span>
      </div>

      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center overflow-x-auto py-4 px-2 scrollbar-hide">
          <div className="flex space-x-3">
            {sizes.map((size) => {
              const isOutOfStock = outOfStock.includes(size);
              const isSelected = selectedSize === size;
              
              return (
            <motion.button
              key={size}
                  type="button"
                  whileHover={!isOutOfStock ? { y: -8, scale: 1.08 } : {}}
                  whileTap={!isOutOfStock ? { scale: 0.92 } : {}}
                  initial={false}
                  animate={{
                    scale: isSelected && !isOutOfStock ? 1.05 : 1,
                    y: isSelected && !isOutOfStock ? -5 : 0,
                    boxShadow: isSelected && !isOutOfStock ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 'none'
                  }}
              onClick={() => handleSizeSelect(size)}
                  onMouseEnter={(e) => handleMouseEnter(size, e)}
                  onMouseLeave={handleMouseLeave}
                  className={`relative flex items-center justify-center h-14 min-w-[50px] px-4 rounded-lg border-2 transition-all duration-300
                    ${isSelected && !isOutOfStock
                      ? 'border-black bg-black text-white'
                      : isOutOfStock
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-70'
                        : 'border-gray-300 bg-white text-gray-800 hover:border-gray-800'
              }`}
                  disabled={isOutOfStock}
                >
                  <span className={`text-sm font-medium`}>
              {size}
                  </span>
                  
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className="absolute inset-0 border-t-2 border-gray-300"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.2 }}
                        style={{ 
                          transform: 'rotate(45deg)',
                          transformOrigin: 'center'
                        }}
                      />
                    </div>
                  )}

                  {/* Selected indicator dot */}
                  {isSelected && !isOutOfStock && (
                    <motion.div 
                      className="absolute -bottom-3 w-1.5 h-1.5 rounded-full bg-black"
                      layoutId="selectedDot"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
            </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected size indicator */}
        <motion.div 
          className="mt-6 h-0.5 bg-gradient-to-r from-transparent via-black to-transparent rounded-full mx-auto"
          initial={{ width: 0, opacity: 0 }}
          animate={{ 
            width: selectedSize ? '30%' : 0,
            opacity: selectedSize ? 1 : 0 
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Tooltip for out of stock sizes */}
        <AnimatePresence>
          {hoverInfo.visible && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute z-10 px-3 py-2 bg-black text-white text-xs rounded-lg shadow-xl pointer-events-none"
              style={{
                top: '-40px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Size {hoverInfo.size} is out of stock
      </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper text */}
        <p className="text-xs text-gray-500 mt-4 text-center italic">
          {outOfStock.length > 0 ? "Crossed out sizes are currently unavailable" : "All sizes currently in stock"}
        </p>
      </motion.div>
      
      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <SizeGuideModal 
            isOpen={isSizeGuideOpen} 
            onClose={() => setIsSizeGuideOpen(false)} 
            sizeType={sizeType}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SizeSelectionWheel; 