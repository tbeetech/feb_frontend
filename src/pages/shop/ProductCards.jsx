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
    console.log(products)
  return (
    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {
            products.map((product, index)=>( 
                <div key={index} className='product__card relative'>
                    <div className='relative'>
                        <Link to={`/shop/${product._id}`}>
                        <img src={product.image} alt="product image" className='max-h-96 md:h-64 w-full object-cover hover:scale-105 transition-all duration-300'/>
                        </Link>
                        <button
                            onClick={(e)=>{
                                e.stopPropagation();
                                handleAddToCart(product)
                            }}
                            className='absolute bottom-0 left-0 right-0 bg-transparent text-white py-2 transition-all duration-300 hover:bg-primary hover:text-white'
                        >
                            Add to Cart
                        </button>
                    </div>
                    {/* product description */}
                    <div className='product__card__content'>
                        <h4>{product.name}</h4>
                        <p>₦{product.price} {product.oldPrice ? <s>₦{product?.oldPrice}</s> : null}</p>
                        <RatingStars rating={product.rating}/>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default ProductCards