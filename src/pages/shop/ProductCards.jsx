import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import RatingStars from '../../components/RatingStars'
import SocialContactButtons from '../../components/SocialContactButtons'
import { motion } from 'framer-motion'
import { springAnimation } from '../../utils/animations';
import ImagePreviewModal from '../../components/ImagePreviewModal';
import { useCurrency } from '../../components/CurrencySwitcher';

const ProductCards = ({products}) => {
    const { formatPrice, currencySymbol } = useCurrency();
    const [previewImage, setPreviewImage] = useState({
        isOpen: false,
        url: '',
        name: ''
    });

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
            <motion.div 
                className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
            >
                {products.map((product) => (
                    <motion.div
                        key={product._id}
                        variants={{
                            hidden: { 
                                opacity: 0,
                                y: 50,
                                rotateX: 5,
                                scale: 0.9
                            },
                            show: { 
                                opacity: 1,
                                y: 0,
                                rotateX: 0,
                                scale: 1,
                                transition: springAnimation
                            }
                        }}
                        whileHover={{
                            scale: 1.05,
                            rotateY: 5,
                            boxShadow: "0px 20px 40px rgba(0,0,0,0.15)"
                        }}
                        className="rounded-lg overflow-hidden shadow-sm"
                    >
                        <div className='product__card relative group rounded-lg overflow-hidden'>
                            <div className='relative overflow-hidden rounded-lg' style={{ aspectRatio: '1/1' }}>
                                <Link to={`/product/${product._id}`}>
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg'
                                    />
                                </Link>
                                
                                <div 
                                    onClick={(e) => openPreview(e, product.image, product.name)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-8 w-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] hover:text-primary transition-colors" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                
                                {product.orderType === 'contact-to-order' && (
                                    <div className='absolute left-1/2 -translate-x-1/2 bottom-4 
                                                  px-6 py-2 bg-primary text-white rounded-md
                                                  whitespace-nowrap text-center'>
                                        Contact to Order
                                    </div>
                                )}
                            </div>
                            <div className='product__card__content mt-4 p-3'>
                                <h4 className='text-lg font-semibold truncate'>{product.name}</h4>
                                <p className='text-primary font-medium'>
                                    {product.orderType === 'contact-to-order' ? (
                                        'Price on Request'
                                    ) : (
                                        <>
                                            {currencySymbol}{formatPrice(product.price)} 
                                            {product.oldPrice && 
                                                <s className='ml-2 text-gray-500'>{currencySymbol}{formatPrice(product.oldPrice)}</s>
                                            }
                                        </>
                                    )}
                                </p>
                                <RatingStars rating={product.rating}/>
                                {product.orderType === 'contact-to-order' && (
                                    <SocialContactButtons productName={product.name} />
                                )}
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