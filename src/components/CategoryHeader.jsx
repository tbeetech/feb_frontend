import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CategoryHeader = ({ categoryName, subcategory, products = [] }) => {
    const navigate = useNavigate();
    const displayName = subcategory 
        ? `${categoryName} - ${subcategory.replace(/-/g, ' ')}` 
        : categoryName;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <section className="relative min-h-[500px] mt-16 mb-8 overflow-hidden">
            {/* 3D Background with perspective */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary-light to-white"
                initial={{ rotateX: 45, scale: 1.2 }}
                animate={{ 
                    rotateX: 0, 
                    scale: 1,
                    transition: { duration: 1.5, ease: "easeOut" }
                }}
                style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                }}
            >
                {/* Animated grid pattern */}
                <motion.div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(0deg, transparent 24%, 
                            rgba(0, 0, 0, 0.05) 25%, 
                            rgba(0, 0, 0, 0.05) 26%, 
                            transparent 27%, transparent 74%, 
                            rgba(0, 0, 0, 0.05) 75%, 
                            rgba(0, 0, 0, 0.05) 76%, 
                            transparent 77%, transparent),
                            linear-gradient(90deg, transparent 24%, 
                            rgba(0, 0, 0, 0.05) 25%, 
                            rgba(0, 0, 0, 0.05) 26%, 
                            transparent 27%, transparent 74%, 
                            rgba(0, 0, 0, 0.05) 75%, 
                            rgba(0, 0, 0, 0.05) 76%, 
                            transparent 77%, transparent)
                        `,
                        backgroundSize: '50px 50px',
                    }}
                    animate={{
                        backgroundPosition: ['0px 0px', '50px 50px'],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                {/* Floating particles */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)'
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center"
                >
                    <motion.h1 
                        variants={itemVariants}
                        className="text-4xl md:text-6xl font-playfair font-bold text-gray-900 mb-6 capitalize"
                    >
                        {displayName}
                    </motion.h1>
                    <motion.div 
                        variants={itemVariants}
                        className="w-24 h-1 bg-primary mx-auto mb-6"
                    />
                    <motion.p 
                        variants={itemVariants}
                        className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
                    >
                        Discover our exclusive collection of {displayName.toLowerCase()} products
                    </motion.p>
                    
                    {/* Product count and sorting options */}
                    <motion.div
                        variants={itemVariants}
                        className="flex justify-center items-center gap-4 text-gray-600"
                    >
                        <span className="text-lg">
                            {products.length} Products
                        </span>
                    </motion.div>
                </motion.div>

                {/* Infinite Scroll Products Preview */}
                {products.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-12 relative"
                    >
                        <div className="flex gap-4 overflow-x-hidden">
                            <motion.div
                                animate={{
                                    x: [-100, -(products.length * 320)],
                                }}
                                transition={{
                                    x: {
                                        repeat: Infinity,
                                        duration: 20,
                                        ease: "linear",
                                    },
                                }}
                                className="flex gap-4"
                            >
                                {[...products, ...products].map((product, index) => (
                                    <motion.div
                                        key={`${product._id}-${index}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-72 flex-shrink-0 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform-gpu hover:shadow-xl transition-all duration-300"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                            />
                                            {product.discount > 0 && (
                                                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-sm">
                                                    -{product.discount}%
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                                                {product.name}
                                            </h3>
                                            <div className="mt-2 flex justify-between items-center">
                                                <span className="text-primary font-bold">
                                                    ₦{product.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default CategoryHeader;
