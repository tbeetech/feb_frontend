import React from 'react'
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../constants/categoryConstants';

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters, onPriceRangeChange, closeMobileFilter }) => {
    const navigate = useNavigate();

    const handleCategoryChange = (category) => {
        setFiltersState(prev => ({
            ...prev,
            category,
            subcategory: '' // Reset subcategory when category changes
        }));
        // Remove immediate navigation - let user select subcategory first
    };

    const handleSubcategoryChange = (subcategory) => {
        setFiltersState(prev => ({
            ...prev,
            subcategory
        }));
        navigate(`/categories/${filtersState.category}/${subcategory}`);
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

    // Get subcategories based on selected category
    const getSubcategories = () => {
        if (filtersState.category === 'accessories') {
            return CATEGORIES.ACCESSORIES.subcategories.map(sub => ({
                value: sub,
                label: sub.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')
            }));
        }
        if (filtersState.category === 'fragrance') {
            return CATEGORIES.FRAGRANCE.subcategories.map(sub => ({
                value: sub,
                label: sub.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')
            }));
        }
        return [];
    };

    const subcategories = getSubcategories();

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
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

            {/* Show subcategories immediately after selecting main category */}
            {(filtersState.category === 'accessories' || filtersState.category === 'fragrance') && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className='mb-8 overflow-hidden'
                >
                    <h3 className='font-medium mb-4'>Select Subcategory</h3>
                    <div className='space-y-2'>
                        {subcategories.map((sub) => (
                            <label key={sub.value} className='flex items-center'>
                                <input
                                    type='radio'
                                    name='subcategory'
                                    checked={filtersState.subcategory === sub.value}
                                    onChange={() => {
                                        setFiltersState(prev => ({
                                            ...prev,
                                            subcategory: sub.value
                                        }));
                                        navigate(`/categories/${filtersState.category}/${sub.value}`);
                                    }}
                                    className='mr-2'
                                />
                                {sub.label}
                            </label>
                        ))}
                    </div>
                </motion.div>
            )}

            <div className='mb-8'>
                <h3 className='font-medium mb-4'>Price Range</h3>
                <div className='space-y-2'>
                    {filters.priceRanges.map((range, index) => (
                        <label key={index} className='flex items-center'>
                            <input
                                type='radio'
                                name='priceRange'
                                checked={filtersState.priceRange === `${range.min}-${range.max === Infinity ? 'Infinity' : range.max}`}
                                onChange={() => onPriceRangeChange(range)}
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