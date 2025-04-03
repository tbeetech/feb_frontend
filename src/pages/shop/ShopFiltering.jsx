import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../constants/categoryConstants';
import { CiFilter, CiCirclePlus, CiCircleMinus, CiTrash } from 'react-icons/ci';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters, onPriceRangeChange, closeMobileFilter }) => {
    const navigate = useNavigate();
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        price: true
    });
    
    // Track which category groups are expanded
    const [expandedCategories, setExpandedCategories] = useState({});

    // When filtersState.category changes, expand that category
    useEffect(() => {
        if (filtersState.category && filtersState.category !== 'all') {
            setExpandedCategories(prev => ({
                ...prev,
                [filtersState.category]: true
            }));
        }
    }, [filtersState.category]);

    const handleCategoryChange = (category) => {
        // Set selected category in filter state
        setFiltersState(prev => ({
            ...prev,
            category,
            subcategory: '' // Reset subcategory when category changes
        }));
        
        if (category === 'all') {
            navigate('/shop');
        } else {
            navigate(`/categories/${category}`);
        }
    };

    const handleSubcategoryChange = (category, subcategory) => {
        setFiltersState(prev => ({
            ...prev,
            category,
            subcategory
        }));
        
        if (category && subcategory) {
            navigate(`/categories/${category}/${subcategory}`);
        }
    };
    
    // Toggle section expansion
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };
    
    // Toggle category expansion
    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    // Create an array of all categories
    const allCategories = [
        { value: 'all', label: 'All Products', icon: '🛍️' },
        { value: 'new', label: 'New Arrivals', icon: '✨' },
        { value: 'clothes', label: 'Clothing', icon: '👕' },
        { value: 'dress', label: 'Dresses', icon: '👗' },
        { value: 'shoes', label: 'Shoes', icon: '👠' },
        { value: 'bags', label: 'Bags', icon: '👜' },
        { value: 'accessories', label: 'Accessories', icon: '⌚' },
        { value: 'fragrance', label: 'Fragrances', icon: '🧴' },
        { value: 'corporate', label: 'Corporate Wear', icon: '👔' },
    ];

    // Get subcategories based on selected category
    const getSubcategories = (category) => {
        if (!category || category === 'all') return [];
        
        // Check if the category exists in CATEGORIES
        const categoryData = CATEGORIES[category?.toUpperCase()];
        if (!categoryData) return [];
        
        // Make sure subcategories is an array before mapping
        const subcategoryList = categoryData.subcategories || [];
        
        // Map subcategories with type checking
        return subcategoryList.map(sub => {
            // Check if sub is a string before using split
            if (typeof sub === 'string') {
                const formatted = sub.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                
                return {
                    value: sub,
                    label: formatted
                };
            } else if (sub && typeof sub === 'object') {
                // If subcategory is already an object with value/label
                return sub;
            } else {
                // Fallback for unexpected data types
                return {
                    value: String(sub),
                    label: String(sub)
                };
            }
        });
    };

    // Check if a category has subcategories
    const categoryHasSubcategories = (category) => {
        const subcategories = getSubcategories(category);
        return subcategories.length > 0;
    };

    const subcategories = getSubcategories(filtersState.category);
    const hasAppliedFilters = filtersState.category !== 'all' || filtersState.subcategory || filtersState.priceRange;

    return (
        <div className="filters-container">
            {/* Mobile view close button */}
            <div className="md:hidden flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Filters</h3>
                <button 
                    onClick={closeMobileFilter}
                    className="text-gray-500 hover:text-black"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            {/* Applied filters summary */}
            {hasAppliedFilters && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium uppercase">Applied Filters</h4>
                        <button 
                            onClick={clearFilters}
                            className="text-xs text-gray-500 hover:text-black flex items-center"
                        >
                            <CiTrash className="mr-1" /> Clear All
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {filtersState.category !== 'all' && (
                            <div className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs">
                                {allCategories.find(cat => cat.value === filtersState.category)?.label || filtersState.category}
                                <button 
                                    onClick={() => handleCategoryChange('all')}
                                    className="ml-1 text-gray-500 hover:text-black"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {filtersState.subcategory && (
                            <div className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs">
                                {subcategories.find(sub => sub.value === filtersState.subcategory)?.label || filtersState.subcategory}
                                <button 
                                    onClick={() => handleSubcategoryChange(filtersState.category, '')}
                                    className="ml-1 text-gray-500 hover:text-black"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {filtersState.priceRange && (
                            <div className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs">
                                {filters.priceRanges.find(range => 
                                    `${range.min}-${range.max === Infinity ? 'Infinity' : range.max}` === filtersState.priceRange
                                )?.label || 'Price Range'}
                                <button 
                                    onClick={() => setFiltersState(prev => ({ ...prev, priceRange: '' }))}
                                    className="ml-1 text-gray-500 hover:text-black"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Categories section */}
            <div className="filter-section mb-6">
                <button 
                    className="w-full flex justify-between items-center py-2 border-b border-gray-200 text-sm font-medium uppercase"
                    onClick={() => toggleSection('categories')}
                >
                    Categories
                    {expandedSections.categories ? 
                        <CiCircleMinus className="w-5 h-5" /> : 
                        <CiCirclePlus className="w-5 h-5" />
                    }
                </button>
                
                {expandedSections.categories && (
                    <div className="mt-3 space-y-1">
                        {allCategories.map(category => (
                            <div key={category.value} className="category-item">
                                <div 
                                    className={`flex items-center justify-between py-2 px-1 rounded cursor-pointer hover:bg-gray-50 ${
                                        filtersState.category === category.value ? 'bg-gray-50 font-medium' : ''
                                    }`}
                                    onClick={() => handleCategoryChange(category.value)}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-2">{category.icon}</span>
                                        <span>{category.label}</span>
                                    </div>
                                    
                                    {categoryHasSubcategories(category.value) && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleCategory(category.value);
                                            }}
                                            className="p-1 text-gray-500"
                                        >
                                            {expandedCategories[category.value] ? 
                                                <FaChevronDown className="w-3 h-3" /> : 
                                                <FaChevronRight className="w-3 h-3" />
                                            }
                                        </button>
                                    )}
                                </div>
                                
                                {/* Show subcategories when category is expanded */}
                                {expandedCategories[category.value] && categoryHasSubcategories(category.value) && (
                                    <div className="ml-8 mt-1 mb-2 border-l-2 border-gray-200 pl-2 space-y-1">
                                        {getSubcategories(category.value).map(subcategory => (
                                            <div 
                                                key={subcategory.value}
                                                className={`py-1 px-2 rounded text-sm cursor-pointer hover:bg-gray-50 ${
                                                    filtersState.subcategory === subcategory.value ? 'bg-gray-50 font-medium' : ''
                                                }`}
                                                onClick={() => handleSubcategoryChange(category.value, subcategory.value)}
                                            >
                                                {subcategory.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
                )}
            </div>

            {/* Price filter section */}
            <div className="filter-section mb-6">
                <button 
                    className="w-full flex justify-between items-center py-2 border-b border-gray-200 text-sm font-medium uppercase"
                    onClick={() => toggleSection('price')}
                >
                    Price
                    {expandedSections.price ? 
                        <CiCircleMinus className="w-5 h-5" /> : 
                        <CiCirclePlus className="w-5 h-5" />
                    }
                </button>
                
                {expandedSections.price && (
                    <div className="mt-3 space-y-2">
                    {filters.priceRanges.map((range, index) => (
                            <div 
                                key={index}
                                className={`flex items-center py-2 px-1 rounded cursor-pointer hover:bg-gray-50 ${
                                    filtersState.priceRange === `${range.min}-${range.max === Infinity ? 'Infinity' : range.max}` ? 'bg-gray-50 font-medium' : ''
                                }`}
                                onClick={() => onPriceRangeChange(range)}
                            >
                            {range.label}
                            </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    );
};

export default ShopFiltering;