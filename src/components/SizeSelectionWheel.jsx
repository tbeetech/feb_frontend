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

const SizeSelectionWheel = ({ sizes = [], sizeType = 'none', onSizeSelect, outOfStock = [], selectedSizeFromParent }) => {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [localSelectedSize, setLocalSelectedSize] = useState(selectedSizeFromParent || '');
  
  // Update local state when parent prop changes
  useEffect(() => {
    if (selectedSizeFromParent) {
      setLocalSelectedSize(selectedSizeFromParent);
    } else if (sizes.length > 0) {
      // If no size selected yet, find first available size
      const firstAvailableSize = sizes.find(size => !outOfStock.includes(size));
      if (firstAvailableSize && onSizeSelect) {
        onSizeSelect(firstAvailableSize);
      }
    }
  }, [selectedSizeFromParent, sizes, outOfStock, onSizeSelect]);
  
  // Determine the size label based on size type
  const getSizeTypeLabel = () => {
    switch(sizeType) {
      case 'roman': return 'Size';
      case 'numeric': return 'Size';
      case 'footwear': return 'Shoe Size';
      default: return 'Size';
    }
  };
  
  // Don't render if no sizes or size type is none
  if (!sizes.length || sizeType === 'none') {
    return null;
  }
  
  // Handler for size selection from dropdown
  const handleSizeChange = (e) => {
    const size = e.target.value;
    console.log("Size selected in dropdown:", size);
    setLocalSelectedSize(size);
    if (size && onSizeSelect) {
      onSizeSelect(size);
    }
  };
  
  // Filter out sizes that are in stock
  const availableSizes = sizes.filter(size => !outOfStock.includes(size));
  
  return (
    <div className="my-4">
      {/* Header with size type label and guide button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <label htmlFor="size-select" className="block text-sm font-medium text-gray-700">
            {getSizeTypeLabel()}:
          </label>
          <button 
            className="ml-3 text-xs text-black underline font-medium hover:text-gray-700 transition-colors"
            onClick={() => setIsSizeGuideOpen(true)}
          >
            Size Guide
          </button>
        </div>
        {localSelectedSize && (
          <div className="text-sm bg-gray-100 px-2 py-1 rounded-full">
            <span className="font-medium">Selected: {localSelectedSize}</span>
          </div>
        )}
      </div>
      
      {/* Simple dropdown selector */}
      <div className="relative">
        <select
          id="size-select"
          name="size"
          value={localSelectedSize}
          onChange={handleSizeChange}
          className="block w-full mt-1 pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm rounded-md appearance-none"
        >
          <option value="" disabled>Select a size</option>
          {sizes.map(size => (
            <option 
              key={size}
              value={size}
              disabled={outOfStock.includes(size)}
            >
              {size}{outOfStock.includes(size) ? ' (Out of Stock)' : ''}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
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

export default SizeSelectionWheel; 