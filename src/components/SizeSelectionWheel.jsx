import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SizeSelectionWheel = ({ sizes = [], sizeType = 'none', onSizeSelect }) => {
  const [selectedSize, setSelectedSize] = useState(sizes.length > 0 ? sizes[0] : null);

  if (!sizes.length || sizeType === 'none') {
    return null;
  }

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (onSizeSelect) {
      onSizeSelect(size);
    }
  };

  return (
    <div className="my-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Size:</h3>
      <div className="flex items-center overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex space-x-2">
          {sizes.map((size) => (
            <motion.button
              key={size}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSizeSelect(size)}
              className={`flex items-center justify-center h-10 min-w-[40px] px-3 rounded-full border-2 transition-all ${
                selectedSize === size
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {size}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SizeSelectionWheel; 