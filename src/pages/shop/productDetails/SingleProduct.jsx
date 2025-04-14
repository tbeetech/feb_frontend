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
import { toast } from 'react-hot-toast';
import ReviewForm from '../reviews/ReviewForm';
import { useCurrency } from '../../../components/CurrencySwitcher';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getImageUrl } from '../../../utils/imageUrl';
import { PRODUCT_COLORS } from '../../../constants/colorConstants';

/**
 * Custom hook for product recommendations
 */
const useRecommendationEngine = (currentProductId, productCategory) => {
    // State
    const [recommendations, setRecommendations] = useState([]);
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
    
    // Fetch data
    const { data: allProductsData } = useFetchAllProductsQuery({
        limit: 20,
        category: productCategory || '',
    }, { skip: !productCategory });
    
    // Effect for processing recommendations
    useEffect(() => {
        if (!currentProductId || !allProductsData?.products) {
            return;
        }
        
        setIsLoadingRecommendations(true);
        
        try {
            // Get browsing history
            const history = (() => {
                try {
                    const stored = localStorage.getItem('browsingHistory');
                    return stored ? JSON.parse(stored) : [];
                } catch (e) {
                    console.error('Error reading browsing history:', e);
                return [];
            }
            })();
            
            // Update browsing history
            const updatedHistory = [
                currentProductId,
                ...history.filter(id => id !== currentProductId)
            ].slice(0, 20);
            
                    localStorage.setItem('browsingHistory', JSON.stringify(updatedHistory));
            
            // Filter and score products
            const availableProducts = allProductsData.products.filter(
                product => product._id !== currentProductId
            );
            
            if (availableProducts.length === 0) {
                setRecommendations([]);
                setIsLoadingRecommendations(false);
                return;
            }
            
            // Get current product details for comparison
            const currentProduct = allProductsData.products.find(
                p => p._id === currentProductId
            );
            
            if (!currentProduct) {
                setRecommendations(availableProducts.slice(0, 8));
                setIsLoadingRecommendations(false);
                return;
            }
            
            // Price range for recommendations
            const minPrice = currentProduct.price * 0.75;
            const maxPrice = currentProduct.price * 1.5;
            
            // Score and sort products
            const scoredProducts = availableProducts.map(product => {
                let score = 0;
                
                // Scoring criteria
                if (product.category === productCategory) score += 5;
                if (product.price >= minPrice && product.price <= maxPrice) score += 3;
                if (history.includes(product._id)) score += 1;
                if (product.brand === currentProduct.brand) score += 3;
                if (product.isNew) score += 2;
                
                return { ...product, score };
            });
            
            const sortedRecommendations = scoredProducts
                .sort((a, b) => b.score - a.score)
                .slice(0, 8);
            
            setRecommendations(sortedRecommendations);
        } catch (e) {
            console.error('Error generating recommendations:', e);
            // Fallback to empty recommendations
            setRecommendations([]);
        } finally {
            setIsLoadingRecommendations(false);
        }
    }, [currentProductId, productCategory, allProductsData]);
    
    return { recommendations, isLoadingRecommendations };
};

const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { formatPrice, currencySymbol } = useCurrency();
    
    // Get delivery fee from Redux store for consistent calculations
    const { deliveryFee } = useSelector(state => state.cart);
    
    // Fetch product data
    const { data, error, isLoading } = useFetchProductByIdQuery(id);
    const singleProduct = data?.product || {};
    
    // Log product data for debugging
    console.log('SingleProduct data from API:', data);
    console.log('SingleProduct object:', singleProduct);

    // Initialize image and gallery variables
    // Move this BEFORE any useEffect hooks that reference it
    const galleryImages = singleProduct?.gallery || singleProduct?.images || [];
    const colorVariantImages = singleProduct?.colors?.filter(c => c.imageUrl)?.map(c => c.imageUrl) || [];
    const allImages = [singleProduct?.image, ...galleryImages, ...colorVariantImages].filter(Boolean);
    
    // Get reviews using RTK Query
    const { data: reviewsData, isLoading: isLoadingReviews } = useGetProductReviewsQuery(id);
    const [likeReview] = useLikeReviewMutation();
    const [updateProductRating] = useUpdateProductRatingMutation();
    const { user } = useSelector((state) => state.auth);

    // Add ref for product recommendation slider
    const recommendationSliderRef = useRef(null);
    
    // Get similar products
    const { data: allProductsData } = useFetchAllProductsQuery({
        limit: 10,
        category: singleProduct?.category || '',
    }, { skip: !singleProduct?.category });
    
    // Filter out the current product
    const similarProducts = allProductsData?.products?.filter(product => 
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
    
    // Image slider state
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Update selectedImage when currentImageIndex changes OR when allImages changes
    useEffect(() => {
        console.log("Image gallery effect running - currentImageIndex:", currentImageIndex);
        console.log("Image gallery effect running - allImages:", allImages);
        
        if (allImages && allImages.length > 0) {
            // First, ensure index is within bounds
            const safeIndex = Math.min(currentImageIndex, allImages.length - 1);
            if (safeIndex !== currentImageIndex) {
                console.log("Fixing out of bounds index:", currentImageIndex, "->", safeIndex);
                setCurrentImageIndex(safeIndex);
            }
            
            // Set the selected image directly from the array
            const newSelectedImage = allImages[safeIndex];
            console.log("Setting selected image to:", newSelectedImage);
            setSelectedImage(newSelectedImage);
        }
    }, [currentImageIndex, allImages]);

    // Image navigation handlers
    const goToNextImage = () => {
        console.log("Going to next image from index:", currentImageIndex);
        if (!allImages || allImages.length === 0) return;
        
        const nextIndex = currentImageIndex === allImages.length - 1 ? 0 : currentImageIndex + 1;
        console.log("Next image index:", nextIndex);
        setCurrentImageIndex(nextIndex);
    };

    const goToPrevImage = () => {
        console.log("Going to previous image from index:", currentImageIndex);
        if (!allImages || allImages.length === 0) return;
        
        const prevIndex = currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
        console.log("Previous image index:", prevIndex);
        setCurrentImageIndex(prevIndex);
    };

    // Set initial image only when it changes
    useEffect(() => {
        if (singleProduct?.image && (!selectedImage || allImages.length === 1)) {
            console.log("Setting initial image from product:", singleProduct.image);
            setSelectedImage(singleProduct.image);
            setCurrentImageIndex(0); // Reset to first image when product changes
        }
    }, [singleProduct?._id, singleProduct?.image, selectedImage, allImages]);

    // Set initial selected image, size, and color when product loads
    useEffect(() => {
        // Skip if product hasn't loaded or is invalid
        if (!singleProduct || !singleProduct._id) {
            return;
        }
        
        console.log("Product changed, initializing selections:", singleProduct._id);
        
        // Reset selections when product changes - but only if there are new values to set
        if (singleProduct?.sizes?.length > 0) {
            const firstAvailableSize = singleProduct.sizes.find(size => 
                !outOfStockSizes.includes(size)
            );
            console.log("Setting initial size on product change:", firstAvailableSize || singleProduct.sizes[0]);
            setSelectedSize(firstAvailableSize || singleProduct.sizes[0]);
        }

        if (singleProduct?.colors?.length > 0) {
            // Get a proper color name for the initial color
            const initialColor = singleProduct.colors[0];
            const colorName = initialColor.name || getColorName(initialColor.hexCode) || 'Default Color';
            
            console.log("Setting initial color:", colorName, "from", initialColor);
            setSelectedColor({
                name: colorName,
                hexCode: initialColor.hexCode || initialColor.name
            });
        }
    }, [singleProduct?._id]); // Only run when product ID changes

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

    // Helper function to convert hex code to color name
    const getColorName = (hexCode) => {
        if (!hexCode) return '';
        
        // If it's already a name (not starting with #), return it
        if (!hexCode.startsWith('#')) return hexCode;
        
        // Find the color in our predefined colors array
        const foundColor = PRODUCT_COLORS.find(c => 
            c.value.toLowerCase() === hexCode.toLowerCase()
        );
        
        // Return the standard color name or a simple default
        if (foundColor) {
            return foundColor.name;
        } else {
            // Simple matching for basic colors if exact match not found
            if (hexCode.toLowerCase() === '#ff0000') return 'Red';
            if (hexCode.toLowerCase() === '#00ff00') return 'Green';
            if (hexCode.toLowerCase() === '#0000ff') return 'Blue';
            if (hexCode.toLowerCase() === '#ffff00') return 'Yellow';
            if (hexCode.toLowerCase() === '#000000') return 'Black';
            if (hexCode.toLowerCase() === '#ffffff') return 'White';
            
            // Return a friendly generic name rather than the hex code
            return 'Custom Color';
        }
    };

    // Handlers
    const handleAddToCart = (product) => {
        console.log("Adding to cart with size:", selectedSize);
        
        // Verify we have a size selected if product has sizes
        if (product.sizes?.length > 0 && !selectedSize) {
            toast.error('Please select a size');
            return;
        }

        // Verify we have a color selected if product has colors
        if (product.colors?.length > 0 && !selectedColor) {
            toast.error('Please select a color');
            return;
        }

        // Get the color value to store - prefer the name for display
        const colorToStore = typeof selectedColor === 'object' 
            ? selectedColor.name  // Store the name for better display in cart
            : selectedColor;

        // Create the product object with the selected options
        const productToAdd = {
                ...product,
            selectedSize: selectedSize,
            selectedColor: colorToStore,
                quantity: 1
            };

        console.log("Product being added to cart:", productToAdd);
        
        // Add to cart and show confirmation
        dispatch(addToCart(productToAdd));
        toast.success('Added to cart successfully');
    };

    const handlePreOrder = (product) => {
        // Verify we have a size selected if product has sizes
        if (product.sizes?.length > 0 && !selectedSize) {
            toast.error('Please select a size');
            return;
        }

        // Verify we have a color selected if product has colors
        if (product.colors?.length > 0 && !selectedColor) {
            toast.error('Please select a color');
            return;
        }

        // Get the color value to store - prefer the name for display
        const colorToStore = selectedColor ? (
            typeof selectedColor === 'object' 
                ? selectedColor.name  // Store the name for better display in cart
                : selectedColor
        ) : null;
            
        const productWithSize = {
            ...product,
            selectedSize,
            selectedColor: colorToStore,
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
        if (!hasReachedStockLimit) {
            // Get the color value to store - prefer the name for display
            const colorToStore = typeof selectedColor === 'object' 
                ? selectedColor.name  // Store the name for better display in cart
                : selectedColor;
                
            const productWithSize = {
                ...product,
                selectedSize,
                selectedColor: colorToStore
            };
            dispatch(addToCart(productWithSize));
        }
    };

    const handleDecrement = (product) => {
        dispatch(decrementQuantity(product));
    };

    // Handler for size selection - simplified
    const handleSizeSelect = (size) => {
        console.log("Size selected in SingleProduct:", size);
        
        // Guard against invalid sizes
        if (!size || typeof size !== 'string') {
            console.error("Invalid size selected:", size);
            return;
        }
        
        // Force update the selectedSize state
        setSelectedSize(size);
        
        // Show visual confirmation with longer duration
        toast.success(`Size ${size} selected`, {
            id: 'size-selection-toast',
            duration: 2000
        });
        
        console.log("Selected size after update:", size);
    };

    const handleColorSelect = (color, hexCode) => {
        console.log("Selected color:", color, "Hex:", hexCode);
        
        // Find the color object - prioritize color name match
        const colorObject = singleProduct.colors?.find(c => c.name === color) || 
                          singleProduct.colors?.find(c => c.hexCode === hexCode);
        
        // Always store the color name for display, but keep hex code for internal use
        const colorName = colorObject?.name || getColorName(hexCode) || color;
        setSelectedColor({
            name: colorName,
            hexCode: colorObject?.hexCode || hexCode
        });
        
        // Update the selected image if there's a color-specific image
        if (colorObject?.imageUrl) {
            setSelectedImage(colorObject.imageUrl);
        }
        
        // Show confirmation toast with the color name
        toast.success(`Color ${colorName} selected`, {
            id: 'color-selection-toast',
            duration: 2000
        });
    };

    const handleReviewSubmitted = async (updatedReviews) => {
        try {
            if (updatedReviews.length > 0) {
                const totalRating = updatedReviews.reduce((acc, review) => acc + review.rating, 0);
                const averageRating = totalRating / updatedReviews.length;
                
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

    // Debug logging for image data
    console.log('Gallery images sources:', galleryImages);
    console.log('Product gallery field:', singleProduct?.gallery);
    console.log('Product images field:', singleProduct?.images); 
    console.log('Main product image:', singleProduct?.image);
    console.log('Combined images for display:', allImages);
    console.log('Currently selected image:', selectedImage);
    
    // Get delivery information
    const deliveryInfo = getDeliveryInfo();

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
                        {/* Main Product Image with slider */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
                            {selectedImage && (
                                <>
                            <img
                                        src={getImageUrl(selectedImage)}
                                alt={singleProduct.name}
                                        className="w-full h-full object-contain transition-opacity duration-300"
                                onClick={() => setPreviewOpen(true)}
                                        onError={(e) => {
                                            console.error("Image failed to load:", selectedImage);
                                            e.target.src = "https://via.placeholder.com/600x600?text=Image+Not+Available";
                                        }}
                                    />
                                    
                                    {/* Navigation arrows for image slider */}
                                    {allImages.length > 1 && (
                                        <>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    goToPrevImage();
                                                }}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                                                aria-label="Previous image"
                                            >
                                                <FaChevronLeft className="w-4 h-4 text-gray-800" />
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    goToNextImage();
                                                }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                                                aria-label="Next image"
                                            >
                                                <FaChevronRight className="w-4 h-4 text-gray-800" />
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Slider indicators */}
                        {allImages.length > 1 && (
                            <div className="flex justify-center mt-4 gap-2">
                                {allImages.map((_, index) => (
                                    <button
                                        key={`indicator-${index}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-colors ${
                                            currentImageIndex === index 
                                                ? 'bg-black' 
                                                : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                        aria-label={`Go to image ${index + 1}`}
                                    />
                                ))}
                                    </div>
                        )}
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
                                        key={`size-wheel-${singleProduct._id}`}
                                    />
                                    
                                    {/* Display selected size for extra confirmation */}
                                    {selectedSize && (
                                        <div className="mt-4 inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800">
                                            Selected size: {selectedSize}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Color Selection */}
                            {Array.isArray(singleProduct.colors) && singleProduct.colors.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4 text-gray-800">Select Color</h3>
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex flex-wrap gap-3">
                                            {singleProduct.colors
                                                .filter(c => c !== null && c !== undefined)
                                                .map((colorObj, index) => {
                                                    if (!colorObj) return null; // Extra safety check
                                                    
                                                    // First determine a proper display name for the color - never show hex codes
                                                    const displayName = colorObj.name && typeof colorObj.name === 'string' && !colorObj.name.startsWith('#') 
                                                        ? colorObj.name 
                                                        : getColorName(colorObj.hexCode) || `Color ${index + 1}`;
                                                    
                                                    // Check if this color is selected
                                                    const isSelected = 
                                                        (typeof selectedColor === 'object' && selectedColor && (
                                                            (selectedColor.name && displayName && selectedColor.name === displayName) ||
                                                            (selectedColor.hexCode && colorObj.hexCode && selectedColor.hexCode === colorObj.hexCode)
                                                        )) || 
                                                        (selectedColor && displayName && selectedColor === displayName) ||
                                                        (selectedColor && colorObj.hexCode && selectedColor === colorObj.hexCode);
                                                    
                                                    return (
                                                        <button
                                                            key={`color-${index}-${colorObj.hexCode || index}`}
                                                            type="button"
                                                            onClick={() => handleColorSelect(displayName, colorObj.hexCode)}
                                                            className={`
                                                                flex items-center gap-2 px-3 py-2 rounded-md border
                                                                ${isSelected ? 
                                                                    'border-primary bg-primary/5 font-medium' : 
                                                                    'border-gray-300 hover:border-gray-400'
                                                                }
                                                                transition-all
                                                            `}
                                                            title={displayName}
                                                        >
                                                            <div
                                                                className={`w-6 h-6 rounded-full ${isSelected ? 'ring-2 ring-primary' : ''}`}
                                                                style={{ backgroundColor: colorObj.hexCode || '#CCCCCC' }}
                                                            />
                                                            <span className="text-sm">{displayName}</span>
                                                        </button>
                                                    );
                                                })}
                                        </div>
                                        
                                        {selectedColor && (
                                            <div className="mt-2 flex items-center">
                                                <span className="text-sm font-medium mr-2">Selected color:</span>
                                                <div className="flex items-center gap-2">
                                                    {(() => {
                                                        try {
                                                            // Find the color object with null safety
                                                            const colorObj = singleProduct.colors?.find(c => 
                                                                c && (
                                                                    (typeof selectedColor === 'object' && (
                                                                        c.name === selectedColor.name || 
                                                                        c.hexCode === selectedColor.hexCode
                                                                    )) ||
                                                                    c.name === selectedColor || 
                                                                    c.hexCode === selectedColor
                                                                )
                                                            );
                                                            
                                                            // Get the hex code for the color preview with fallback
                                                            const hexCode = colorObj?.hexCode || 
                                                                        (typeof selectedColor === 'object' ? selectedColor.hexCode : selectedColor) || 
                                                                        '#CCCCCC'; // Gray fallback
                                                            
                                                            // Get the display name - NEVER use hex codes for display
                                                            let displayName;
                                                            if (typeof selectedColor === 'object' && selectedColor.name) {
                                                                displayName = selectedColor.name;
                                                            } else if (colorObj?.name && !colorObj.name.startsWith('#')) {
                                                                displayName = colorObj.name;
                                                            } else {
                                                                displayName = getColorName(hexCode) || "Selected Color";
                                                            }
                                                            
                                                            // Ensure we never display a hex code to the user
                                                            if (displayName && displayName.startsWith && displayName.startsWith('#')) {
                                                                displayName = getColorName(displayName) || "Selected Color";
                                                            }
                                                            
                                                            return (
                                                                <>
                                                                    <div
                                                                        className="w-5 h-5 rounded-full border border-gray-300"
                                                                        style={{ backgroundColor: hexCode }}
                                                                    />
                                                                    <span className="text-sm font-medium">
                                                                        {displayName || "Selected Color"}
                                                                    </span>
                                                                </>
                                                            );
                                                        } catch (err) {
                                                            console.error("Error displaying selected color:", err);
                                                            return (
                                                                <>
                                                                    <div
                                                                        className="w-5 h-5 rounded-full border border-gray-300"
                                                                        style={{ backgroundColor: '#CCCCCC' }}
                                                                    />
                                                                    <span className="text-sm font-medium">
                                                                        Selected Color
                                                                    </span>
                                                                </>
                                                            );
                                                        }
                                                    })()}
                                                </div>
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
                                    
                                    {/* Delivery Fee & Total */}
                                    <div className="mt-6 border-t border-gray-200 pt-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Product Price:</span>
                                                <span className="font-medium">₦{singleProduct?.price?.toLocaleString() || 0}</span>
                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Delivery Fee:</span>
                                                <span className="font-medium">₦{deliveryFee.toLocaleString()}</span>
                            </div>
                                            <div className="flex justify-between font-bold pt-2 border-t border-gray-100">
                                                <span>Total:</span>
                                                <span>₦{((singleProduct?.price || 0) + deliveryFee).toLocaleString()}</span>
                                </div>
                                </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>
        </motion.div>
    );
};

export default SingleProduct;