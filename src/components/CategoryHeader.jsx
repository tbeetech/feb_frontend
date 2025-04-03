import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getBanners } from '../constants/bannerConstants';

const CategoryHeader = ({ categoryName, subcategory, products = [], categoryImage }) => {
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

    const currentBanners = getBanners(categoryName?.toLowerCase(), subcategory);

    return (
        <section className="relative min-h-[500px] mt-16 mb-8 overflow-hidden">
            {/* Category Banners */}
            <div className="grid md:grid-cols-2 gap-8 mb-12 relative z-10">
                <motion.div 
                    className="relative h-[300px] overflow-hidden rounded-lg"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <img 
                        src={currentBanners.banner1.image} 
                        alt={currentBanners.banner1.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-end">
                        <h3 className="text-white text-2xl font-bold mb-2">
                            {currentBanners.banner1.title}
                        </h3>
                        <p className="text-white/90">
                            {currentBanners.banner1.description}
                        </p>
                    </div>
                </motion.div>

                <motion.div 
                    className="relative h-[300px] overflow-hidden rounded-lg"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <img 
                        src={currentBanners.banner2.image} 
                        alt={currentBanners.banner2.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-end">
                        <h3 className="text-white text-2xl font-bold mb-2">
                            {currentBanners.banner2.title}
                        </h3>
                        <p className="text-white/90">
                            {currentBanners.banner2.description}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 pt-8 pb-16">
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
                    
                    {/* Product count */}
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
                    <div className="relative mt-12 perspective-1000 transform-gpu">
                        {/* 3D Container */}
                        <div className="relative h-[300px] category-header-3d">
                            {/* Geometric Shapes Layer */}
                            <motion.div
                                className="absolute inset-0 overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute rounded-full bg-gradient-to-r from-gray-200/10 to-white/20"
                                        style={{
                                            width: Math.random() * 300 + 100,
                                            height: Math.random() * 300 + 100,
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                            filter: 'blur(50px)',
                                            transform: 'translateZ(-50px)',
                                        }}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 180, 360],
                                            opacity: [0.3, 0.5, 0.3],
                                        }}
                                        transition={{
                                            duration: 15,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    />
                                ))}
                            </motion.div>

                            {/* Grid Pattern */}
                            <motion.div
                                className="absolute inset-0 bg-grid-pattern"
                                style={{
                                    transform: 'translateZ(-30px) rotateX(60deg)',
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

                            {/* Products Scroll */}
                            <div
                                className="absolute inset-0 flex gap-4 overflow-x-auto py-4 px-2 no-scrollbar"
                                style={{
                                    transform: 'translateZ(0px)',
                                }}
                            >
                                {products.slice(0, 6).map((product, index) => (
                                    <motion.div
                                        key={`${product._id}-${index}`}
                                        className="w-80 flex-shrink-0 glass-effect rounded-lg overflow-hidden cursor-pointer"
                                        whileHover={{ scale: 1.05, translateZ: 20 }}
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        {/* Product content */}
                                        <div className="relative h-48">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4 backdrop-blur-sm">
                                            <h3 className="text-lg font-semibold text-white">
                                                {product.name}
                                            </h3>
                                            <p className="text-white/90">
                                                ₦{product.price?.toLocaleString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Floating Particles */}
                            <div className="absolute inset-0">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1 h-1 bg-white rounded-full"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                        }}
                                        animate={{
                                            y: [0, -30, 0],
                                            opacity: [0, 1, 0],
                                        }}
                                        transition={{
                                            duration: 3 + Math.random() * 2,
                                            repeat: Infinity,
                                            delay: Math.random() * 2,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoryHeader;
