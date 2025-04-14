import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { decrementQuantity, removeFromCart } from '../redux/features/cart/cartSlice';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { useCurrency } from './CurrencySwitcher';
import { toast } from 'react-hot-toast';
import { addToCart } from '../redux/features/cart/cartSlice';
import LazyImage from './Image';
import { PRODUCT_COLORS } from '../constants/colorConstants';

const MiniCart = () => {
  const [showMiniCart, setShowMiniCart] = useState(false);
  const { products } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formatPrice, currencySymbol } = useCurrency();
  const miniCartRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const lastAddedRef = useRef(null);
  const [lastAddedProduct, setLastAddedProduct] = useState(null);
  const [prevProductsLength, setPrevProductsLength] = useState(0);

  // Calculate total price
  const subtotal = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  // Fixed delivery fee
  const deliveryFee = 8800;
  
  // Calculate total with delivery fee
  const totalPrice = subtotal + deliveryFee;

  // Count total items
  const itemCount = products.reduce((total, item) => total + item.quantity, 0);

  // Helper function to convert hex color to color name
  const getColorName = (colorInput) => {
    if (!colorInput) return '';
    
    // If it's already a name (not starting with #), return it
    if (!colorInput.startsWith('#')) return colorInput;
    
    // Find the color in the PRODUCT_COLORS constant
    const foundColor = PRODUCT_COLORS.find(c => c.value.toLowerCase() === colorInput.toLowerCase());
    
    // Return the standard color name or a simple default
    if (foundColor) {
      return foundColor.name;
    } else {
      // Simple logic to match basic colors when exact match not found
      if (colorInput.toLowerCase() === '#ff0000') return 'Red';
      if (colorInput.toLowerCase() === '#00ff00') return 'Green';
      if (colorInput.toLowerCase() === '#0000ff') return 'Blue';
      if (colorInput.toLowerCase() === '#ffff00') return 'Yellow';
      if (colorInput.toLowerCase() === '#000000') return 'Black';
      if (colorInput.toLowerCase() === '#ffffff') return 'White';
      
      // Default to a generic name
      return 'Custom Color';
    }
  };

  // Handle cart item operations
  const handleRemoveItem = (product) => {
    // Debug the product being removed
    console.log('Attempting to remove item from cart:', {
      id: product._id,
      name: product.name,
      size: product.selectedSize,
      color: product.selectedColor,
      fullProduct: product
    });
    
    // Verify all required fields are present
    if (!product || !product._id) {
      console.error("Cannot remove product - invalid product data:", product);
      toast.error('Could not remove item from cart - invalid product data');
      return;
    }
    
    // Log the current cart state before removal
    console.log('Current cart before removal:', products);
    
    try {
      // Dispatch the action to remove this specific product
      dispatch(removeFromCart(product));
      
      // Verify removal by checking the updated products from useSelector in the next cycle
      setTimeout(() => {
        // Get current products from Redux
        const currentProducts = products;
        const stillExists = currentProducts.some(
          item => item._id === product._id && 
                 item.selectedSize === product.selectedSize && 
                 item.selectedColor === product.selectedColor
        );
        
        if (stillExists) {
          console.warn('Product may not have been removed from cart:', product);
          // Try removing again with a direct dispatch that includes exact matching parameters
          dispatch(removeFromCart({
            _id: product._id,
            selectedSize: product.selectedSize,
            selectedColor: product.selectedColor
          }));
        } else {
          console.log('Product successfully removed from cart');
        }
      }, 100);
      
      toast.success('Item removed from cart');
    } catch (error) {
      console.error("Error removing product from cart:", error);
      toast.error('Failed to remove item from cart');
    }
  };

  const handleIncrementItem = (product) => {
    dispatch(addToCart(product));
    toast.success('Product quantity increased');
  };

  const handleDecrementItem = (product) => {
    dispatch(decrementQuantity(product));
    if (product.quantity === 1) {
      toast.success('Product removed from cart');
    } else {
      toast.success('Product quantity decreased');
    }
  };

  // Handle click outside to close mini cart
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (miniCartRef.current && !miniCartRef.current.contains(event.target)) {
        setShowMiniCart(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if a new product was added to cart
  useEffect(() => {
    if (products.length > prevProductsLength) {
      // New product added
      const newProduct = products[0]; // Assuming newest product is at the beginning
      setLastAddedProduct(newProduct);
      
      // Show notification for a few seconds
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    setPrevProductsLength(products.length);
  }, [products, prevProductsLength]);

  // Variants for animations
  const miniCartVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      transition: { duration: 0.2 } 
    }
  };

  const notificationVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    },
    exit: { 
      opacity: 0, 
      x: 50,
      transition: { duration: 0.3 } 
    }
  };

  return (
    <div className="relative" ref={miniCartRef}>
      {/* Cart Icon with Counter */}
      <div 
        className="relative cursor-pointer p-2"
        onMouseEnter={() => itemCount > 0 && setShowMiniCart(true)}
        onClick={() => navigate('/cart')}
      >
        <FaShoppingCart className="text-xl" />
        {itemCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
            {itemCount}
          </div>
        )}
      </div>

      {/* MiniCart Dropdown */}
      <AnimatePresence>
        {showMiniCart && (
          <motion.div
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
            variants={miniCartVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h3>
              <button 
                onClick={() => setShowMiniCart(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            {products.length === 0 ? (
              <div className="p-6 text-center">
                <div className="mb-4 text-gray-400">
                  <FaShoppingCart className="mx-auto text-4xl" />
                </div>
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Link 
                  to="/shop" 
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm inline-block"
                  onClick={() => setShowMiniCart(false)}
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="max-h-80 overflow-y-auto p-3">
                  {products.map((product, index) => (
                    <div 
                      key={`${product._id}-${product.selectedSize || ''}-${product.selectedColor || ''}`}
                      className="flex items-center gap-3 mb-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <LazyImage
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/product/${product._id}`}
                          className="text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-1"
                          onClick={() => setShowMiniCart(false)}
                        >
                          {product.name}
                        </Link>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-primary font-medium">
                            {currencySymbol}{formatPrice(product.price)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleDecrementItem(product)}
                              className="text-xs text-gray-500 hover:text-primary"
                            >
                              <FaMinus />
                            </button>
                            <span className="text-sm mx-1">{product.quantity}</span>
                            <button 
                              onClick={() => handleIncrementItem(product)}
                              className="text-xs text-gray-500 hover:text-primary"
                            >
                              <FaPlus />
                            </button>
                            <button 
                              onClick={() => handleRemoveItem(product)}
                              className="text-xs text-gray-500 hover:text-red-500 ml-2"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        {product.selectedSize && (
                          <div className="text-xs text-gray-500 mt-1">
                            Size: {product.selectedSize}
                          </div>
                        )}
                        {product.selectedColor && (
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 mr-1">Color:</span>
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full border border-gray-300 mr-1" 
                                style={{ backgroundColor: product.selectedColor }}
                              ></div>
                              <span className="text-xs text-gray-500">
                                {getColorName(product.selectedColor)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-semibold text-primary">
                      {currencySymbol}{formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Delivery Fee:</span>
                    <span className="font-semibold text-primary">
                      ₦8,800
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total:</span>
                    <span className="font-semibold text-primary">
                      {currencySymbol}{formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      to="/cart" 
                      className="py-2 bg-gray-100 text-gray-800 rounded-lg text-center text-sm font-medium hover:bg-gray-200 transition-colors"
                      onClick={() => setShowMiniCart(false)}
                    >
                      View Cart
                    </Link>
                    <Link 
                      to="/checkout" 
                      className="py-2 bg-primary text-white rounded-lg text-center text-sm font-medium hover:bg-primary-dark transition-colors"
                      onClick={() => setShowMiniCart(false)}
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Added to Cart Notification */}
      <AnimatePresence>
        {isVisible && lastAddedProduct && (
          <motion.div
            className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg z-50 p-4 max-w-xs w-full"
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            ref={lastAddedRef}
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <LazyImage
                  src={lastAddedProduct.image}
                  alt={lastAddedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{lastAddedProduct.name}</h4>
                  <button 
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
                <p className="text-green-600 text-xs mt-1">Added to your cart</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium">
                    {currencySymbol}{formatPrice(lastAddedProduct.price)}
                  </span>
                  <Link 
                    to="/cart"
                    className="text-xs text-primary hover:underline"
                    onClick={() => setIsVisible(false)}
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MiniCart; 