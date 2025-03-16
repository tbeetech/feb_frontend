import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RatingStars from '../../components/RatingStars';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { motion } from 'framer-motion';
import { springAnimation } from '../../utils/animations';
import ImagePreviewModal from '../../components/ImagePreviewModal';

const ProductCards = ({products}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState({
        isOpen: false,
        url: '',
        name: ''
    });

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        alert("Item added to cart");
    };

    const handlePreOrder = (product) => {
        dispatch(addToCart(product));
        navigate('/checkout', { state: { total: product.price, isPreOrder: true } });
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

    const closePreview = () => {
        setPreviewImage({
            isOpen: false,
            url: '',
            name: ''
        });
    };

    return (
        <>
            <motion.div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
                {products.map((product) => (
                    <motion.div
                        key={product._id}
                        {...springAnimation}
                        className="product__card bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                        <div className='product__card relative group'>
                            <div className='relative aspect-square overflow-hidden'>
                                <Link to={`/product/${product._id}`}>
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                        style={{ aspectRatio: '1/1' }}
                                    />
                                </Link>
                                
                                {/* Eye peek icon without any button styling */}
                                <div 
                                  onClick={(e) => openPreview(e, product.image, product.name)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                                >
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="text-white h-6 w-6 md:h-7 md:w-7 drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] hover:text-primary transition-colors" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </div>
                                
                                {product.stockStatus === 'Pre Order' ? (
                                    <button
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            handlePreOrder(product);
                                        }}
                                        className='absolute left-1/2 -translate-x-1/2 bottom-2 md:bottom-4 
                                                 px-4 py-1 md:px-6 md:py-2 bg-primary text-white
                                                 text-xs md:text-sm
                                                 transition-colors duration-300 
                                                 hover:bg-primary-dark rounded-md
                                                 whitespace-nowrap
                                                 border border-gold md:border-2'
                                    >
                                        Pre Order
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            handleAddToCart(product);
                                        }}
                                        className='absolute left-1/2 -translate-x-1/2 bottom-2 md:bottom-4 
                                                 px-4 py-1 md:px-6 md:py-2 bg-black/70 text-white
                                                 text-xs md:text-sm
                                                 transition-colors duration-300 
                                                 hover:bg-gold rounded-md
                                                 whitespace-nowrap
                                                 border border-gold md:border-2'
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                            
                            <div className='product__card__content p-2 md:p-4'>
                                <h3 className='text-sm md:text-base font-semibold truncate'>{product.name}</h3>
                                <p className='text-primary text-sm md:text-base font-medium'>
                                    ₦{product.price?.toLocaleString()} 
                                    {product.oldPrice && 
                                        <s className='ml-1 md:ml-2 text-gray-500 text-xs md:text-sm'>₦{product.oldPrice.toLocaleString()}</s>
                                    }
                                </p>
                                <RatingStars rating={product.rating}/>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            
            <ImagePreviewModal 
                isOpen={previewImage.isOpen}
                imageUrl={previewImage.url}
                productName={previewImage.name}
                onClose={closePreview}
            />
        </>
    );
};

export default ProductCards;
