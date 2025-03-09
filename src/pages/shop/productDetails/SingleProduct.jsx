import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import RatingStars from '../../../components/RatingStars';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { addToCart, decrementQuantity } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';
import SocialContactButtons from '../../../components/SocialContactButtons';
import { motion, AnimatePresence } from 'framer-motion';
import ImagePreviewModal from '../../../components/ImagePreviewModal';

const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { data, error, isLoading } = useFetchProductByIdQuery(id);
    const singleProduct = data?.product || {};
    const productReviews = data?.reviews || [];
    
    // Get cart state to check if product exists
    const cartProducts = useSelector(state => state.cart.products);
    const productInCart = cartProducts.find(product => product._id === id);
    const quantity = productInCart ? productInCart.quantity : 0;

    // Enhanced image states
    const [selectedImage, setSelectedImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    
    // Set initial selected image when product loads
    useEffect(() => {
        if (singleProduct?.image) {
            setSelectedImage(singleProduct.image);
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

    // Handlers
    const handleAddToCart = (product) => {
        if (!productInCart) {
            dispatch(addToCart({ ...product, quantity: 1 }));
        }
    };

    const handleIncrement = (product) => {
        dispatch(addToCart(product));
    };

    const handleDecrement = (product) => {
        dispatch(decrementQuantity(product));
    };
    
    const openPreview = (image) => {
        setSelectedImage(image);
        setPreviewOpen(true);
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

    return (
        <>
            {/* Enhanced breadcrumb with animation */}
            <motion.section 
                className='section__container bg-primary-light pt-28 pb-8'
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
                        
                        <motion.div 
                            className="prose text-gray-600 max-w-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <p>{singleProduct?.description}</p>
                        </motion.div>
                        
                        <motion.div 
                            className="pt-6 border-t border-gray-200"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            {singleProduct.orderType === 'contact-to-order' ? (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Contact us to order this product</h3>
                                    <SocialContactButtons productName={singleProduct.name} />
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
                                                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                +
                                            </motion.button>
                                        </div>
                                    </div>
                                    
                                    <motion.button
                                        onClick={() => handleAddToCart(singleProduct)}
                                        className={`w-full md:w-auto px-8 py-3 rounded-lg text-white font-medium transition-all ${productInCart 
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-primary hover:bg-primary-dark'}`}
                                        disabled={productInCart}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {productInCart ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Added to Cart
                                            </span>
                                        ) : 'Add to Cart'}
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                        
                        {/* Product meta info */}
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