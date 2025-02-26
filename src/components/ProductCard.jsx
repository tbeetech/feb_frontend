import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -10 }}
            className="product__card premium-shadow"
        >
            <Link to={`/product/${product._id}`}>
                <div className="relative overflow-hidden group">
                    <motion.img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-64 object-cover transition-transform duration-700 ease-out"
                        whileHover={{ scale: 1.05 }}
                    />
                    {product.discount > 0 && (
                        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                            -{product.discount}% OFF
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 ease-in-out" />
                </div>
                
                <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <p className="text-primary font-bold text-xl">
                                ₦{product.price.toLocaleString()}
                            </p>
                            {product.oldPrice > 0 && (
                                <p className="text-gray-400 line-through text-sm">
                                    ₦{product.oldPrice.toLocaleString()}
                                </p>
                            )}
                        </div>
                        <div className="text-yellow-400">
                            {'★'.repeat(product.rating)}
                            {'☆'.repeat(5 - product.rating)}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
