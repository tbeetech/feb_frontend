import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import RatingStars from '../../../components/RatingStars';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { addToCart, decrementQuantity } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';
import { motion } from 'framer-motion';
import ImagePreviewModal from '../../../components/ImagePreviewModal';
import SizeSelectionWheel from '../../../components/SizeSelectionWheel';
import ColorPalette from '../../../components/ColorPalette';
import { toast } from 'react-hot-toast';

const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data, error, isLoading } = useFetchProductByIdQuery(id);
    const singleProduct = data?.product || {};
    const productReviews = data?.reviews || [];
    
    // Get cart state to check if product exists
    const cartProducts = useSelector(state => state.cart.products);
    const productInCart = cartProducts.find(product => product._id === id);
    const quantity = productInCart ? productInCart.quantity : 0;

    // Check if the product is in stock and if there's inventory available for more purchases
    const isOutOfStock = singleProduct?.stockStatus === 'Out of Stock';
    const isPreOrder = singleProduct?.stockStatus === 'Pre Order';
    const hasReachedStockLimit = singleProduct?.stockStatus === 'In Stock' && 
        singleProduct?.stockQuantity > 0 && 
        quantity >= singleProduct.stockQuantity;

    // Enhanced image states
    const [selectedImage, setSelectedImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    
    // Size and color selection states
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    
    // Set initial selected image, size, and color when product loads
    useEffect(() => {
        if (singleProduct?.image) {
            setSelectedImage(singleProduct.image);
        }
        
        // Set the first available size as default if sizes exist
        if (singleProduct?.sizes?.length > 0) {
            setSelectedSize(singleProduct.sizes[0]);
        } else {
            setSelectedSize(null);
        }

        // Set the first available color as default if colors exist
        if (singleProduct?.colors?.length > 0) {
            setSelectedColor(singleProduct.colors[0].hexCode);
        } else {
            setSelectedColor(null);
        }
    }, [singleProduct]);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
        }
    };
    
    const stagger = {
        visible: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    
    // Helper function to format delivery info
    const getDeliveryInfo = () => {
        if (isPreOrder) {
            return {
                icon: "timer",
                title: "Pre-order Item",
                message: "This item will be delivered within 14 working days from your order date.",
                color: "blue"
            };
        } else if (singleProduct?.stockStatus === 'In Stock') {
            return {
                icon: "local_shipping",
                title: "Fast Delivery",
                message: "This item will be delivered within 74 hours (3 days) from your order date.",
                color: "green"
            };
        } else {
            // For Out of Stock or custom delivery times
            const startDate = singleProduct?.deliveryTimeFrame?.startDate ? new Date(singleProduct.deliveryTimeFrame.startDate) : null;
            const endDate = singleProduct?.deliveryTimeFrame?.endDate ? new Date(singleProduct.deliveryTimeFrame.endDate) : null;
            
            if (startDate && endDate) {
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                return {
                    icon: "date_range",
                    title: "Custom Delivery",
                    message: `This item is expected to be available between ${startDate.toLocaleDateString(undefined, options)} and ${endDate.toLocaleDateString(undefined, options)}.`,
                    color: "gray"
                };
            }
            
            return {
                icon: "info",
                title: "Delivery Information",
                message: "Please contact us for delivery information about this item.",
                color: "gray"
            };
        }
    };

    // Handlers
    const handleAddToCart = (product) => {
        if (!selectedSize && product.sizes?.length > 0) {
            toast.error('Please select a size');
            return;
        }

        if (!selectedColor && product.colors?.length > 0) {
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
        toast.success('Product added to cart');
    };

    const handlePreOrder = (product) => {
        const productWithSize = {
            ...product,
            selectedSize: selectedSize,
            quantity: 1
        };
        dispatch(addToCart(productWithSize));
        navigate('/billing-details', { 
            state: { 
                cartItems: [productWithSize],
                total: product.price,
                isPreOrder: true 
            } 
        });
    };

    const handleIncrement = (product) => {
        // Only allow increment if we haven't reached stock limit
        if (!hasReachedStockLimit) {
            const productWithSize = {
                ...product,
                selectedSize: selectedSize
            };
            dispatch(addToCart(productWithSize));
        }
    };

    const handleDecrement = (product) => {
        dispatch(decrementQuantity(product));
    };
    
    const openPreview = (image) => {
        setSelectedImage(image);
        setPreviewOpen(true);
    };

    // Handler for size selection
    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        // Update the selected image if there's a color-specific image
        const colorVariant = singleProduct.colors?.find(c => c.hexCode === color);
        if (colorVariant?.imageUrl) {
            setSelectedImage(colorVariant.imageUrl);
        }
    };

    // Loading state
    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div 
                className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-red-50 text-red-500 rounded-lg shadow-lg"
            >
                <h2 className="text-2xl font-bold mb-4">Error loading product</h2>
                <p>{error.message || "Please try again later"}</p>
                <Link to="/shop" className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg">
                    Return to Shop
                </Link>
            </motion.div>
        </div>
    );

    // Gallery setup
    const gallery = singleProduct.gallery || [];
    const allImages = [singleProduct.image, ...gallery].filter(Boolean);
    
    // Get delivery information
    const deliveryInfo = getDeliveryInfo();

    return (
        <>
            {/* Enhanced breadcrumb with animation */}
            <motion.section 
                className='section__container bg-primary-light pb-8'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h2 
                    className='section__header capitalize'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {singleProduct.name}
                </motion.h2>
                <motion.div
                    className="flex items-center text-sm text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-primary font-medium truncate max-w-[200px]">{singleProduct.name}</span>
                </motion.div>
            </motion.section>

            <motion.section 
                className="section__container my-12"
                initial="hidden"
                animate="visible"
                variants={stagger}
            >
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Enhanced product gallery with animations */}
                    <motion.div variants={fadeInUp} className="space-y-6">
                        <motion.div 
                            className="overflow-hidden rounded-xl shadow-lg relative group"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.img
                                src={selectedImage || singleProduct.image}
                                alt={singleProduct.name}
                                className="w-full h-auto object-cover rounded-xl"
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            />
                            <motion.div 
                                className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                whileHover={{ opacity: 1 }}
                            >
                                <button 
                                    onClick={() => openPreview(selectedImage || singleProduct.image)}
                                    className="bg-white/90 text-gray-800 rounded-full p-3 transform hover:scale-110 transition-transform"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </motion.div>
                        </motion.div>
                        
                        {/* Image Gallery Thumbnails */}
                        {allImages.length > 1 && (
                            <motion.div 
                                className="flex flex-wrap gap-2"
                                variants={fadeInUp}
                            >
                                {allImages.map((img, idx) => (
                                    <motion.div
                                        key={idx}
                                        className={`w-20 h-20 border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${selectedImage === img ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200'}`}
                                        whileHover={{ y: -5, scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                        
                        {/* Delivery Information Card */}
                        <motion.div 
                            className={`mt-6 p-4 rounded-lg border bg-${deliveryInfo.color}-50 border-${deliveryInfo.color}-200`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-start space-x-3">
                                <span className={`material-icons text-${deliveryInfo.color}-500 text-xl`}>
                                    {deliveryInfo.icon}
                                </span>
                                <div>
                                    <h3 className={`font-medium text-${deliveryInfo.color}-700`}>{deliveryInfo.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{deliveryInfo.message}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                    
                    {/* Enhanced product details with animations */}
                    <motion.div variants={fadeInUp} className="space-y-6">
                        <motion.div className="space-y-3">
                            <motion.span 
                                className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {singleProduct?.category}
                            </motion.span>
                            <motion.h1 
                                className="text-3xl md:text-4xl font-bold text-gray-800"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {singleProduct?.name}
                            </motion.h1>
                            <motion.div 
                                className="flex items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <RatingStars rating={singleProduct?.rating} />
                                <span className="text-gray-500">({productReviews.length} reviews)</span>
                            </motion.div>
                        </motion.div>
                        
                        <motion.div 
                            className="text-2xl font-bold"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="text-primary">₦{singleProduct?.price?.toLocaleString()}</span>
                            {singleProduct?.oldPrice && (
                                <span className="ml-3 text-lg text-gray-400 line-through">
                                    ₦{singleProduct?.oldPrice?.toLocaleString()}
                                </span>
                            )}
                            {singleProduct?.oldPrice && (
                                <span className="ml-3 text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                                    {Math.round((singleProduct.oldPrice - singleProduct.price) / singleProduct.oldPrice * 100)}% OFF
                                </span>
                            )}
                        </motion.div>
                        
                        {/* Stock Information */}
                        <motion.div 
                            className="py-3 border-t border-b border-gray-200 my-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.45 }}
                        >
                            <div className="flex items-center mb-2">
                                <span className="font-medium mr-2">Availability:</span>
                                {singleProduct?.stockStatus === 'In Stock' ? (
                                    <span className="text-green-600 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        In Stock
                                    </span>
                                ) : isPreOrder ? (
                                    <span className="text-blue-600 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        Pre Order
                                    </span>
                                ) : (
                                    <span className="text-red-600 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            {singleProduct?.stockStatus === 'In Stock' && singleProduct?.stockQuantity > 0 && (
                                <div className="flex items-center">
                                    <span className="font-medium mr-2">Quantity Left:</span>
                                    <span className={`${singleProduct.stockQuantity < 5 ? 'text-orange-600' : 'text-gray-700'}`}>
                                        {singleProduct.stockQuantity} {singleProduct.stockQuantity === 1 ? 'item' : 'items'}
                                        {singleProduct.stockQuantity < 5 && ' (Low Stock)'}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                        
                        <motion.div 
                            className="prose text-gray-600 max-w-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <p>{singleProduct?.description}</p>
                        </motion.div>
                        
                        {/* Size Selection Wheel */}
                        {singleProduct?.sizeType !== 'none' && singleProduct?.sizes?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55 }}
                            >
                                <SizeSelectionWheel 
                                    sizes={singleProduct.sizes} 
                                    sizeType={singleProduct.sizeType}
                                    onSizeSelect={handleSizeSelect}
                                />
                            </motion.div>
                        )}
                        
                        {/* Add Color Selection */}
                        {singleProduct.colors?.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">Select Color</h3>
                                <div className="flex flex-col space-y-4">
                                    <ColorPalette
                                        colors={singleProduct.colors.map(c => c.hexCode)}
                                        onColorSelect={handleColorSelect}
                                        selectedColor={selectedColor}
                                    />
                                    {selectedColor && (
                                        <div className="mt-2 flex items-center">
                                            <span className="text-sm font-medium mr-2">Selected:</span>
                                            <div
                                                className="w-6 h-6 rounded-md border border-gray-300"
                                                style={{ backgroundColor: selectedColor }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        <motion.div 
                            className="pt-6 border-t border-gray-200"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            {isPreOrder ? (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">This is a pre-order product</h3>
                                    <p className="text-gray-600">Pre-order products will be delivered within 14 working days.</p>
                                    <motion.button
                                        onClick={() => handlePreOrder(singleProduct)}
                                        className="w-full py-3 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                        </svg>
                                        Pre Order Now
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <span className="text-gray-700 mr-4">Quantity:</span>
                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                            <motion.button
                                                onClick={() => handleDecrement(singleProduct)}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                                disabled={quantity === 0}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                -
                                            </motion.button>
                                            <span className="px-4 py-2 font-medium">{quantity}</span>
                                            <motion.button
                                                onClick={() => handleIncrement(singleProduct)}
                                                className={`px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors ${hasReachedStockLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={hasReachedStockLimit}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                +
                                            </motion.button>
                                        </div>
                                    </div>
                                    
                                    {quantity === 0 ? (
                                        <motion.button
                                            onClick={() => handleAddToCart(singleProduct)}
                                            className={`w-full py-3 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors ${(isOutOfStock || hasReachedStockLimit) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={isOutOfStock || hasReachedStockLimit}
                                            whileHover={{ scale: isOutOfStock || hasReachedStockLimit ? 1 : 1.02 }}
                                            whileTap={{ scale: isOutOfStock || hasReachedStockLimit ? 1 : 0.98 }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                            </svg>
                                            {isOutOfStock ? 'Out of Stock' : hasReachedStockLimit ? 'Stock Limit Reached' : 'Add to Cart'}
                                        </motion.button>
                                    ) : (
                                        <div className="text-green-600 py-2 text-center">
                                            ✓ Product added to cart
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                        
                        <motion.div 
                            className="pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <p><span className="font-medium">SKU:</span> {singleProduct._id?.substring(0, 8)}</p>
                            <p><span className="font-medium">Category:</span> {singleProduct?.category}</p>
                            {singleProduct?.subcategory && (
                                <p><span className="font-medium">Subcategory:</span> {singleProduct?.subcategory}</p>
                            )}
                            {selectedSize && (
                                <p><span className="font-medium">Selected Size:</span> {selectedSize}</p>
                            )}
                            <p><span className="font-medium">Tags:</span> {singleProduct?.tags?.join(', ') || 'None'}</p>
                        </motion.div>
                    </motion.div>
                </div>
                
                {/* Product reviews section with animation */}
                <motion.div 
                    className="mt-16"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
                    <ReviewsCard productReviews={productReviews} />
                </motion.div>
            </motion.section>
            
            {/* Image Preview Modal */}
            <ImagePreviewModal 
                isOpen={previewOpen}
                imageUrl={selectedImage}
                productName={singleProduct.name}
                onClose={() => setPreviewOpen(false)}
            />
        </>
    )
}

export default SingleProduct