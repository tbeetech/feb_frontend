import { useDispatch, useSelector } from "react-redux";
import { addToCart, decrementQuantity, removeFromCart, clearCart } from "../../redux/features/cart/cartSlice";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { CiTrash, CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { getImageUrl } from "../../utils/imageUrl";
import { useCurrency } from "../../components/CurrencySwitcher";
import PropTypes from 'prop-types';

const CartModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const { products, deliveryFee, grandTotal, total } = useSelector((state) => state.cart);
    const { formatPrice, currencySymbol, currencyCode } = useCurrency();
    
    const itemCount = products.reduce((sum, item) => sum + item.quantity, 0);

    const handleIncrement = (product) => {
        dispatch(addToCart(product));
    };

    const handleDecrement = (product) => {
        dispatch(decrementQuantity(product));
    };

    const handleRemove = (product) => {
        dispatch(removeFromCart({ 
            _id: product._id,
            selectedSize: product.selectedSize,
            selectedColor: product.selectedColor
        }));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex justify-end"
            onClick={onClose}
        >
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "tween", duration: 0.3 }}
                className="w-full max-w-md h-full bg-white shadow-lg overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium">SHOPPING BAG ({itemCount})</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-black"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {products.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="text-gray-500 mb-6">Your shopping bag is empty</p>
                        <button 
                            onClick={onClose} 
                            className="px-6 py-2 bg-black text-white hover:bg-gray-800 font-medium"
                        >
                            <span className="text-white" style={{color: 'white !important'}}>Continue Shopping</span>
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-5 space-y-5">
                            {products.map((product) => (
                                <div key={product._id} className="flex border-b border-gray-100 pb-5">
                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        className="w-20 h-20 object-cover flex-shrink-0"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                                        }}
                                    />
                                    <div className="ml-4 flex-1">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="text-sm font-medium">{product.brand || 'Brand'}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{product.name}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(product)}
                                                className="text-gray-400 hover:text-black"
                                                aria-label="Remove item"
                                            >
                                                <CiTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                        
                                        {/* Size & Color */}
                                        <div className="mt-2 flex text-xs text-gray-500 space-x-4">
                                            {product.selectedSize && (
                                                <div className="flex items-center">
                                                    <span>Size: {product.selectedSize}</span>
                                                </div>
                                            )}
                                            {product.selectedColor && (
                                                <div className="flex items-center">
                                                    <span>Color:</span>
                                                    <div 
                                                        className="w-3 h-3 rounded-full ml-1 border border-gray-300" 
                                                        style={{ backgroundColor: product.selectedColor }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Price & Quantity */}
                                        <div className="mt-3 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => handleDecrement(product)}
                                                    className="text-gray-500 hover:text-black"
                                                    disabled={product.quantity <= 1}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <CiCircleMinus className="w-6 h-6" />
                                                </button>
                                                <span className="mx-2 text-sm">{product.quantity}</span>
                                                <button
                                                    onClick={() => handleIncrement(product)}
                                                    className="text-gray-500 hover:text-black"
                                                    aria-label="Increase quantity"
                                                >
                                                    <CiCirclePlus className="w-6 h-6" />
                                                </button>
                                            </div>
                                            <div className="text-sm font-medium">
                                                {currencySymbol}{formatPrice(product.price * product.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="p-5 border-t border-gray-200">
                            <div className="mb-6">
                                <div className="flex justify-between py-2">
                                    <span className="text-sm text-gray-600">Subtotal</span>
                                    <span className="text-sm font-medium">{currencySymbol}{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-sm text-gray-600">Delivery</span>
                                    <span className="text-sm font-medium">{currencySymbol}{formatPrice(deliveryFee)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                                    <span className="text-base font-medium">Total</span>
                                    <span className="text-base font-medium">{currencyCode} {currencySymbol}{formatPrice(grandTotal)}</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <Link
                                    to="/billing-details"
                                    onClick={() => {
                                        onClose();
                                    }}
                                    state={{ 
                                        cartItems: products,
                                        total: grandTotal
                                    }}
                                    className="w-full block text-center py-3 px-4 bg-black text-white font-medium hover:bg-gray-900"
                                >
                                    <span className="text-white" style={{color: 'white !important'}}>Go To Checkout</span>
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="w-full block text-center py-3 px-4 text-black border border-gray-300 font-medium hover:bg-gray-50"
                                >
                                    Continue Shopping
                                </button>
                                <button
                                    onClick={handleClearCart}
                                    className="w-full text-center py-3 block text-gray-500 hover:text-black text-sm"
                                >
                                    Clear Shopping Bag
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

CartModal.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default CartModal;