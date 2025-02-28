import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProductCards from '../shop/ProductCards'
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi'
import CategoryHeader from '../../components/CategoryHeader';

const CategoryPage = () => {    
    const { categoryName, subcategory } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;
    
    // Clean and normalize category
    const cleanCategoryName = categoryName?.toLowerCase();

    // Only include subcategory in query if it exists
    const queryParams = {
        page: currentPage,
        limit: productsPerPage,
        category: cleanCategoryName,
        ...(subcategory && { subcategory: subcategory.toLowerCase().replace(/\s+/g, '-') })
    };

    const { data, isLoading, error } = useFetchAllProductsQuery(queryParams, {
        skip: !cleanCategoryName
    });

    const { products = [], totalPages = 0, totalProducts = 0 } = data || {};

    useEffect(() => {
        window.scrollTo(0, 0);
        setCurrentPage(1);
    }, [categoryName, subcategory]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0);
        }
    };

    // Debug logs
    console.log('Category Page Query:', queryParams);
    console.log('API Response:', data);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        console.error('API Error:', error);
        return (
            <div className="text-center py-8 text-red-500">
                Error loading products: {error.message}
            </div>
        );
    }

    const displayName = subcategory 
        ? `${categoryName} - ${subcategory.replace(/-/g, ' ')}` 
        : categoryName;

    return (
        <>
            <CategoryHeader 
                categoryName={categoryName}
                subcategory={subcategory}
                products={products}
            />

            <div className="section__container">
                {products.length > 0 ? (
                    <>
                        <ProductCards products={products}/>
                        {totalPages > 1 && (
                            <div className='mt-8 flex justify-center gap-2'>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50'
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handlePageChange(idx + 1)}
                                        className={`px-4 py-2 rounded-md ${
                                            currentPage === idx + 1
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50'
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No products found in this category.
                    </div>
                )}
            </div>
        </>
    )
}

export default CategoryPage