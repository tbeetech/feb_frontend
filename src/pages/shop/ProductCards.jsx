import React from 'react'
import { Link } from 'react-router-dom'
import RatingStars from '../../components/RatingStars'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'

const ProductCards = ({products}) => {
    const dispatch = useDispatch()
    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
        alert("Item added to cart");
    }

    return (
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
            {products.map((product, index)=>( 
                <div key={index} className='product__card relative group'>
                    <div className='relative aspect-square overflow-hidden'>
                        <Link to={`/product/${product._id}`}>
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                style={{ aspectRatio: '1/1' }}
                            />
                        </Link>
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
                    </div>
                    <div className='product__card__content mt-4'>
                        <h4 className='text-lg font-semibold truncate'>{product.name}</h4>
                        <p className='text-primary font-medium'>
                            ₦{product.price.toLocaleString()} 
                            {product.oldPrice && 
                                <s className='ml-2 text-gray-500'>₦{product.oldPrice.toLocaleString()}</s>
                            }
                        </p>
                        <RatingStars rating={product.rating}/>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProductCards