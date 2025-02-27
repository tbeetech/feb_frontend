import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ShopHeader = ({ products = [] }) => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-[500px] mt-16 overflow-hidden">
            {/* Glassmorphism Background */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary-light/30 to-white"
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

                {/* Floating Products Display */}
                {products.length > 0 && (
                    <div className="relative h-40 overflow-hidden mt-8">
                        <motion.div
                            className="flex gap-6 absolute"
                            animate={{
                                x: [-products.length * 320, 0],
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    duration: 20,
                                    ease: "linear",
                                },
                            }}
                        >
                            {[...products, ...products].map((product, index) => (
                                <motion.div
                                    key={`${product._id}-${index}`}
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
                                            <p className="text-xs">₦{product.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ShopHeader;
