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
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <section className="relative min-h-[400px] bg-gradient-to-r from-primary-light to-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-grid-pattern"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 section__container py-16">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="text-center mb-8"
                >
                    <motion.h2 
                        variants={itemVariants}
                        className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4"
                    >
                        {displayName}
                    </motion.h2>
                    <motion.p 
                        variants={itemVariants}
                        className="text-lg text-gray-600"
                    >
                        Browse our collection of {displayName} products
                    </motion.p>
                </motion.div>

                {/* Sliding Products Preview */}
                {products.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative mt-8"
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
                                        className="w-72 flex-shrink-0 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                            />
                                            {product.oldPrice && (
                                                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-sm">
                                                    Sale!
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
                                                    {product.oldPrice && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            ₦{product.oldPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-yellow-400">
                                                    {'★'.repeat(Math.floor(product.rating))}
                                                    {'☆'.repeat(5 - Math.floor(product.rating))}
                                                </div>
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
