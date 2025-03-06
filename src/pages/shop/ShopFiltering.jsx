import React from 'react'
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../constants/categoryConstants';

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters, closeMobileFilter }) => {
    const navigate = useNavigate();

    const handleCategoryChange = (category) => {
        setFiltersState(prev => ({
            ...prev,
            category,
            subcategory: '', // Reset subcategory when category changes
        }));

        // Navigate to the appropriate route
        navigate(`/categories/${category}`);
    };

    // Create an array of all categories including the new ones
    const allCategories = [
        { value: 'all', label: 'All Products' },
        { value: 'accessories', label: 'Accessories' },
        { value: 'fragrance', label: 'Fragrance' },
        { value: 'corporate', label: 'Corporate Wears' },
        { value: 'dress', label: 'Dresses' },
        { value: 'new', label: 'New Arrivals' },
        { value: 'shoes', label: 'Shoes' },
        { value: 'bags', label: 'Bags' },
        { value: 'clothes', label: 'Clothes' },
    ];

    return (
        <div className='w-64 flex-shrink-0'>
            <div className='mb-8'>
                <h3 className='font-medium mb-4'>Categories</h3>
                <div className='space-y-2'>
                    {allCategories.map(category => (
                        <label key={category.value} className='flex items-center'>
                            <input
                                type='radio'
                                name='category'
                                checked={filtersState.category === category.value}
                                onChange={() => handleCategoryChange(category.value)}
                                className='mr-2'
                            />
                            {category.label}
                        </label>
                    ))}
                </div>
            </div>

            {filtersState.category !== 'all' && 
             CATEGORIES[filtersState.category.toUpperCase()]?.subcategories?.length > 0 && (
                <div className='mb-8'>
                    <h3 className='font-medium mb-4'>Subcategories</h3>
                    <div className='space-y-2'>
                        {CATEGORIES[filtersState.category.toUpperCase()].subcategories.map((subcategory) => (
                            <label key={subcategory.value} className='flex items-center'>
                                <input
                                    type='radio'
                                    name='subcategory'
                                    checked={filtersState.subcategory === subcategory.value}
                                    onChange={() => {
                                        setFiltersState(prev => ({
                                            ...prev,
                                            subcategory: subcategory.value
                                        }));
                                        navigate(`/categories/${filtersState.category}/${subcategory.value}`);
                                    }}
                                    className='mr-2'
                                />
                                {subcategory.label}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <div className='mb-8'>
                <h3 className='font-medium mb-4'>Price Range</h3>
                <div className='space-y-2'>
                    {filters.priceRanges.map((range, index) => (
                        <label key={index} className='flex items-center'>
                            <input
                                type='radio'
                                name='priceRange'
                                checked={filtersState.priceRange === `${range.min}-${range.max}`}
                                onChange={() => handlePriceRangeChange(range)}
                                className='mr-2'
                            />
                            {range.label}
                        </label>
                    ))}
                </div>
            </div>

            <button
                onClick={() => {
                    clearFilters();
                    closeMobileFilter();
                    navigate('/shop');
                }}
                className='w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300'
            >
                Clear Filters
            </button>
        </div>
    );
};

export default ShopFiltering;