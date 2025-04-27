import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { PRODUCT_COLORS } from '../constants/colorConstants';

const ColorPalette = ({ onColorSelect, selectedColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredColor, setHoveredColor] = useState(null);
  
  const springProps = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.9)',
    config: { tension: 300, friction: 30 }
  });

  // Find the selected color object
  const getSelectedColorObject = () => {
    if (!selectedColor) return { name: 'Select a color', value: '#FFFFFF' };
    
    // If selectedColor is an object with name and hexCode
    if (typeof selectedColor === 'object' && selectedColor.name) {
      return {
        name: selectedColor.name,
        value: selectedColor.hexCode || selectedColor.value || '#FFFFFF'
      };
    }
    
    // If it's a hex value, try to find the name
    if (typeof selectedColor === 'string' && selectedColor.startsWith('#')) {
      const foundColor = PRODUCT_COLORS.find(c => c.value.toLowerCase() === selectedColor.toLowerCase());
      return foundColor || { name: getColorName(selectedColor), value: selectedColor };
    }
    
    // If it's a name, try to find the hex value
    const foundColor = PRODUCT_COLORS.find(c => c.name.toLowerCase() === selectedColor.toLowerCase());
    return foundColor || { name: selectedColor, value: '#FFFFFF' };
  };

  // Get color name or value depending on what's passed
  const getColorName = (colorInput) => {
    if (!colorInput) return 'Select a color';
    
    // If it's a color object with name and value
    if (typeof colorInput === 'object' && colorInput.name) {
      return colorInput.name;
    }
    
    // If it's a hex value, try to find the name
    if (typeof colorInput === 'string' && colorInput.startsWith('#')) {
      const foundColor = PRODUCT_COLORS.find(c => c.value === colorInput);
      return foundColor ? foundColor.name : colorInput;
    }
    
    // Otherwise just return the input as is
    return colorInput;
  };
  
  const handleColorClick = (color, e) => {
    if (e) e.preventDefault();
    
    // Create a consistent color object structure
    const colorObject = {
      name: color.name,
      hexCode: color.value
    };
    
    // Pass the color object to the parent
    onColorSelect(colorObject);
    setIsOpen(false);
  };

  const handleColorHover = (color) => {
    setHoveredColor(color);
  };

  const handleColorLeave = () => {
    setHoveredColor(null);
  };
  
  // Group colors by category
  const getColorGroups = () => {
    if (!PRODUCT_COLORS || PRODUCT_COLORS.length === 0) return {};
    
    return {
      basicColors: PRODUCT_COLORS.slice(0, 8),
      fashionColors: PRODUCT_COLORS.slice(8, 16),
      metallicColors: PRODUCT_COLORS.slice(16, 20),
      neutralColors: PRODUCT_COLORS.slice(20, 24),
      additionalColors: PRODUCT_COLORS.slice(24)
    };
  };
  
  const colorGroups = getColorGroups();
  const selectedColorObject = getSelectedColorObject();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      >
        <div 
          className="w-6 h-6 rounded-md border border-gray-300" 
          style={{ backgroundColor: selectedColorObject.value || '#ffffff' }}
        />
        <span className="text-sm font-medium">
          {selectedColorObject.name || 'Color Selection'}
        </span>
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
            <h3 className="text-sm font-medium text-gray-700">Color Selection</h3>
            <div className="flex space-x-2 items-center">
              <div 
                className="w-8 h-8 rounded-md border border-gray-300" 
                style={{ 
                  backgroundColor: hoveredColor ? hoveredColor.value : selectedColorObject.value || '#ffffff' 
                }} 
              />
              <span className="text-xs">
                {hoveredColor ? hoveredColor.name : selectedColorObject.name || 'Select a color'}
              </span>
            </div>
          </div>
          
          {/* Basic Colors Section */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Basic Colors</h4>
            <div className="grid grid-cols-4 gap-2">
              {colorGroups.basicColors.map((color, index) => (
                <div
                  key={`basic-${index}`}
                  className="relative"
                  onMouseEnter={() => handleColorHover(color)}
                  onMouseLeave={handleColorLeave}
                >
                  <button
                    type="button"
                    onClick={(e) => handleColorClick(color, e)}
                    className={`flex items-center gap-1 w-full px-2 py-1 border transition-transform hover:bg-gray-50 focus:outline-none rounded-sm text-xs ${
                      selectedColorObject.name === color.name
                        ? 'border-indigo-500 bg-indigo-50 font-medium'
                        : 'border-gray-300'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-sm border border-gray-200" 
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="truncate">{color.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Fashion Colors Section */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Fashion Colors</h4>
            <div className="grid grid-cols-4 gap-2">
              {colorGroups.fashionColors.map((color, index) => (
                <div
                  key={`fashion-${index}`}
                  className="relative"
                  onMouseEnter={() => handleColorHover(color)}
                  onMouseLeave={handleColorLeave}
                >
                  <button
                    type="button"
                    onClick={(e) => handleColorClick(color, e)}
                    className={`flex items-center gap-1 w-full px-2 py-1 border transition-transform hover:bg-gray-50 focus:outline-none rounded-sm text-xs ${
                      selectedColorObject.name === color.name
                        ? 'border-indigo-500 bg-indigo-50 font-medium'
                        : 'border-gray-300'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-sm border border-gray-200" 
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="truncate">{color.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Metallic Colors Section */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Metallic Colors</h4>
            <div className="grid grid-cols-4 gap-2">
              {colorGroups.metallicColors.map((color, index) => (
                <div
                  key={`metallic-${index}`}
                  className="relative"
                  onMouseEnter={() => handleColorHover(color)}
                  onMouseLeave={handleColorLeave}
                >
                  <button
                    type="button"
                    onClick={(e) => handleColorClick(color, e)}
                    className={`flex items-center gap-1 w-full px-2 py-1 border transition-transform hover:bg-gray-50 focus:outline-none rounded-sm text-xs ${
                      selectedColorObject.name === color.name
                        ? 'border-indigo-500 bg-indigo-50 font-medium'
                        : 'border-gray-300'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-sm border border-gray-200" 
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="truncate">{color.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Neutral Colors Section */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Neutral Colors</h4>
            <div className="grid grid-cols-4 gap-2">
              {colorGroups.neutralColors.map((color, index) => (
                <div
                  key={`neutral-${index}`}
                  className="relative"
                  onMouseEnter={() => handleColorHover(color)}
                  onMouseLeave={handleColorLeave}
                >
                  <button
                    type="button"
                    onClick={(e) => handleColorClick(color, e)}
                    className={`flex items-center gap-1 w-full px-2 py-1 border transition-transform hover:bg-gray-50 focus:outline-none rounded-sm text-xs ${
                      selectedColorObject.name === color.name
                        ? 'border-indigo-500 bg-indigo-50 font-medium'
                        : 'border-gray-300'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-sm border border-gray-200" 
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="truncate">{color.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Additional Colors Section */}
          {colorGroups.additionalColors && colorGroups.additionalColors.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Additional Colors</h4>
              <div className="grid grid-cols-4 gap-2">
                {colorGroups.additionalColors.map((color, index) => (
                  <div
                    key={`additional-${index}`}
                    className="relative"
                    onMouseEnter={() => handleColorHover(color)}
                    onMouseLeave={handleColorLeave}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleColorClick(color, e)}
                      className={`flex items-center gap-1 w-full px-2 py-1 border transition-transform hover:bg-gray-50 focus:outline-none rounded-sm text-xs ${
                        selectedColorObject.name === color.name
                          ? 'border-indigo-500 bg-indigo-50 font-medium'
                          : 'border-gray-300'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-sm border border-gray-200" 
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="truncate">{color.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Selected Color Display */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h4 className="text-xs font-medium text-gray-500 mb-2">Selected Color</h4>
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-md border border-gray-300" 
                style={{ backgroundColor: selectedColorObject.value || '#ffffff' }}
              />
              <span className="text-sm font-medium">{selectedColorObject.name || 'Select a color'}</span>
            </div>
          </div>
        </animated.div>
      )}
    </div>
  );
};

ColorPalette.propTypes = {
  onColorSelect: PropTypes.func.isRequired,
  selectedColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      hexCode: PropTypes.string,
      value: PropTypes.string
    })
  ])
};

export default ColorPalette;