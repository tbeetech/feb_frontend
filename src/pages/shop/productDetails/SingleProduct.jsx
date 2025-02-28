import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import RatingStars from '../../../components/RatingStars';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { addToCart, decrementQuantity } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';

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

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error loading product</p>
    console.log(id)
    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>Single Product Page</h2>
                <div>
                    <span className='hover:text-primary'><Link to="/">home</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'><Link to="/shop">shop</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'>{singleProduct.name}</span>

                </div>
            </section>

            <section className="section__container mt-8">
                <div>
                    {/* product image */}
                    <div>
                        <img className="rounded-md w-full h-auto" src={singleProduct.image} alt="" />
                    </div>
                    <div className="md:w-1/2 w-full">
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
                    </div>
                </div>

            </section>

            <section className='section__container mt-8'>
                <ReviewsCard
                productReviews = {productReviews}
                 />
            </section>
        </>
    )
}

export default SingleProduct