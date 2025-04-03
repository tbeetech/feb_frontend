import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/features/cart/cartSlice';
import { addToFavorites, removeFromFavorites } from '../redux/features/favorites/favoritesSlice';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { useCurrency } from './CurrencySwitcher';
import LazyImage from './Image';
import { toast } from 'react-hot-toast';

const QuickViewModal = ({ isOpen, product, onClose }) => {
  const dispatch = useDispatch();
  const { formatPrice, currencySymbol } = useCurrency();
  const { favorites } = useSelector(state => state.favorites);
  const { products: cartProducts } = useSelector(state => state.cart);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      // Set default color if available
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].hexCode);
      } else {
        setSelectedColor('');
      }
      
      // Set default size if available
      if (product?.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('');
      }
    }
  }, [product]);

  // Check if product is in favorites
  const isFavorite = (productId) => {
    return favorites.some(fav => fav._id === productId);
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cartProducts.some(item => item._id === productId);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    // Validate size selection if required
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    // Validate color selection if required
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    
    const productToAdd = {
      ...product,
      selectedSize,
      selectedColor,
      quantity: 1
    };
    
    dispatch(addToCart(productToAdd));
    toast.success('Added to cart');
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (productId) => {
    if (isFavorite(productId)) {
      dispatch(removeFromFavorites(productId));
      toast.success('Removed from favorites');
    } else {
      dispatch(addToFavorites(product));
      toast.success('Added to favorites');
    }
  };

  // Handle click on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent rendering if no product
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pt-0">
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <LazyImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product Details */}
              <div className="flex flex-col overflow-y-auto max-h-[60vh] pr-2">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline">
                    <span className="text-xl font-semibold text-primary">
                      {currencySymbol}{formatPrice(product.price)}
                    </span>
                    {product.oldPrice > 0 && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {currencySymbol}{formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <RatingStars rating={product.rating || 0} size="small" />
                  </div>
                </div>
                
                {/* Short Description */}
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {product.description?.substring(0, 150)}
                  {product.description?.length > 150 ? '...' : ''}
                </p>
                
                {/* Size Selection */}
                {product.sizes?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1 border rounded-md text-sm ${
                            selectedSize === size
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Color Selection */}
                {product.colors?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color.hexCode}
                          onClick={() => setSelectedColor(color.hexCode)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            selectedColor === color.hexCode
                              ? 'border-primary'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                          style={{ backgroundColor: color.hexCode }}
                          aria-label={color.name || color.hexCode}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Stock Status */}
                <div className="mb-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.stockStatus === 'In Stock'
                      ? 'bg-green-100 text-green-800'
                      : product.stockStatus === 'Pre Order'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stockStatus}
                  </span>
                  
                  {product.stockStatus === 'In Stock' && product.stockQuantity > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      {product.stockQuantity} left in stock
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-auto">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stockStatus === 'Out of Stock'}
                    className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                      product.stockStatus === 'Out of Stock'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary-dark'
                    } transition-colors`}
                  >
                    <FaShoppingCart />
                    <span>{isInCart(product._id) ? 'Add More' : 'Add to Cart'}</span>
                  </button>
                  
                  <button
                    onClick={() => handleFavoriteToggle(product._id)}
                    className={`p-2 rounded-md border ${
                      isFavorite(product._id)
                        ? 'bg-red-50 text-red-500 border-red-300'
                        : 'bg-white text-gray-500 border-gray-300 hover:text-gray-700'
                    } transition-colors`}
                  >
                    <FaHeart className="w-5 h-5" />
                  </button>
                </div>
                
                {/* View Full Details Link */}
                <Link
                  to={`/product/${product._id}`}
                  className="mt-4 text-center text-primary hover:text-primary-dark text-sm font-medium"
                  onClick={onClose}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
