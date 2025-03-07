import React from 'react'
import { Link } from 'react-router-dom'
import RatingStars from '../../components/RatingStars'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'
import SocialContactButtons from '../../components/SocialContactButtons'
import { motion } from 'framer-motion'
import { springAnimation } from '../../utils/animations';

const ProductCards = ({products}) => {
    const dispatch = useDispatch()
    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
        alert("Item added to cart");
    }

    return (
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
    )
}

export default ProductCards