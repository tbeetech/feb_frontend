import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import RatingStars from '../../../components/RatingStars';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProductByIdQuery, useUpdateProductRatingMutation, useFetchAllProductsQuery } from '../../../redux/features/products/productsApi';
import { useGetProductReviewsQuery, useLikeReviewMutation } from '../../../redux/features/reviews/reviewsApi';
import { addToCart, decrementQuantity } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';
import { motion } from 'framer-motion';
import ImagePreviewModal from '../../../components/ImagePreviewModal';
import SizeSelectionWheel from '../../../components/SizeSelectionWheel';
import ColorPalette from '../../../components/ColorPalette';
import { toast } from 'react-hot-toast';
import ImageSlider from '../../../components/ImageSlider';
import ReviewForm from '../reviews/ReviewForm';
import axios from 'axios';
import { useCurrency } from '../../../components/CurrencySwitcher';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import LazyImage from '../../../components/Image';
import { getImageUrl } from '../../../utils/imageUrl';

// Add this recommendation engine
const useRecommendationEngine = (currentProductId, productCategory) => {
    // Recommendation states
    const [recommendations, setRecommendations] = useState([]);
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
    
    // Get data for recommendations
    const { data: allProductsData } = useFetchAllProductsQuery({
        limit: 20,
        category: productCategory || '',
    }, { skip: !productCategory });
    
    useEffect(() => {
        // Start loading
        setIsLoadingRecommendations(true);
        
        // Function to get browsing history from localStorage
        const getBrowsingHistory = () => {
            try {
                const history = localStorage.getItem('browsingHistory');
                return history ? JSON.parse(history) : [];
            } catch (error) {
                console.error('Error parsing browsing history:', error);
                return [];
            }
        };
        
        // Function to update browsing history
        const updateBrowsingHistory = (productId) => {
            try {
                const history = getBrowsingHistory();
                // Add current product to history if not already there
                if (!history.includes(productId)) {
                    // Keep only last 20 items
                    const updatedHistory = [productId, ...history].slice(0, 20);
                    localStorage.setItem('browsingHistory', JSON.stringify(updatedHistory));
                } else {
                    // Move current product to the top
                    const filteredHistory = history.filter(id => id !== productId);
                    const updatedHistory = [productId, ...filteredHistory];
                    localStorage.setItem('browsingHistory', JSON.stringify(updatedHistory));
                }
            } catch (error) {
                console.error('Error updating browsing history:', error);
            }
        };
        
        // Update browsing history with current product
        if (currentProductId) {
            updateBrowsingHistory(currentProductId);
        }
        
        // Generate recommendations if we have products data
        if (allProductsData?.products) {
            const allProducts = allProductsData.products;
            const history = getBrowsingHistory();
            
            // Filter out current product
            const availableProducts = allProducts.filter(product => 
                product._id !== currentProductId
            );
            
            if (availableProducts.length === 0) {
                setRecommendations([]);
                setIsLoadingRecommendations(false);
                return;
            }
            
            // Create personalized recommendations:
            // 1. Products from same category as recently viewed items
            // 2. Products with similar price range
            // 3. Fallback to random products from the same category
            
            // Get the categories of recently viewed products
            const recentlyViewedProducts = availableProducts.filter(
                product => history.includes(product._id)
            );
            
            // Get current product's price for price-based recommendations
            const currentProduct = allProducts.find(p => p._id === currentProductId);
            const currentPrice = currentProduct?.price || 0;
            
            // Price range: 75% to 150% of current product price
            const minPrice = currentPrice * 0.75;
            const maxPrice = currentPrice * 1.5;
            
            // Score products based on multiple factors
            const scoredProducts = availableProducts.map(product => {
                let score = 0;
                
                // Same category as current product
                if (product.category === productCategory) {
                    score += 5;
                }
                
                // Within similar price range
                if (product.price >= minPrice && product.price <= maxPrice) {
                    score += 3;
                }
                
                // Has been viewed recently
                if (history.includes(product._id)) {
                    score += 1;
                }
                
                // Same brand as current product
                if (product.brand === currentProduct?.brand) {
                    score += 3;
                }
                
                // New products get a boost
                if (product.isNew) {
                    score += 2;
                }
                
                return { ...product, score };
            });
            
            // Sort by score and take top 8
            const sortedRecommendations = scoredProducts
                .sort((a, b) => b.score - a.score)
                .slice(0, 8);
            
            setRecommendations(sortedRecommendations);
            setIsLoadingRecommendations(false);
        }
    }, [currentProductId, productCategory, allProductsData]);
    
    return { recommendations, isLoadingRecommendations };
};

const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data, error, isLoading } = useFetchProductByIdQuery(id);
    const singleProduct = data?.product || {};
    console.log('SingleProduct data from API:', data);
    console.log('SingleProduct object:', singleProduct);
    const { formatPrice, currencySymbol } = useCurrency();
    
    // Get reviews using RTK Query
    const { data: reviewsData, isLoading: isLoadingReviews } = useGetProductReviewsQuery(id);
    const [likeReview] = useLikeReviewMutation();
    const [updateProductRating] = useUpdateProductRatingMutation();
    const { user } = useSelector((state) => state.auth);

    // Add ref for product recommendation slider
    const recommendationSliderRef = useRef(null);
    
    // Get similar products (for now just use a subset of the same data since we don't have a dedicated API)
    const { data: allProductsData } = useFetchAllProductsQuery({
        limit: 10,
        category: singleProduct?.category || '',
    }, { skip: !singleProduct?.category });
    
    // Filter out the current product
    const similarProducts = allProductsData?.products.filter(product => 
        product._id !== id
    ) || [];
    
    // Handle sliding through recommendations
    const scrollRecommendations = (direction) => {
        if (recommendationSliderRef.current) {
            const scrollAmount = direction * 300;
            recommendationSliderRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

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
    
    // Calculate which sizes are out of stock
    const outOfStockSizes = isOutOfStock ? 
        (singleProduct?.sizes || []) : 
        (singleProduct?.outOfStock || []);

    // Enhanced image states
    const [selectedImage, setSelectedImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    
    // Size and color selection states
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    
    // Set initial selected image, size, and color when product loads
    useEffect(() => {
        if (singleProduct?.image) {
            console.log("Setting initial image:", singleProduct.image);
            setSelectedImage(singleProduct.image);
        }
        
        // Reset selections when product changes
        if (singleProduct?.sizes?.length > 0) {
            const firstAvailableSize = singleProduct.sizes.find(size => 
                !outOfStockSizes.includes(size)
            );
            setSelectedSize(firstAvailableSize || singleProduct.sizes[0]);
        } else {
            setSelectedSize(null);
        }

        if (singleProduct?.colors?.length > 0) {
            setSelectedColor(singleProduct.colors[0].hexCode);
        } else {
            setSelectedColor(null);
        }
    }, [singleProduct?._id, singleProduct?.image, singleProduct?.sizes, singleProduct?.colors, outOfStockSizes]);

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
        // Toast is now handled by the cart slice
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

    // Handler for size selection - simplified
    const handleSizeSelect = (size) => {
        console.log("Size selected:", size);
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

    const handleReviewSubmitted = async (updatedReviews) => {
        try {
            console.log('Handling review submission with:', updatedReviews);
            
            // Update the product rating in the UI
            if (updatedReviews.length > 0) {
                const totalRating = updatedReviews.reduce((acc, review) => acc + review.rating, 0);
                const averageRating = totalRating / updatedReviews.length;
                
                console.log('Updating product rating to:', averageRating);
                // Update the product rating in the backend
                await updateProductRating({ id, rating: averageRating }).unwrap();
            }
        } catch (error) {
            console.error('Error updating reviews:', error);
            toast.error('Failed to update reviews');
        }
    };

    const handleReviewLike = async (reviewId) => {
        if (!user) {
            toast.error('Please login to like a review');
            return;
        }

        try {
            await likeReview(reviewId).unwrap();
            toast.success('Review liked successfully');
        } catch (error) {
            console.error('Error liking review:', error);
            toast.error('Failed to like review');
        }
    };

    // Use our recommendation engine
    const { recommendations, isLoadingRecommendations } = useRecommendationEngine(
        id, 
        singleProduct?.category
    );

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
                <Link to="/shop" className="mt-4 inline-block px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                    Return to Shop
                </Link>
            </motion.div>
        </div>
    );

    // Gallery setup - clarified variable names and added logging
    const galleryImages = singleProduct.gallery || singleProduct.images || [];
    console.log('Gallery images sources:', galleryImages);
    
    // Include color variant images in gallery if they have imageUrl
    const colorVariantImages = singleProduct.colors?.filter(c => c.imageUrl)?.map(c => c.imageUrl) || [];
    const allImages = [singleProduct.image, ...galleryImages, ...colorVariantImages].filter(Boolean);
    
    // Get delivery information
    const deliveryInfo = getDeliveryInfo();

    // Log gallery data for debugging
    console.log('Product gallery field:', singleProduct.gallery);
    console.log('Product images field:', singleProduct.images); 
    console.log('Main product image:', singleProduct.image);
    console.log('Combined images for display:', allImages);
    console.log('Currently selected image:', selectedImage);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="container mx-auto py-4 mt-12 px-4 lg:px-0"
        >
            {/* Enhanced breadcrumb with animation */}
            <motion.section 
                className='bg-primary-light py-6 lg:py-10'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className='container mx-auto px-4 lg:px-8'>
                    <motion.h1 
                        className='text-3xl md:text-4xl lg:text-5xl font-bold mb-4 uppercase tracking-wide text-white font-royal'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                    >
                    {singleProduct.name}
                    </motion.h1>
                <motion.div
                        className="flex items-center text-sm lg:text-base text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                >
                    <Link to="/" className="hover:text-gray-300 transition-colors duration-300">Home</Link>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <Link to="/shop" className="hover:text-gray-300 transition-colors duration-300">Shop</Link>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-300 font-medium truncate max-w-[200px]">{singleProduct.name}</span>
                </motion.div>
                </div>
            </motion.section>

            <motion.section 
                className="container mx-auto px-4 lg:px-8 py-12 lg:py-16"
                initial="hidden"
                animate="visible"
                variants={stagger}
            >
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Image gallery in left column */}
                    <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow-xl overflow-hidden">
                        {/* Main Product Image */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
                            {selectedImage && (
                                <img
                                    src={getImageUrl(selectedImage)}
                                    alt={singleProduct.name}
                                    className="w-full h-full object-contain"
                                    onClick={() => setPreviewOpen(true)}
                                    onError={(e) => {
                                        console.error("Image failed to load:", selectedImage);
                                        e.target.src = "https://via.placeholder.com/600x600?text=Image+Not+Available";
                                    }}
                                />
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 justify-center">
                            {allImages.map((image, index) => (
                                <div
                                    key={index}
                                    className={`relative aspect-square w-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 ${
                                        selectedImage === image ? 'border-black' : 'border-transparent'
                                    }`}
                                    onClick={() => {
                                        console.log('Thumbnail clicked:', image);
                                        setSelectedImage(image);
                                    }}
                                >
                                    <img
                                        src={getImageUrl(image)}
                                        alt={`${singleProduct.name} - View ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            console.error("Thumbnail failed to load:", image);
                                            e.target.src = "https://via.placeholder.com/100x100?text=Thumbnail";
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    
                    {/* Product details in right column */}
                    <motion.div variants={fadeInUp} className="flex flex-col space-y-8">
                        <div className="border-b border-gray-200 pb-8 space-y-4">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex items-center"
                            >
                                <span className="px-3 py-1 bg-white text-gray-800 rounded-full text-sm font-medium border border-gray-200">
                                {singleProduct?.category}
                                </span>
                                {singleProduct?.stockStatus === 'In Stock' ? (
                                    <span className="ml-4 text-green-600 flex items-center text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        In Stock
                                    </span>
                                ) : isPreOrder ? (
                                    <span className="ml-4 text-blue-600 flex items-center text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        Pre Order
                                    </span>
                                ) : (
                                    <span className="ml-4 text-red-600 flex items-center text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        Out of Stock
                                    </span>
                                )}
                            </motion.div>

                            <motion.h1 
                                className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {singleProduct?.name}
                            </motion.h1>
                            
                            <motion.div 
                                className="flex items-center gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <RatingStars rating={singleProduct?.rating} />
                                <span className="text-gray-500">({reviewsData?.length} {reviewsData?.length === 1 ? 'review' : 'reviews'})</span>
                            </motion.div>
                            
                            <motion.div 
                                className="mt-4 flex items-baseline gap-3"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <span className="text-3xl md:text-4xl font-bold text-primary">{currencySymbol}{formatPrice(singleProduct?.price)}</span>
                                {singleProduct?.oldPrice && (
                                    <span className="text-xl text-gray-400 line-through">
                                        {currencySymbol}{formatPrice(singleProduct?.oldPrice)}
                                    </span>
                                )}
                                {singleProduct?.oldPrice && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                        {Math.round((singleProduct.oldPrice - singleProduct.price) / singleProduct.oldPrice * 100)}% OFF
                                    </span>
                                )}
                            </motion.div>
                        </div>
                        
                        {/* Product description */}
                        <motion.div 
                            className="border-b border-gray-200 pb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Product Description</h3>
                            <div className="prose text-gray-600 max-w-none">
                            <p>{singleProduct?.description}</p>
                            </div>
                            
                            {/* Delivery Information Card */}
                            <div 
                                className="mt-6 p-4 rounded-lg border bg-gray-50 border-gray-200"
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h6a1 1 0 001-1v-6a1 1 0 00-.293-.707L15.293 4.793A1 1 0 0014.586 4H13V3a1 1 0 00-1-1H8a1 1 0 00-1 1v1H3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{deliveryInfo.title}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{deliveryInfo.message}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Size and color selection */}
                            <motion.div
                            className="border-b border-gray-200 pb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                                transition={{ delay: 0.55 }}
                            >
                            {/* Size Selection Wheel */}
                            {singleProduct?.sizeType !== 'none' && singleProduct?.sizes?.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold mb-4 text-gray-800">Select Size</h3>
                                <SizeSelectionWheel 
                                    sizes={singleProduct.sizes} 
                                    sizeType={singleProduct.sizeType}
                                    onSizeSelect={handleSizeSelect}
                                    outOfStock={outOfStockSizes}
                                    selectedSizeFromParent={selectedSize}
                                />
                                </div>
                            )}
                            
                            {/* Color Selection */}
                            {singleProduct.colors?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4 text-gray-800">Select Color</h3>
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
                            </motion.div>
                        
                        {/* Add to cart / Pre-order section */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="pt-4"
                        >
                            {isPreOrder ? (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-800">Pre-order Information</h3>
                                    <p className="text-gray-600">Pre-order products will be delivered within 14 working days.</p>
                                    <motion.button
                                        onClick={() => handlePreOrder(singleProduct)}
                                        className="w-full py-4 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors text-lg font-medium"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                        </svg>
                                        <span className="text-white">Pre Order Now</span>
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <span className="text-gray-700 mr-4 font-medium">Quantity:</span>
                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                            <motion.button
                                                onClick={() => handleDecrement(singleProduct)}
                                                className="px-5 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-lg font-bold"
                                                disabled={quantity === 0}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                -
                                            </motion.button>
                                            <span className="px-6 py-3 font-medium text-lg">{quantity}</span>
                                            <motion.button
                                                onClick={() => handleIncrement(singleProduct)}
                                                className={`px-5 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-lg font-bold ${hasReachedStockLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={hasReachedStockLimit}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                +
                                            </motion.button>
                                        </div>
                                        
                                        {singleProduct?.stockStatus === 'In Stock' && singleProduct?.stockQuantity > 0 && (
                                            <div className="ml-4 text-sm text-gray-500">
                                                <span className={`${singleProduct.stockQuantity < 5 ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
                                                    {singleProduct.stockQuantity} {singleProduct.stockQuantity === 1 ? 'item' : 'items'} left
                                                    {singleProduct.stockQuantity < 5 && ' (Low Stock)'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Always show Add to Cart button */}
                                    <motion.button
                                        onClick={() => handleAddToCart(singleProduct)}
                                        className={`w-full py-4 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors text-lg font-medium ${(isOutOfStock || hasReachedStockLimit) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={isOutOfStock || hasReachedStockLimit}
                                        whileHover={{ scale: isOutOfStock || hasReachedStockLimit ? 1 : 1.02 }}
                                        whileTap={{ scale: isOutOfStock || hasReachedStockLimit ? 1 : 0.98 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" viewBox="0 0 20 20" fill="currentColor" style={{color: 'white !important'}}>
                                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                        </svg>
                                        <span className="text-white" style={{color: 'white !important'}}>{isOutOfStock ? 'Out of Stock' : hasReachedStockLimit ? 'Stock Limit Reached' : (quantity > 0 ? 'Add More to Cart' : 'Add to Cart')}</span>
                                    </motion.button>
                                    
                                    {/* Show confirmation when product is in cart */}
                                    {quantity > 0 && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-center font-medium flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {quantity} {quantity === 1 ? 'item' : 'items'} in your cart
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                        
                        {/* Product specs and details */}
                        <motion.div 
                            className="mt-8 text-sm text-gray-600 grid grid-cols-2 gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <div className="flex items-center">
                                <span className="font-medium text-gray-800 mr-2">SKU:</span>
                                <span>{singleProduct._id?.substring(0, 8)}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-medium text-gray-800 mr-2">Category:</span>
                                <span className="capitalize">{singleProduct?.category}</span>
                            </div>
                            {singleProduct?.subcategory && (
                                <div className="flex items-center">
                                    <span className="font-medium text-gray-800 mr-2">Subcategory:</span>
                                    <span className="capitalize">{singleProduct?.subcategory.replace(/-/g, ' ')}</span>
                                </div>
                            )}
                            {selectedSize && (
                                <div className="flex items-center">
                                    <span className="font-medium text-gray-800 mr-2">Selected Size:</span>
                                    <span>{selectedSize}</span>
                                </div>
                            )}
                            {singleProduct?.tags?.length > 0 && (
                                <div className="col-span-2 flex items-center flex-wrap">
                                    <span className="font-medium text-gray-800 mr-2">Tags:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {singleProduct.tags.map((tag, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
                
                {/* Product reviews section with animation */}
                <motion.div 
                    className="mt-20"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Customer Reviews</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Review Form */}
                        <div className="lg:col-span-1">
                            {user ? (
                                <ReviewForm
                                    productId={id}
                                    onReviewSubmitted={handleReviewSubmitted}
                                />
                            ) : (
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-medium mb-4">Write a Review</h3>
                                    <p className="text-gray-600 mb-4">
                                        Please <Link to="/login" className="text-gold hover:underline">login</Link> to submit a review.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Reviews List */}
                        <div className="lg:col-span-2">
                            <ReviewsCard
                                productReviews={reviewsData || []}
                                onReviewLike={handleReviewLike}
                                isLoading={isLoadingReviews}
                            />
                        </div>
                    </div>
                </motion.div>
            </motion.section>
            
            {/* Product Recommendations */}
            {!isLoading && !error && similarProducts.length > 0 && (
                <motion.section
                    className="py-12 mt-12 border-t border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">You May Also Like</h2>
                    
                    <div className="relative">
                        {/* Left Navigation Button */}
                        <button 
                            onClick={() => scrollRecommendations(-1)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors"
                            aria-label="Scroll left"
                        >
                            <FaChevronLeft className="w-5 h-5" />
                        </button>
                        
                        {/* Scrollable Products Container */}
                        <div 
                            ref={recommendationSliderRef}
                            className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {similarProducts.map((product) => (
                                <div 
                                    key={product._id}
                                    className="flex-shrink-0 w-60 group"
                                >
                                    <Link to={`/product/${product._id}`} className="block">
                                        <div className="relative overflow-hidden rounded-lg bg-gray-100" style={{ aspectRatio: '1/1' }}>
                                            <img 
                                                src={product.image} 
                                                alt={product.name} 
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                                            <p className="mt-1 text-sm text-primary">
                                                {currencySymbol}{formatPrice(product.price)}
                                                {product.oldPrice && (
                                                    <span className="ml-2 line-through text-gray-500">
                                                        {currencySymbol}{formatPrice(product.oldPrice)}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        
                        {/* Right Navigation Button */}
                        <button 
                            onClick={() => scrollRecommendations(1)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors"
                            aria-label="Scroll right"
                        >
                            <FaChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.section>
            )}
            
            {/* Image Preview Modal */}
            <ImagePreviewModal 
                isOpen={previewOpen}
                imageUrl={selectedImage}
                productName={singleProduct.name}
                onClose={() => setPreviewOpen(false)}
            />
        </motion.div>
    )
}

export default SingleProduct