import { useDispatch, useSelector } from "react-redux";
import { addToCart, decrementQuantity, removeFromCart, clearCart } from "../../redux/features/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { CiTrash, CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa";
import { getImageUrl } from "../../utils/imageUrl";
import { useCurrency } from "../../components/CurrencySwitcher";
import { toast } from 'react-hot-toast';

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, deliveryFee, grandTotal } = useSelector((state) => state.cart);
    const { formatPrice, currencySymbol } = useCurrency();

    const handleIncrement = (product) => {
        if (product.stockQuantity && product.quantity >= product.stockQuantity) {
            toast.error(`Sorry, only ${product.stockQuantity} items available`);
            return;
        }
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
        toast.success('Item removed from cart');
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            dispatch(clearCart());
            toast.success('Cart cleared successfully');
        }
    };

    const handleCheckoutClick = () => {
        if (products.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        navigate('/billing-details', {
            replace: true, // Use replace to avoid back button issues
            state: {
                cartItems: products,
                total: grandTotal
            }
        });
    };

    const subtotal = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = products.reduce((sum, item) => sum + item.quantity, 0);
    // Use delivery fee from Redux state for consistency
    const total = grandTotal;

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-6">Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>
                <Link to="/shop" className="inline-flex items-center text-gray-600 hover:text-black">
                    <FaArrowLeft className="mr-2" />
                    Continue Shopping
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-gray-50 p-8 rounded-lg max-w-md mx-auto">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Looks like you haven&apos;t added any products to your cart yet.</p>
                        <Link to="/shop" className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 inline-block">
                            <span className="text-white" style={{color: 'white !important'}}>Browse Products</span>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="hidden md:grid grid-cols-6 gap-4 mb-4 text-sm font-medium text-gray-500">
                                    <div className="col-span-3">Product</div>
                                    <div className="text-center">Price</div>
                                    <div className="text-center">Quantity</div>
                                    <div className="text-right">Total</div>
                                </div>

                                <div className="space-y-6">
                                    {products.map((product) => (
                                        <div key={product._id} className="grid grid-cols-1 md:grid-cols-6 gap-4 py-4 border-b border-gray-100">
                                            {/* Product Info */}
                                            <div className="col-span-3 flex">
                                                <img 
                                                    src={getImageUrl(product.image)} 
                                                    alt={product.name}
                                                    className="w-20 h-20 object-cover rounded-md flex-shrink-0" 
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                                                    }}
                                                />
                                                <div className="ml-4">
                                                    <h3 className="font-medium">{product.name}</h3>
                                                    {product.selectedSize && (
                                                        <p className="text-sm text-gray-500">Size: {product.selectedSize}</p>
                                                    )}
                                                    {product.selectedColor && (
                                                        <div className="flex items-center mt-1 text-sm text-gray-500">
                                                            <span>Color:</span>
                                                            <div 
                                                                className="w-4 h-4 rounded-full ml-1 border border-gray-300" 
                                                                style={{ backgroundColor: product.selectedColor }}
                                                            ></div>
                                                        </div>
                                                    )}
                                                    <button 
                                                        onClick={() => handleRemove(product)}
                                                        className="text-red-500 text-sm flex items-center mt-2 hover:text-red-600"
                                                    >
                                                        <CiTrash className="mr-1" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Price */}
                                            <div className="md:text-center">
                                                <span className="md:hidden text-gray-500 mr-2">Price:</span>
                                                {currencySymbol}{formatPrice(product.price)}
                                            </div>
                                            
                                            {/* Quantity */}
                                            <div className="flex items-center md:justify-center">
                                                <span className="md:hidden text-gray-500 mr-2">Quantity:</span>
                                                <div className="flex items-center border border-gray-200 rounded-md">
                                                    <button
                                                        onClick={() => handleDecrement(product)}
                                                        className="p-2 text-gray-500 hover:text-black"
                                                        disabled={product.quantity <= 1}
                                                    >
                                                        <CiCircleMinus className="w-5 h-5" />
                                                    </button>
                                                    <span className="px-2">{product.quantity}</span>
                                                    <button
                                                        onClick={() => handleIncrement(product)}
                                                        className="p-2 text-gray-500 hover:text-black"
                                                    >
                                                        <CiCirclePlus className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Total */}
                                            <div className="md:text-right">
                                                <span className="md:hidden text-gray-500 mr-2">Total:</span>
                                                <span className="font-medium">{currencySymbol}{formatPrice(product.price * product.quantity)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={handleClearCart}
                                        className="text-gray-500 hover:text-red-500 flex items-center"
                                    >
                                        <CiTrash className="mr-1 w-5 h-5" /> Clear Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                                    <span>{currencySymbol}{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span>{currencySymbol}{formatPrice(deliveryFee)}</span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>{currencySymbol}{formatPrice(total)}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 text-right">
                                        Including VAT
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckoutClick}
                                className="w-full block text-center py-3 px-4 bg-black text-white font-medium hover:bg-gray-800 rounded-md transition-colors"
                                disabled={products.length === 0}
                            >
                                <span className="text-white" style={{color: 'white !important'}}>
                                    {products.length === 0 ? 'Your Cart is Empty' : 'Proceed to Checkout'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;