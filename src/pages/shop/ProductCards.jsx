import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImagePreviewModal from '../../components/ImagePreviewModal';
import { useCurrency } from '../../components/CurrencySwitcher';
import LazyImage from '../../components/Image';
import ProductCardSkeleton from '../../components/ProductCardSkeleton';
import QuickViewModal from '../../components/QuickViewModal';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

const ProductCards = ({ products, isLoading }) => {
    const { formatPrice, currencySymbol } = useCurrency();
    const dispatch = useDispatch();
    const [previewImage, setPreviewImage] = useState({
        isOpen: false,
        url: '',
        name: ''
    });
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Handle add to cart
    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (product.stockStatus === 'Out of Stock') return;
        
        dispatch(addToCart({
            ...product,
            quantity: 1
        }));
        // Toast is now handled by the cart slice
    };

    const closePreview = () => {
        setPreviewImage({
            isOpen: false,
            url: '',
            name: ''
        });
    };

    const openPreview = (e, imageUrl, productName) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation(); // Prevent event bubbling
        setPreviewImage({
            isOpen: true,
            url: imageUrl,
            name: productName
        });
    };

    const handleQuickView = (product) => {
        setSelectedProduct(product);
        setIsPreviewOpen(true);
    };

    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(8)].map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product, index) => (
                        <div
                            key={product._id}
                            className="group relative bg-white border border-gray-200 rounded-none overflow-hidden transition duration-300 hover:shadow-sm"
                        >
                            <Link
                                to={`/product/${product._id}`}
                                className="block aspect-square overflow-hidden bg-gray-50"
                            >
                                <LazyImage
                                    src={product.image}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = 'https://placehold.co/400x400/png?text=Image+Not+Available';
                                    }}
                                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                />
                                {product.discount > 0 && (
                                    <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-xs font-medium">
                                        SALE
                                    </div>
                                )}
                                {product.stockStatus === 'Out of Stock' && (
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                        <p className="text-white font-medium text-base uppercase tracking-wide">Out of Stock</p>
                                    </div>
                                )}
                            </Link>

                            <div className="p-4 text-center">
                                <Link to={`/product/${product._id}`} className="block">
                                    <h3 className="text-sm md:text-base font-medium text-gray-900 mb-2">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-center space-x-2">
                                        <p className="text-sm font-medium text-gray-900">
                                            {currencySymbol}{formatPrice(product.price)}
                                        </p>
                                        {product.oldPrice > 0 && (
                                            <p className="text-xs text-gray-500 line-through">
                                                {currencySymbol}{formatPrice(product.oldPrice)}
                                            </p>
                                        )}
                                    </div>
                                </Link>

                                <div className="mt-4 flex justify-center">
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        disabled={product.stockStatus === 'Out of Stock'}
                                        className={`flex items-center justify-center text-xs sm:text-sm px-4 py-2 border
                                            ${product.stockStatus === 'Out of Stock' 
                                                ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                : 'border-black bg-white text-black hover:bg-black hover:text-white'
                                            } transition-colors`}
                                    >
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10">
                    <img src="/assets/images/empty-box.png" alt="No products found" className="w-32 h-32 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
            )}
            
            <ImagePreviewModal 
                isOpen={previewImage.isOpen}
                imageUrl={previewImage.url}
                productName={previewImage.name}
                onClose={closePreview}
            />
            <QuickViewModal 
                isOpen={isPreviewOpen} 
                product={selectedProduct} 
                onClose={() => setIsPreviewOpen(false)} 
            />
        </div>
    )
}

ProductCards.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            oldPrice: PropTypes.number,
            rating: PropTypes.number,
            orderType: PropTypes.string
        })
    ).isRequired,
    isLoading: PropTypes.bool
}

export default ProductCards