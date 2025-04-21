import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useFetchAllProductsQuery } from '../redux/features/products/productsApi';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';

const TrendingProductSlider = () => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const { data, isLoading, error } = useFetchAllProductsQuery({
        limit: 10,
        sort: '-rating' // Sort by rating to get trending products
    });

    const products = data?.products || [];

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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[400px] text-red-500">
                Error loading trending products
            </div>
        );
    }

    if (!products.length) {
        return (
            <div className="flex justify-center items-center min-h-[400px] text-gray-500">
                No trending products available
            </div>
        );
    }

    return (
        <div className="relative py-8 max-w-full">
            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 z-10">
                <button 
                    onClick={scrollLeft}
                    className="bg-white/80 rounded-full p-2 shadow-md hover:bg-black hover:text-white transition-colors"
                    aria-label="Scroll left"
                >
                    <FaChevronLeft className="w-5 h-5" />
                </button>
            </div>
            
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                <button 
                    onClick={scrollRight}
                    className="bg-white/80 rounded-full p-2 shadow-md hover:bg-black hover:text-white transition-colors"
                    aria-label="Scroll right"
                >
                    <FaChevronRight className="w-5 h-5" />
                </button>
            </div>
            
            {/* Products Container - Minimalist Design */}
            <div 
                ref={scrollContainerRef}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <motion.div
                        key={product._id}
                        whileHover={{ 
                            scale: 1.03,
                            transition: { type: "spring", stiffness: 300 }
                        }}
                        className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col"
                    >
                        {/* Only show image for cleaner look */}
                        <div className="relative h-96 overflow-hidden">
                            <img
                                src={product.images?.[0] || product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                onClick={() => navigate(`/product/${product._id}`)}
                            />
                            
                            {/* Black overlay with name and shop now button on hover */}
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-white font-medium text-xl mb-4 text-center px-4">{product.name}</h3>
                                <button 
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    className="bg-white text-black px-6 py-2 flex items-center gap-2 hover:bg-gray-100 transition-colors"
                                >
                                    <span>Shop Now</span>
                                    <FaArrowRight className="text-sm" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {/* Shop All Products button */}
            <div className="flex justify-center mt-12">
                <Link 
                    to="/shop" 
                    className="bg-black text-white font-medium py-3 px-8 flex items-center gap-2 hover:bg-gray-900 transition-all"
                >
                    <span className="text-white">Shop All Products</span>
                    <FaArrowRight className="text-sm text-white" />
                </Link>
            </div>
        </div>
    );
};

export default TrendingProductSlider;
