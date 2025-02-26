import React, {useEffect} from 'react'
import { useParams } from 'react-router-dom'
import ProductCards from '../shop/ProductCards'
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi'

const CategoryPage = () => {    
    const {categoryName, subcategory} = useParams();
    
    // Clean up category and subcategory names
    const cleanCategoryName = categoryName?.toLowerCase();
    const cleanSubcategory = subcategory?.toLowerCase().replace(/-/g, ' ');
    
    const { data: { products = [] } = {}, isLoading, error } = useFetchAllProductsQuery({
        category: cleanCategoryName,
        subcategory: cleanSubcategory
    }, {
        skip: !cleanCategoryName
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [categoryName, subcategory]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading products</div>;

    return (
        <>
            <section className='w-full bg-primary-light py-16 mb-8'>
                <div className='section__container'>
                    <h2 className='section__header capitalize text-3xl md:text-4xl'>
                        {subcategory ? `${categoryName} - ${subcategory}` : categoryName}
                    </h2>
                    <p className='section__subheader text-lg'>
                        Browse our collection of {subcategory || categoryName} products
                    </p>
                </div>
            </section>

            <div className="section__container">
                {products.length > 0 ? (
                    <ProductCards products={products}/>
                ) : (
                    <p className="text-center text-gray-500 py-8">
                        No products found in this category.
                    </p>
                )}
            </div>
        </>
    )
}

export default CategoryPage