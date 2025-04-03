import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { CiHeart, CiShoppingCart } from 'react-icons/ci';
import RatingStars from '../../components/RatingStars';
import { getImageUrl } from '../../utils/imageUrl';
import { useCurrency } from './CurrencySwitcher';
import LazyImage from './Image';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { formatPrice, currencySymbol } = useCurrency();
    
    // Calculate discount percentage
    const calculateDiscount = () => {
        if (!product.oldPrice) return null;
        const discount = ((product.oldPrice - product.price) / product.oldPrice) * 100;
        return Math.round(discount);
    };
    
    const discount = calculateDiscount();
    
    // Toggle favorite
    const toggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    };

    // Handle add to cart
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            ...product,
            quantity: 1
        }));
        toast.success('Added to cart');
    };

    return (
        <div 
            className="group relative" 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={`/product/${product._id}`} className="block">
                {/* Product Image */}
                <div className="relative group overflow-hidden rounded-lg">
                    <div className="aspect-square w-full overflow-hidden">
                        <img
                            src={getImageUrl(product.images[0])}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                            }}
                        />
                    </div>
                    
                    {/* Discount Badge */}
                    {discount && (
                        <div className="absolute top-2 left-2 bg-black text-white text-xs font-medium px-2 py-1 rounded-md">
                            {discount}% OFF
                        </div>
                    )}
                    
                    {/* New Badge */}
                    {product.isNew && (
                        <div className="absolute top-2 right-2 bg-black text-white text-xs font-medium px-2 py-1 rounded-md">
                            NEW
                        </div>
                    )}
                    
                    {/* Action buttons */}
                    <div className={`absolute bottom-2 right-2 flex flex-col gap-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                            onClick={toggleFavorite}
                            className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors shadow-sm"
                        >
                            <CiHeart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : ''}`} />
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            <CiShoppingCart className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                
                {/* Product Info */}
                <div className="mt-3">
                    {/* Season Tag */}
                    {product.season && (
                        <div className="text-xs text-gray-500 mb-1">
                            {product.season}
                        </div>
                    )}
                    
                    {/* Brand Name */}
                    <h3 className="text-sm font-medium text-gray-900">
                        {product.brand || 'Brand Name'}
                    </h3>
                    
                    {/* Product Name */}
                    <h4 className="text-sm text-gray-600 mt-1">
                        {product.name}
                    </h4>
                    
                    {/* Price */}
                    <div className="mt-1 flex items-baseline">
                        <span className="text-sm font-medium text-gray-900">
                            {currencySymbol}{formatPrice(product.price)}
                        </span>
                        {product.oldPrice && (
                            <span className="ml-2 text-sm line-through text-gray-500">
                                {currencySymbol}{formatPrice(product.oldPrice)}
                            </span>
                        )}
                    </div>
                    
                    {/* Rating */}
                    {product.ratings > 0 && (
                        <div className="mt-1 flex items-center">
                            <RatingStars rating={product.ratings} size="small" />
                            <span className="ml-1 text-xs text-gray-500">
                                ({product.numReviews || 0})
                            </span>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
