import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useFetchAllProductsQuery } from '../redux/features/products/productsApi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
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
        <div className="relative py-4 max-w-full">
            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 z-10">
                <button 
                    onClick={scrollLeft}
                    className="bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                    aria-label="Scroll left"
                >
                    <FaChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
            </div>
            
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                <button 
                    onClick={scrollRight}
                    className="bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                    aria-label="Scroll right"
                >
                    <FaChevronRight className="w-5 h-5 text-gray-800" />
                </button>
            </div>
            
            {/* Products Container */}
            <div 
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <motion.div
                        key={product._id}
                        whileHover={{ 
                            scale: 1.05,
                            y: -5,
                            transition: { type: "spring", stiffness: 300 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="w-72 flex-shrink-0 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer glass-morphism hover-lift"
                        onClick={() => navigate(`/product/${product._id}`)}
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={product.images?.[0] || product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                            />
                            {product.discount > 0 && (
                                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-sm font-medium">
                                    -{product.discount}%
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                                {product.name}
                            </h3>
                            <div className="mt-2 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-primary font-bold">
                                        ₦{product.price.toLocaleString()}
                                    </span>
                                    {product.oldPrice > 0 && (
                                        <span className="text-sm text-gray-500 line-through">
                                            ₦{product.oldPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <div className="text-yellow-400">
                                    {'★'.repeat(Math.floor(product.rating || 0))}
                                    {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {/* Go to Shop button */}
            <div className="flex justify-center mt-8">
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
    );
};

export default TrendingProductSlider;
