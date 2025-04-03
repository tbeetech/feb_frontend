import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useCurrency } from '../../components/CurrencySwitcher';

const ShopHeader = ({ products = [] }) => {
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const { formatPrice, currencySymbol } = useCurrency();

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
        <section className="relative min-h-[500px] mt-16 overflow-hidden">
            {/* Glassmorphism Background */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-gray-100/30 to-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {/* Glass overlay */}
                <div className="absolute inset-0 backdrop-blur-sm bg-white/30" />
                
                {/* Animated circles */}
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-primary/10"
                            style={{
                                width: Math.random() * 200 + 50,
                                height: Math.random() * 200 + 50,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 3 + i,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
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

                {/* Products Slider */}
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
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="w-64 flex-shrink-0 bg-white/80 backdrop-blur-md rounded-lg shadow-lg overflow-hidden cursor-pointer"
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    <div className="relative h-32">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <div className="absolute bottom-2 left-2 right-2 text-white">
                                            <p className="text-sm font-semibold truncate">{product.name}</p>
                                            <p className="text-xs">{currencySymbol}{formatPrice(product.price)}</p>
                                        </div>
                                    </div>
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
