import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import RatingStars from '../../components/RatingStars'
import SocialContactButtons from '../../components/SocialContactButtons'
import { motion } from 'framer-motion'
import { springAnimation } from '../../utils/animations';
import ImagePreviewModal from '../../components/ImagePreviewModal';
import { useCurrency } from '../../components/CurrencySwitcher';
import LazyImage from '../../components/Image';
import { FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
import ProductCardSkeleton from '../../components/ProductCardSkeleton';
import QuickViewModal from '../../components/QuickViewModal';

const ProductCards = ({ products, isLoading }) => {
    const { formatPrice, currencySymbol } = useCurrency();
    const [previewImage, setPreviewImage] = useState({
        isOpen: false,
        url: '',
        name: ''
    });
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const openPreview = (e, imageUrl, productName) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation(); // Prevent event bubbling
        setPreviewImage({
            isOpen: true,
            url: imageUrl,
            name: productName
        });
    };

    const closePreview = () => {
        setPreviewImage({
            isOpen: false,
            url: '',
            name: ''
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
                            className="group relative rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-xl transition duration-300"
                        >
                            <Link
                                to={`/product/${product._id}`}
                                className="block aspect-square overflow-hidden rounded-t-lg bg-gray-100"
                            >
                                <LazyImage
                                    src={product.image}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = 'https://placehold.co/400x400/png?text=Image+Not+Available';
                                    }}
                                    className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                                />
                                {product.discount > 0 && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                                        {Math.round((product.oldPrice - product.price) / product.oldPrice * 100)}% OFF
                                    </div>
                                )}
                                {product.stockStatus === 'Out of Stock' && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <p className="text-white font-bold text-lg">Out of Stock</p>
                                    </div>
                                )}
                            </Link>

                            <div className="p-4">
                                <Link to={`/product/${product._id}`} className="block">
                                    <h3 className="text-sm md:text-base font-medium text-gray-900 truncate">
                                        {product.name}
                                    </h3>
                                    <div className="mt-1 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatPrice(product.price, currencySymbol)}
                                            </p>
                                            {product.oldPrice > 0 && (
                                                <p className="text-xs text-gray-500 line-through">
                                                    {formatPrice(product.oldPrice, currencySymbol)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            <RatingStars rating={product.rating || 0} size="small" />
                                        </div>
                                    </div>
                                </Link>

                                <div className="mt-4 flex justify-between space-x-2">
                                    <button
                                        onClick={(e) => openPreview(e, product.image, product.name)}
                                        disabled={product.stockStatus === 'Out of Stock'}
                                        className={`flex-1 flex items-center justify-center text-xs sm:text-sm px-2 py-1.5 sm:py-2 rounded-md 
                                            ${product.stockStatus === 'Out of Stock' 
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                : 'bg-black text-white hover:bg-gray-800'
                                            } transition-colors`}
                                    >
                                        <span className="hidden sm:inline">Add to Cart</span>
                                        <FaShoppingCart className="sm:ml-1 text-xs sm:text-sm inline-block" />
                                    </button>
                                    <button
                                        onClick={() => handleQuickView(product)}
                                        className="p-1.5 sm:p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <FaEye className="text-xs sm:text-sm" />
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
    ).isRequired
}

export default ProductCards