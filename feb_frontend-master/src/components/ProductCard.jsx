import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getImageUrl } from '../../utils/imageUrl';

const ProductCard = ({ product }) => {
    return (
        <div className="relative group">
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
            
            {/* Product Name and Buy Now Button */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 flex flex-col">
                <h4 className="text-sm text-white mb-2">
                    {product.name}
                </h4>
                <Link 
                    to={`/product/${product._id}`}
                    className="w-full bg-black text-white text-sm font-medium py-1.5 px-3 rounded-sm hover:bg-black/90 transition-colors text-center"
                >
                    Buy Now
                </Link>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};

export default ProductCard;
