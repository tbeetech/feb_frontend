import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Size Guide Modal Component
 * Shows a modal with size chart information
 */
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

/**
 * SizeSelectionWheel Component
 * Allows users to select a size from available options
 */
const SizeSelectionWheel = ({ sizes = [], sizeType = 'none', onSizeSelect, outOfStock = [], selectedSizeFromParent }) => {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [localSelectedSize, setLocalSelectedSize] = useState('');
  
  // Use a ref to track if this is the initial render
  const initialRenderRef = useRef(true);
  
  // Effect to handle synchronization with parent component
  useEffect(() => {
    // If parent provides a size, use that (this takes precedence)
    if (selectedSizeFromParent) {
      console.log("Parent provided size:", selectedSizeFromParent);
      setLocalSelectedSize(selectedSizeFromParent);
      return;
    }
    
    // If we have sizes but no selection, find the first available size
    if (sizes.length > 0 && !localSelectedSize && initialRenderRef.current) {
      const firstAvailableSize = sizes.find(size => !outOfStock.includes(size)) || sizes[0];
      
      console.log("Setting initial size:", firstAvailableSize);
      setLocalSelectedSize(firstAvailableSize);
      
      // Only notify parent if we're initializing the selection
      if (onSizeSelect) {
        onSizeSelect(firstAvailableSize);
      }
      
      // Mark that we've handled the initial render
      initialRenderRef.current = false;
    }
  }, [sizes, selectedSizeFromParent, outOfStock, onSizeSelect, localSelectedSize]);
  
  // Reset initial render flag when product/sizes change
  useEffect(() => {
    // Reset the ref when sizes change to handle product changes
    if (sizes.length > 0) {
      initialRenderRef.current = true;
    }
  }, [sizes]);
  
  // Don't render if no sizes or size type is none
  if (!sizes.length || sizeType === 'none') {
    return null;
  }
  
  // Determine size label based on type
  const getSizeTypeLabel = () => {
    switch(sizeType) {
      case 'roman': return 'Size';
      case 'numeric': return 'Size';
      case 'footwear': return 'Shoe Size';
      default: return 'Size';
    }
  };
  
  // Handler for size selection
  const handleSizeSelect = (size) => {
    console.log("Size button clicked:", size);
    
    // Don't update if it's the same size (prevents unnecessary renders)
    if (size === localSelectedSize) {
        console.log("Size already selected, skipping update");
        return;
    }
    
    // Update local state first
    setLocalSelectedSize(size);
    
    // Notify parent component immediately with delay to ensure visibility
    if (onSizeSelect) {
        console.log("Notifying parent of size selection:", size);
        // Small timeout to ensure the local state updates first
        // This helps with visual feedback and prevents race conditions
        setTimeout(() => {
            onSizeSelect(size);
            console.log("Parent notification complete for size:", size);
        }, 50);
    }
  };
  
  // Get available sizes (not out of stock)
  const availableSizes = sizes.filter(size => !outOfStock.includes(size));
  
  return (
    <div className="my-4">
      {/* Header with size type label and guide button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-700">
            {getSizeTypeLabel()}:
          </label>
          <button 
            className="ml-3 text-xs text-black underline font-medium hover:text-gray-700 transition-colors"
            onClick={() => setIsSizeGuideOpen(true)}
          >
            Size Guide
          </button>
        </div>
      </div>
      
      {/* Size selection as buttons */}
      <div className="flex flex-wrap gap-2 mt-3">
        {sizes.map(size => {
          const isDisabled = outOfStock.includes(size);
          const isSelected = localSelectedSize === size;
          
          return (
            <button
              key={`size-btn-${size}`}
              type="button"
              disabled={isDisabled}
              onClick={() => handleSizeSelect(size)}
              className={`
                min-w-[3rem] h-10 px-3 rounded-md text-sm font-medium
                ${isDisabled ? 
                  'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                  isSelected ? 
                    'bg-black text-white ring-2 ring-black' : 
                    'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }
                transition-all focus:outline-none
              `}
              aria-pressed={isSelected}
            >
              {size}
              {isDisabled && <span className="sr-only"> (Out of Stock)</span>}
            </button>
          );
        })}
      </div>
      
      {/* Selected size indicator - only show when we have a valid selection */}
      {localSelectedSize && (
        <div className="mt-3 text-sm text-gray-800">
          <span>Selected size: <strong>{localSelectedSize}</strong></span>
        </div>
      )}
      
      {/* Availability status */}
      <p className="text-xs text-gray-500 mt-2">
        {availableSizes.length === 0 ? 
          "All sizes are currently out of stock" : 
          `${availableSizes.length} size${availableSizes.length !== 1 ? 's' : ''} available`
        }
      </p>
      
      {/* Size guide modal */}
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

// PropTypes validation
SizeGuideModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    sizeType: PropTypes.string
};

SizeSelectionWheel.propTypes = {
    sizes: PropTypes.array,
    sizeType: PropTypes.string,
    onSizeSelect: PropTypes.func,
    outOfStock: PropTypes.array,
    selectedSizeFromParent: PropTypes.string
};

export default SizeSelectionWheel; 