import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProductCards from '../shop/ProductCards'
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi'
import CategoryHeader from '../../components/CategoryHeader';
import { CATEGORIES } from '../../constants/categoryConstants';
import ProductCardSkeleton from '../../components/ProductCardSkeleton';

const CategoryPage = () => {    
    const { categoryName, subcategory } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;
    
    // Clean and normalize category
    const cleanCategoryName = categoryName?.toLowerCase().trim();
    const cleanSubcategory = subcategory?.toLowerCase().trim().replace(/\s+/g, '-');

    // Check if category exists in our constants
    useEffect(() => {
        if (cleanCategoryName) {
            const categoryExists = Object.values(CATEGORIES).some(
                cat => cat.name.toLowerCase() === cleanCategoryName
            );
            
            if (!categoryExists) {
                console.error(`Category not found: ${cleanCategoryName}`);
                // Can redirect to 404 or shop page if needed
            }
            
            // If subcategory is provided, check if it exists in the category
            if (cleanSubcategory && categoryExists) {
                const category = Object.values(CATEGORIES).find(
                    cat => cat.name.toLowerCase() === cleanCategoryName
                );
                
                if (category && category.subcategories) {
                    const subcategoryExists = category.subcategories.some(
                        sub => (typeof sub === 'string' 
                            ? sub.toLowerCase() === cleanSubcategory 
                            : sub.value.toLowerCase() === cleanSubcategory)
                    );
                    
                    if (!subcategoryExists) {
                        console.error(`Subcategory not found: ${cleanSubcategory} in ${cleanCategoryName}`);
                        // Can redirect to category page or show error
                    }
                }
            }
        }
    }, [cleanCategoryName, cleanSubcategory]);

    // Only include subcategory in query if it exists
    const queryParams = {
        page: currentPage,
        limit: productsPerPage,
        category: cleanCategoryName,
        ...(cleanSubcategory && { subcategory: cleanSubcategory })
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

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="w-full bg-gray-200 h-40 animate-pulse rounded-lg mb-8"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(8)].map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        console.error('API Error:', error);
        return (
            <div className="text-center py-8 text-red-500">
                <h3 className="text-xl font-medium mb-2">Error loading products</h3>
                <p>{error.message || 'Please try again later'}</p>
                <button 
                    onClick={() => navigate('/shop')}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                    Go to Shop
                </button>
            </div>
        );
    }

    const displayCategory = Object.values(CATEGORIES).find(
        cat => cat.name.toLowerCase() === cleanCategoryName
    );
    
    const displaySubcategory = cleanSubcategory && displayCategory?.subcategories?.find(
        sub => (typeof sub === 'string' 
            ? sub.toLowerCase() === cleanSubcategory 
            : sub.value.toLowerCase() === cleanSubcategory)
    );
    
    const displayName = displaySubcategory 
        ? `${displayCategory.name} - ${typeof displaySubcategory === 'string' 
            ? displaySubcategory.replace(/-/g, ' ') 
            : displaySubcategory.label}`
        : cleanCategoryName;

    return (
        <>
            <CategoryHeader 
                categoryName={cleanCategoryName}
                subcategory={cleanSubcategory}
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
                                    className='px-4 py-2 text-gray-700 border border-gray-300 hover:border-gold hover:text-gold disabled:opacity-50 disabled:hover:border-gray-300 transition-all duration-300'
                                >
                                    <span className="material-icons">navigate_before</span>
                                </button>
                                {[...Array(totalPages)].map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handlePageChange(idx + 1)}
                                        className={`px-4 py-2 border transition-all duration-300 ${
                                            currentPage === idx + 1
                                                ? 'border-gold bg-gold/5 text-gold'
                                                : 'border-gray-300 text-gray-700 hover:border-gold hover:text-gold'
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className='px-4 py-2 text-gray-700 border border-gray-300 hover:border-gold hover:text-gold disabled:opacity-50 disabled:hover:border-gray-300 transition-all duration-300'
                                >
                                    <span className="material-icons">navigate_next</span>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <span className="material-icons text-gold text-5xl mb-4">inventory_2</span>
                        <p className="mb-4 text-lg">No products found in this category.</p>
                        <button 
                            onClick={() => navigate('/shop')}
                            className="px-6 py-3 bg-gold text-white rounded-md hover:bg-gold-dark transition-colors duration-300 flex items-center gap-2 mx-auto"
                        >
                            <span className="material-icons">shopping_bag</span>
                            Browse All Products
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default CategoryPage