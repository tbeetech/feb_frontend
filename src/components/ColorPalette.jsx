import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

const ColorPalette = ({ colors, onColorSelect, selectedColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredColor, setHoveredColor] = useState(null);
  
  const springProps = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.9)',
    config: { tension: 300, friction: 30 }
  });

  const handleColorClick = (color) => {
    onColorSelect(color);
  };

  const handleColorHover = (color) => {
    setHoveredColor(color);
  };

  const handleColorLeave = () => {
    setHoveredColor(null);
  };
  
  // Function to group colors by category based on their position in the array
  const getColorGroups = () => {
    if (!colors || colors.length === 0) return {};
    
    // Assuming colors are provided in groups as per colorConstants.js
    return {
      basicColors: colors.slice(0, 8),
      fashionColors: colors.slice(8, 16),
      metallicColors: colors.slice(16, 20),
      neutralColors: colors.slice(20)
    };
  };
  
  const colorGroups = getColorGroups();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      >
        <div 
          className="w-6 h-6 rounded-md border border-gray-300" 
          style={{ backgroundColor: selectedColor || '#ffffff' }}
        />
        <span className="text-sm font-medium">{isOpen ? 'Close Palette' : 'Color Palette'}</span>
      </button>
      
      {isOpen && (
        <animated.div
          style={{
            ...springProps,
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '0',
            width: '320px',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            zIndex: 50,
          }}
          className="color-palette"
        >
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h3 className="text-sm font-medium text-gray-700">Color Palette</h3>
            <div className="flex space-x-2 items-center">
              <div className="w-8 h-8 rounded-md border border-gray-300" style={{ backgroundColor: hoveredColor || selectedColor || '#ffffff' }} />
              <span className="text-xs">{hoveredColor || selectedColor || '#FFFFFF'}</span>
            </div>
          </div>
          
          {/* Basic Colors Section */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Basic Colors</h4>
            <div className="grid grid-cols-8 gap-1">
              {colorGroups.basicColors.map((color, index) => (
                <div
                  key={`basic-${index}`}
                  className="relative"
                  onMouseEnter={() => handleColorHover(color)}
                  onMouseLeave={handleColorLeave}
                >
                  <button
                    onClick={() => handleColorClick(color)}
                    className={`w-8 h-8 border transition-transform hover:scale-110 focus:outline-none ${
                      selectedColor === color
                        ? 'border-indigo-500 ring-2 ring-indigo-500'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Fashion Colors Section */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Fashion Colors</h4>
            <div className="grid grid-cols-8 gap-1">
              {colorGroups.fashionColors.map((color, index) => (
                <div
                  key={`fashion-${index}`}
                  className="relative"
                  onMouseEnter={() => handleColorHover(color)}
                  onMouseLeave={handleColorLeave}
                >
                  <button
                    onClick={() => handleColorClick(color)}
                    className={`w-8 h-8 border transition-transform hover:scale-110 focus:outline-none ${
                      selectedColor === color
                        ? 'border-indigo-500 ring-2 ring-indigo-500'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Metallic Colors Section */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Metallic Colors</h4>
            <div className="grid grid-cols-8 gap-1">
              {colorGroups.metallicColors.map((color, index) => (
                <div
                  key={`metallic-${index}`}
                  className="relative"
                  onMouseEnter={() => handleColorHover(color)}
                  onMouseLeave={handleColorLeave}
                >
                  <button
                    onClick={() => handleColorClick(color)}
                    className={`w-8 h-8 border transition-transform hover:scale-110 focus:outline-none ${
                      selectedColor === color
                        ? 'border-indigo-500 ring-2 ring-indigo-500'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Neutral Colors Section */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Neutral Colors</h4>
            <div className="grid grid-cols-8 gap-1">
              {colorGroups.neutralColors.map((color, index) => (
                <div
                  key={`neutral-${index}`}
                  className="relative"
                  onMouseEnter={() => handleColorHover(color)}
                  onMouseLeave={handleColorLeave}
                >
                  <button
                    onClick={() => handleColorClick(color)}
                    className={`w-8 h-8 border transition-transform hover:scale-110 focus:outline-none ${
                      selectedColor === color
                        ? 'border-indigo-500 ring-2 ring-indigo-500'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Selected Colors Display */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h4 className="text-xs font-medium text-gray-500 mb-2">Selected Color</h4>
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-md border border-gray-300" 
                style={{ backgroundColor: selectedColor || '#ffffff' }}
              />
              <span className="text-sm">{selectedColor || '#FFFFFF'}</span>
            </div>
          </div>
        </animated.div>
      )}
    </div>
  );
};

export default ColorPalette; 