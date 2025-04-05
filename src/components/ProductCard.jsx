import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUrl';

const ProductCard = ({ product }) => {
    return (
        <div className="relative group">
            <Link to={`/product/${product._id}`} className="block">
                {/* Product Image - Simplified to just show the image at full size */}
                <div className="relative overflow-hidden rounded-lg">
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
                </div>
                
                {/* Product Name - Minimal info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <h4 className="text-sm text-white">
                        {product.name}
                    </h4>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
