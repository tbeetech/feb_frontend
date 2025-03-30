import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useFetchAllProductsQuery } from '../redux/features/products/productsApi';

const NewArrivalsSlider = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    const { data, isLoading, error, refetch } = useFetchAllProductsQuery({
        limit: 7,
        sort: '-createdAt'
    });

    useEffect(() => {
        // Log query status
        console.log('Query Status:', { isLoading, error, data });
    }, [isLoading, error, data]);

    const products = data?.products || [];

    // Auto-slide functionality
    useEffect(() => {
        if (products.length > 0) {
            const timer = setInterval(() => {
                setCurrentIndex((prevIndex) => 
                    prevIndex === products.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000); // Change slide every 3 seconds (changed from 3500)

            return () => clearInterval(timer);
        }
    }, [products.length]);

    // Reset index when products change
    useEffect(() => {
        setCurrentIndex(0);
    }, [products]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px] bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        console.error('NewArrivalsSlider Error:', error);
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50">
                <p className="text-red-500 mb-4">Error loading new arrivals</p>
                <button 
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!products?.length) {
        return (
            <div className="flex justify-center items-center min-h-[400px] bg-gray-50">
                <p className="text-gray-500">No new arrivals available</p>
            </div>
        );
    }

    // 3D card animation variants
    const cardVariants = {
        hidden: { 
            rotateY: 180,
            opacity: 0,
            scale: 0.8,
            z: -100
        },
        visible: {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            z: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
        hover: {
            scale: 1.05,
            rotateY: 15,
            z: 50,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30
            }
        }
    };

    // Parallax effect for background
    const backgroundVariants = {
        initial: { opacity: 0 },
        animate: { 
            opacity: 1,
            transition: {
                duration: 1.5
            }
        }
    };

    // Slider animation variants
    const sliderVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection) => {
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) return products.length - 1;
            if (nextIndex >= products.length) return 0;
            return nextIndex;
        });
    };

    return (
        <motion.div 
            className="relative min-h-[600px] overflow-hidden"
            initial="initial"
            animate="animate"
            variants={backgroundVariants}
        >
            {/* Parallax Background */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary-light/30 to-white"
                style={{
                    backgroundSize: "200% 200%",
                    backgroundPosition: "0% 0%"
                }}
                animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
                <AnimatePresence initial={false} custom={currentIndex}>
                    <motion.div
                        key={currentIndex}
                        custom={currentIndex}
                        variants={sliderVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        className="absolute inset-0 z-10"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
                            {/* Product Image */}
                            <motion.div
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                className="relative perspective-1000"
                            >
                                <div className="relative group cursor-pointer" 
                                     onClick={() => navigate(`/product/${products[currentIndex]._id}`)}>
                                    <img
                                        src={products[currentIndex].image}
                                        alt={products[currentIndex].name}
                                        className="w-full h-[400px] object-cover rounded-lg shadow-2xl transform-gpu"
                                    />
                                    <motion.div
                                        className="absolute inset-0 bg-black bg-opacity-40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        whileHover={{ opacity: 1 }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-white text-lg font-semibold">View Details</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Product Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center md:text-left"
                            >
                                <motion.h3
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-3xl font-playfair font-bold text-gray-900 mb-4"
                                >
                                    {products[currentIndex].name}
                                </motion.h3>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-2xl font-bold text-primary mb-4"
                                >
                                    ₦{products[currentIndex].price.toLocaleString()}
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-primary text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-primary-dark transition-colors"
                                    onClick={() => navigate(`/product/${products[currentIndex]._id}`)}
                                >
                                    Shop Now
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {products.map((_, index) => (
                        <motion.button
                            key={index}
                            className={`w-3 h-3 rounded-full ${
                                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                            }`}
                            onClick={() => setCurrentIndex(index)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                        />
                    ))}
                </div>
                
                {/* Go to Shop button */}
                <div className="flex justify-center mt-12 relative z-20">
                    <Link 
                        to="/shop" 
                        className="bg-gold hover:bg-gold-dark text-white font-medium py-3 px-6 rounded-md transition-all duration-300 shadow-luxury flex items-center gap-2 transform hover:scale-105"
                    >
                        Go to Shop
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default NewArrivalsSlider;
