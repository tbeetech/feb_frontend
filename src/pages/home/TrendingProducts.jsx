import React from 'react'
import TrendingProductSlider from '../../components/TrendingProductSlider'
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi'

const TrendingProducts = () => {
    const { data: { products = [] } = {}, isLoading } = useFetchAllProductsQuery({});

    if (isLoading) return <div>Loading...</div>;

    return (
        <section className='section__container'>
            <h2 className='section__header'>Trending Products</h2>
            <p className='section__subheader'>
                Explore our curated collection of trending products
            </p>
            <div className="mt-8">
                <TrendingProductSlider products={products} />
            </div>
        </section>
    )
}

export default TrendingProducts
