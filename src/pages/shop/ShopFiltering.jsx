import React from 'react'

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters, closeMobileFilter }) => {
    const handleCategoryChange = (category) => {
        setFiltersState(prev => ({
            ...prev,
            category,
            subcategory: '', // Reset subcategory when category changes
        }));
    };

    const handleSubcategoryChange = (subcategory) => {
        setFiltersState(prev => ({
            ...prev,
            subcategory: subcategory.value, // Use the value from the subcategory object
        }));
    };

    const handlePriceRangeChange = (range) => {
        setFiltersState(prev => ({
            ...prev,
            priceRange: `${range.min}-${range.max}`,
        }));
    };

    return (
        <div className='w-64 flex-shrink-0'>
            <div className='mb-8'>
                <h3 className='font-medium mb-4'>Categories</h3>
                <div className='space-y-2'>
                    <label className='flex items-center'>
                        <input
                            type='radio'
                            name='category'
                            checked={filtersState.category === 'all'}
                            onChange={() => handleCategoryChange('all')}
                            className='mr-2'
                        />
                        All Products
                    </label>
                    {Object.keys(filters.categories).filter(cat => cat !== 'all').map(category => (
                        <label key={category} className='flex items-center'>
                            <input
                                type='radio'
                                name='category'
                                checked={filtersState.category === category}
                                onChange={() => handleCategoryChange(category)}
                                className='mr-2'
                            />
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </label>
                    ))}
                </div>
            </div>

            {filtersState.category !== 'all' && filters.categories[filtersState.category]?.length > 0 && (
                <div className='mb-8'>
                    <h3 className='font-medium mb-4'>Subcategories</h3>
                    <div className='space-y-2'>
                        {filters.categories[filtersState.category].map((subcategory) => (
                            <label key={subcategory.value} className='flex items-center'>
                                <input
                                    type='radio'
                                    name='subcategory'
                                    checked={filtersState.subcategory === subcategory.value}
                                    onChange={() => handleSubcategoryChange(subcategory)}
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
                }}
                className='w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300'
            >
                Clear Filters
            </button>
        </div>
    )
}

export default ShopFiltering