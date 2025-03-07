import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import RatingStars from '../../../components/RatingStars';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { addToCart, decrementQuantity } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';
import SocialContactButtons from '../../../components/SocialContactButtons';
import { motion } from 'framer-motion';

const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { data, error, isLoading } = useFetchProductByIdQuery(id);
    const singleProduct = data?.product || {};
    const productReviews = data?.reviews || [];
    
    // Get cart state to check if product exists
    const cartProducts = useSelector(state => state.cart.products);
    const productInCart = cartProducts.find(product => product._id === id);
    const quantity = productInCart ? productInCart.quantity : 0;

    // Separate add to cart handler
    const handleAddToCart = (product) => {
        // Add product with current quantity if it's not in cart
        if (!productInCart) {
            dispatch(addToCart({ ...product, quantity: 1 }));
        }
    };

    const handleIncrement = (product) => {
        dispatch(addToCart(product));
    };

    const handleDecrement = (product) => {
        dispatch(decrementQuantity(product));
    };

    // Add zoom state
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (isZoomed) {
            const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - left) / width * 100;
            const y = (e.clientY - top) / height * 100;
            setZoomPosition({ x, y });
        }
    };

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error loading product</p>
    console.log(id)
    return (
        <>
            <section className='section__container bg-primary-light pt-28 pb-8'>
                <h2 className='section__header capitalize'>Single Product Page</h2>
                <div>
                    <span className='hover:text-primary'><Link to="/">home</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'><Link to="/shop">shop</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'>{singleProduct.name}</span>

                </div>
            </section>

            <motion.section 
                className="section__container mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Enhanced product image with zoom */}
                    <motion.div 
                        className="relative overflow-hidden rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        onHoverStart={() => setIsZoomed(true)}
                        onHoverEnd={() => setIsZoomed(false)}
                        onMouseMove={handleMouseMove}
                    >
                        <motion.img
                            src={singleProduct.image}
                            alt={singleProduct.name}
                            className="w-full h-auto transform hover:scale-150"
                            style={{ 
                                transformOrigin: 'center',
                                cursor: 'zoom-in'
                            }}
                        />
                        {/* Thumbnail Gallery */}
                        <div className="flex gap-2 mt-4">
                            {singleProduct.gallery?.map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-20 h-20 border rounded cursor-pointer"
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    
                    {/* Product details with animations */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className='text-2xl font-semibold mb-4'>{singleProduct?.name}</h3>
                        <p className='text-x1 text-primary mb-4'>
                            ₦{singleProduct?.price}
                            {singleProduct?.oldPrice && <s className='ml-1'>₦{singleProduct?.oldPrice}</s>}
                        </p>
                        <p className="text-gray-400 mb-4">{singleProduct?.description}</p>

                        {/* additional product info */}
                        <div className='flex flex-col space-y-2'>
                            <p><strong>Category:</strong> {singleProduct?.category}</p>
                            <div className='flex gap-1 items-center'>
                                <strong>Rating: </strong>
                                <RatingStars rating={singleProduct?.rating} />

                            </div>

                        </div>
                        
                        {singleProduct.orderType === 'contact-to-order' ? (
                            <div className="mt-6">
                                <p className="text-lg font-semibold mb-4">Contact us to order this product:</p>
                                <SocialContactButtons productName={singleProduct.name} />
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center space-x-4 mt-4">
                                    <button
                                        onClick={() => handleDecrement(singleProduct)}
                                        className="px-3 py-1 bg-gray-200 rounded-md"
                                        disabled={quantity === 0}
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={() => handleIncrement(singleProduct)}
                                        className="px-3 py-1 bg-gray-200 rounded-md"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(singleProduct)}
                                    className="mt-6 px-6 py-3 bg-primary text-white rounded-md"
                                    disabled={productInCart} // Disable if product is already in cart
                                >
                                    {productInCart ? 'Already in Cart' : 'Add to Cart'}
                                </button>
                            </>
                        )}
                    </motion.div>
                </div>
            </motion.section>

            <section className='section__container mt-8'>
                <ReviewsCard
                productReviews = {productReviews}
                 />
            </section>
        </>
    )
}

export default SingleProduct