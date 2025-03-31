import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { FaHeart, FaRegHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import RatingStars from '../../components/RatingStars';
import { springAnimation } from '../../utils/animations';
import ImagePreviewModal from '../../components/ImagePreviewModal';
import { getImageUrl } from '../../utils/imageUrl';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState({
        isOpen: false,
        url: '',
        name: ''
    });
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);
    
    // For 3D effect
    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        setRotation({ x: rotateX, y: rotateY });
    };
    
    const resetRotation = () => {
        setRotation({ x: 0, y: 0 });
    };
    
    // Format price with commas
    const formatPrice = (price) => {
        return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // Calculate discount percentage
    const calculateDiscount = () => {
        if (!product.oldPrice) return null;
        const discount = ((product.oldPrice - product.price) / product.oldPrice) * 100;
        return Math.round(discount);
    };
    
    const discount = calculateDiscount();
    
    // Add to cart handler
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart(product));
    };
    
    // Toggle favorite
    const toggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };
    
    // Quick view handler
    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Implement quick view functionality
    };
    
    // Animation variants
    const imageVariants = {
        hover: { scale: 1.1, transition: { duration: 0.5 } },
        initial: { scale: 1, transition: { duration: 0.5 } }
    };
    
    const buttonVariants = {
        hover: { y: 0, opacity: 1 },
        initial: { y: 20, opacity: 0 }
    };
    
    const badgeVariants = {
        initial: { scale: 0 },
        animate: { scale: 1, transition: { type: 'spring', stiffness: 500, damping: 30 } }
    };

    return (
        <>
            <motion.div
                ref={cardRef}
                className="luxury-card group h-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    resetRotation();
                }}
                onMouseMove={handleMouseMove}
                whileHover={{ y: -5 }}
                style={{
                    transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.1s ease'
                }}
            >
                <Link to={`/product/${product._id}`} className="block h-full">
                    <div className="relative overflow-hidden rounded-t-lg">
                        {/* Discount Badge */}
                        {discount && (
                            <motion.div
                                className="absolute top-2 left-2 z-10 bg-burgundy text-white text-xs font-bold px-2 py-1 rounded-md"
                                variants={badgeVariants}
                                initial="initial"
                                animate="animate"
                            >
                                {discount}% OFF
                            </motion.div>
                        )}
                        
                        {/* New Badge */}
                        {product.isNew && (
                            <motion.div
                                className="absolute top-2 right-2 z-10 bg-emerald text-white text-xs font-bold px-2 py-1 rounded-md"
                                variants={badgeVariants}
                                initial="initial"
                                animate="animate"
                            >
                                NEW
                            </motion.div>
                        )}
                        
                        {/* Product Image */}
                        <div className="aspect-square overflow-hidden bg-gray-100">
                            <motion.img
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                variants={imageVariants}
                                initial="initial"
                                animate={isHovered ? "hover" : "initial"}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                                }}
                            />
                        </div>
                        
                        {/* Action Buttons */}
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 p-4 flex justify-center space-x-2"
                            variants={buttonVariants}
                            initial="initial"
                            animate={isHovered ? "hover" : "initial"}
                            transition={{ staggerChildren: 0.1 }}
                        >
                            <motion.button
                                onClick={handleAddToCart}
                                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gold hover:text-white transition-colors duration-300"
                                variants={buttonVariants}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaShoppingCart />
                            </motion.button>
                            
                            <motion.button
                                onClick={toggleFavorite}
                                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gold hover:text-white transition-colors duration-300"
                                variants={buttonVariants}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isFavorite ? <FaHeart className="text-burgundy" /> : <FaRegHeart />}
                            </motion.button>
                            
                            <motion.button
                                onClick={handleQuickView}
                                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gold hover:text-white transition-colors duration-300"
                                variants={buttonVariants}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaEye />
                            </motion.button>
                        </motion.div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4 text-center">
                        {/* Product Rating */}
                        <div className="flex justify-center mb-2">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-xs ${i < product.rating ? 'text-gold' : 'text-gray-300'}`}>★</span>
                            ))}
                        </div>
                        
                        {/* Product Name */}
                        <h3 className="font-display text-gray-800 mb-1 text-lg font-medium line-clamp-1">
                            {product.name}
                        </h3>
                        
                        {/* Product Price */}
                        <div className="flex justify-center items-center">
                            <span className="text-gold font-medium">₦{formatPrice(product.price)}</span>
                            {product.oldPrice && (
                                <span className="text-gray-400 line-through text-sm ml-2">₦{formatPrice(product.oldPrice)}</span>
                            )}
                        </div>
                        
                        {/* Add to Cart Button (Mobile) */}
                        <motion.button
                            onClick={handleAddToCart}
                            className="mt-3 w-full py-2 bg-gold text-white rounded-md hover:bg-gold-dark transition-colors duration-300 md:hidden"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Add to Cart
                        </motion.button>
                    </div>
                </Link>
            </motion.div>
            
            <ImagePreviewModal 
                isOpen={previewImage.isOpen}
                imageUrl={previewImage.url}
                productName={previewImage.name}
                onClose={() => setPreviewImage({
                    isOpen: false,
                    url: '',
                    name: ''
                })}
            />
        </>
    );
};

export default ProductCard;
