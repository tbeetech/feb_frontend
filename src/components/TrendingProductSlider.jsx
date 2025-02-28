import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFetchAllProductsQuery } from '../redux/features/products/productsApi';

const TrendingProductSlider = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useFetchAllProductsQuery({
        limit: 10,
        sort: '-rating' // Sort by rating to get trending products
    });

    const products = data?.products || [];

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
        <div className="relative overflow-hidden py-4">
            <motion.div 
                className="flex gap-4 overflow-x-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    animate={{
                        x: [-100, -(products.length * 320)],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                    className="flex gap-4"
                >
                    {[...products, ...products].map((product, index) => (
                        <motion.div
                            key={`${product._id}-${index}`}
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
                </motion.div>
            </motion.div>
        </div>
    );
};

export default TrendingProductSlider;
