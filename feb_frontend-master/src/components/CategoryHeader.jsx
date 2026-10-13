import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getBanners } from '../constants/bannerConstants';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CategoryHeader = ({ categoryName, subcategory, products = [], categoryImage }) => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const displayName = subcategory 
        ? `${categoryName} - ${subcategory.replace(/-/g, ' ')}` 
        : categoryName;

    const currentBanners = getBanners(categoryName?.toLowerCase(), subcategory);
    
    // Use only one banner image
    const bannerImage = currentBanners.banner1.image;
    
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="relative mt-12 mb-12 overflow-hidden">
            {/* Single Banner with Text Overlay */}
            <div className="relative h-[280px] w-full mb-10">
                <motion.div 
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <img 
                        src={bannerImage} 
                        alt={displayName}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                </motion.div>

                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                    <motion.h1 
                        className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4 capitalize"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        {displayName}
                    </motion.h1>
                    <motion.div 
                        className="w-16 h-0.5 bg-white mb-4"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    />
                    <motion.p 
                        className="text-lg text-white max-w-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        {products.length} items
                    </motion.p>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4">
                {/* Featured Products Slider */}
                {products.length > 0 && (
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-medium text-gray-900">Featured Products</h2>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={scrollLeft}
                                    className="p-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                                    aria-label="Scroll left"
                                >
                                    <FaChevronLeft className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={scrollRight}
                                    className="p-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                                    aria-label="Scroll right"
                                >
                                    <FaChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        <div 
                            ref={scrollContainerRef}
                            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {products.slice(0, 8).map((product) => (
                                    <motion.div
                                    key={product._id}
                                    whileHover={{ scale: 1.03 }}
                                    className="w-64 flex-shrink-0 bg-white rounded-md overflow-hidden cursor-pointer"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                    <div className="relative h-60 overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    <div className="p-3 bg-white">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {product.name}
                                            </h3>
                                        <div className="mt-1 flex justify-between items-center">
                                            <p className="text-sm font-medium text-gray-900">
                                                ₦{product.price?.toLocaleString()}
                                            </p>
                                            {product.oldPrice > 0 && (
                                                <p className="text-xs text-gray-500 line-through">
                                                    ₦{product.oldPrice?.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoryHeader;
