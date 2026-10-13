import React, { useState, useEffect } from 'react';

const ProductSizeInput = ({ sizeType, sizes, onChange }) => {
  // Define the available size options
  const romanSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const numericSizes = Array.from({ length: 20 }, (_, i) => (i + 1).toString());
  const footwearSizes = Array.from({ length: 21 }, (_, i) => (i + 30).toString()); // Sizes 30-50
  
  // State for selected sizes - initialize with passed props
  const [selectedSizes, setSelectedSizes] = useState(sizes || []);
  
  // Update local state when props change, but only if they're different
  useEffect(() => {
    // Only update if the arrays are different
    if (JSON.stringify(sizes) !== JSON.stringify(selectedSizes)) {
      setSelectedSizes(sizes || []);
    }
  }, [sizes]);
  
  // Update parent component when selected sizes change, but only triggered by local changes
  const handleSizeToggle = (size) => {
    const updatedSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    
    setSelectedSizes(updatedSizes);
    
    // Notify parent component
    if (onChange) {
      onChange(updatedSizes);
    }
  };
  
  // Get the appropriate size options based on the type
  let sizeOptions;
  if (sizeType === 'roman') {
    sizeOptions = romanSizes;
  } else if (sizeType === 'footwear') {
    sizeOptions = footwearSizes;
  } else {
    sizeOptions = numericSizes;
  }
  
  if (sizeType === 'none') {
    return (
      <div className="mt-2 text-gray-500 italic">
        No size options available for this product
      </div>
    );
  }
  
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600 mb-2">
        Select available sizes (multiple selection allowed):
      </p>
      <div className="flex flex-wrap gap-2">
        {sizeOptions.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => handleSizeToggle(size)}
            className={`px-3 py-1 rounded-full text-sm border transition-all duration-200 ${
              selectedSizes.includes(size)
                ? 'bg-black text-white border-black font-medium shadow-md'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductSizeInput; 