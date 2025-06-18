import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImagePreviewModal from '../../components/ImagePreviewModal';
import { useCurrency } from '../../components/CurrencySwitcher';
import ProductCardSkeleton from '../../components/ProductCardSkeleton';
import QuickViewModal from '../../components/QuickViewModal';

const ProductCards = ({ products, isLoading, viewMode }) => {
    const { formatPrice, currencySymbol } = useCurrency();
    const [previewImage, setPreviewImage] = useState({
        isOpen: false,
        url: '',
        name: ''
    });
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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
                <div className={`grid ${
                    viewMode === 'grid' 
                        ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                        : 'grid-cols-1'
                } gap-4 md:gap-6`}>
                    {[...Array(8)].map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className={`grid ${
                    viewMode === 'grid' 
                        ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                        : 'grid-cols-1'
                } gap-4 md:gap-6`}>
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className={`group relative bg-white border border-gray-200 rounded-none overflow-hidden transition duration-300 hover:shadow-sm ${
                                viewMode === 'list' ? 'flex gap-4' : ''
                            }`}
                        >
                            {/* Product Image */}
                            <div className={`${viewMode === 'list' ? 'w-48 h-48' : 'w-full'} relative`}>
                                <Link 
                                    to={`/product/${product._id}`}
                                    className="group relative block bg-gray-100 rounded-lg overflow-hidden h-full"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            openPreview(e, product.image, product.name);
                                        }}
                                    />
                                    
                                    {/* Quick View Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleQuickView(product);
                                        }}
                                        className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Quick View
                                    </button>

                                    {/* Stock Status Badge */}
                                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium 
                                        ${product.stockStatus === 'In Stock' 
                                            ? 'bg-green-100 text-green-800' 
                                            : product.stockStatus === 'Pre Order'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {product.stockStatus}
                                    </div>
                                </Link>
                            </div>

                            {/* Product Info */}
                            <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : 'text-center'}`}>
                                <Link to={`/product/${product._id}`} className="block">
                                    <h3 className="text-sm md:text-base font-medium text-gray-900 mb-2">
                                        {product.name}
                                    </h3>
                                    <div className={`flex items-center ${viewMode === 'list' ? '' : 'justify-center'} space-x-2`}>
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

                                <div className={`mt-4 ${viewMode === 'list' ? '' : 'flex justify-center'}`}>
                                    <Link
                                        to={`/product/${product._id}`}
                                        className="w-full bg-black text-white text-sm font-medium py-1.5 px-3 rounded-sm hover:bg-black/90 transition-colors text-center inline-block"
                                    >
                                        Buy Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10">
                    <img src="/assets/images/empty-box.png" alt="No products found" className="w-32 h-32 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filter to find what you&apos;re looking for.</p>
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
            stockStatus: PropTypes.oneOf(['In Stock', 'Pre Order', 'Out of Stock']).isRequired
        })
    ).isRequired,
    isLoading: PropTypes.bool,
    viewMode: PropTypes.oneOf(['grid', 'list'])
}

ProductCards.defaultProps = {
    isLoading: false,
    viewMode: 'grid'
}

export default ProductCards