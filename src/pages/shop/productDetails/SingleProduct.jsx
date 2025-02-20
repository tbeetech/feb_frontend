import React from 'react'
import { Link, useParams } from 'react-router-dom'
import RatingStars from '../../../components/RatingStars';
const SingleProduct = () => {
    const {id} = useParams();
    console.log(id)
    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>Single Product Page</h2>
                <div>
                    <span className='hover:text-primary'><Link to="/">home</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'><Link to="/shop"></Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'>Product name</span>
                
                </div>
            </section>

            <section className="section__container mt-8">
                <div>
                    {/* product image */}
                    <div>
                        <img className="rounded-md w-full h-auto" src="https://i.pinimg.com/736x/cd/2a/c7/cd2ac7b87d96bf1f7056cfdcfeac6fc9.jpg" alt="" />
                    </div>
                    <div className="md:w-1/2 w-full">
                    <h3 className='text-2xl font-semibold mb-4'>Product Name</h3>
                    <p className='text-x1 text-primary mb-4'>₦50000 <s>₦80000</s></p>
                    <p className="text-gray-400 mb-4">This is a product description</p>

                    {/* additional product info */}
                    <div>
                        <p><strong>Category:</strong> accessories</p>
                        <p><strong>Color:</strong> beige</p>
                        <div className='flex gap-1 items-center'>
                            <strong>Rating: </strong>
                            <RatingStars rating={"4"}/>

                        </div>

                    </div>
                            <button className="mt-6 px-6 py-3 bg-primary text-white rounded-md">
                                Add to Cart
                            </button>
                    </div>
                </div>

            </section>

            <section className='section__container mt-8'>
                Review here

            </section>
        </>
    )
}

export default SingleProduct