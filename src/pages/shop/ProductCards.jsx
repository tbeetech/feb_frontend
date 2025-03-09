import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import RatingStars from '../../components/RatingStars'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'
import SocialContactButtons from '../../components/SocialContactButtons'
import { motion } from 'framer-motion'
import { springAnimation } from '../../utils/animations';
import ImagePreviewModal from '../../components/ImagePreviewModal';

const ProductCards = ({products}) => {
    const dispatch = useDispatch()
    const [previewImage, setPreviewImage] = useState({
        isOpen: false,
        url: '',
        name: ''
    });

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
        alert("Item added to cart");
    }

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
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.3
                        }
                    }
                }}
                initial="hidden"
                animate="show"
            >
                {products.map((product, index)=>( 
                    <motion.div
                        key={index}
                        className="product-card-magnetic glass-morphism"
                        variants={{
                            hidden: { 
                                opacity: 0,
                                y: 50,
                                rotateX: 80,
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
                                
                                {product.orderType !== 'contact-to-order' ? (
                                    <button
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            handleAddToCart(product)
                                        }}
                                        className='absolute left-1/2 -translate-x-1/2 bottom-4 
                                                 px-6 py-2 bg-black/70 text-white
                                                 transition-colors duration-300 
                                                 hover:bg-gold rounded-md
                                                 whitespace-nowrap
                                                 border-2 border-gold'
                                    >
                                        Add to Cart
                                    </button>
                                ) : (
                                    <div className='absolute left-1/2 -translate-x-1/2 bottom-4 
                                                  px-6 py-2 bg-primary text-white rounded-md
                                                  whitespace-nowrap text-center'>
                                        Contact to Order
                                    </div>
                                )}
                            </div>
                            <div className='product__card__content mt-4'>
                                <h4 className='text-lg font-semibold truncate'>{product.name}</h4>
                                <p className='text-primary font-medium'>
                                    {product.orderType === 'contact-to-order' ? (
                                        'Price on Request'
                                    ) : (
                                        <>
                                            ₦{product.price.toLocaleString()} 
                                            {product.oldPrice && 
                                                <s className='ml-2 text-gray-500'>₦{product.oldPrice.toLocaleString()}</s>
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

export default ProductCards