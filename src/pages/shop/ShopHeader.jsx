import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ShopHeader = ({ products = [] }) => {
    const navigate = useNavigate();
    const sliderRef = useRef(null);

    const scrollSlider = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = direction * 300; // Adjust scroll amount as needed
            sliderRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="relative min-h-[400px] overflow-hidden">
            {/* Glassmorphism Background */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-gray-100/30 to-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <motion.h1 
                        className="text-4xl md:text-6xl font-playfair font-bold text-gray-900 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Discover Our Collection
                    </motion.h1>
                    <motion.p 
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Elevate your style with our curated selection of luxury fashion and accessories
                    </motion.p>
                </motion.div>

                {/* Products Slider - Simplified to show only full-sized images */}
                {products.length > 0 && (
                    <div className="relative mt-8">
                        {/* Left Navigation Button */}
                        <button 
                            onClick={() => scrollSlider(-1)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md p-2 hover:bg-white transition-colors"
                            aria-label="Scroll left"
                        >
                            <FaChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Scrollable Products Container */}
                        <div 
                            ref={sliderRef}
                            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {products.map((product) => (
                                <motion.div
                                    key={product._id}
                                    whileHover={{ scale: 1.05 }}
                                    className="w-72 h-96 flex-shrink-0 cursor-pointer relative overflow-hidden rounded-lg"
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    <img
                                        src={product.image || product.images?.[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* Right Navigation Button */}
                        <button 
                            onClick={() => scrollSlider(1)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md p-2 hover:bg-white transition-colors"
                            aria-label="Scroll right"
                        >
                            <FaChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ShopHeader;
