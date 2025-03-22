import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../constants/categoryConstants';
import { motion, AnimatePresence } from 'framer-motion';

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters, onPriceRangeChange, closeMobileFilter }) => {
    const navigate = useNavigate();
    // State to track expanded category dropdowns
    const [expandedCategories, setExpandedCategories] = useState({});

    const handleCategoryChange = (category) => {
        // Set selected category in filter state
        setFiltersState(prev => ({
            ...prev,
            category,
            subcategory: '' // Reset subcategory when category changes
        }));
        
        // Check if category has subcategories
        const categoryData = CATEGORIES[category?.toUpperCase()];
        const hasSubcategories = categoryData && categoryData.subcategories && categoryData.subcategories.length > 0;
        
        if (hasSubcategories) {
            // If category has subcategories, toggle dropdown instead of navigating
            setExpandedCategories(prev => ({
                ...prev,
                [category]: !prev[category]
            }));
        } else if (category && category !== 'all') {
            // If no subcategories, navigate directly
            navigate(`/categories/${category}`);
        } else if (category === 'all') {
            navigate('/shop');
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
    
    // Toggle category expansion
    const toggleCategoryExpansion = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    // Create an array of all categories with icons
    const allCategories = [
        { value: 'all', label: 'All Products', icon: 'grid_view' },
        { value: 'accessories', label: 'Accessories', icon: 'diamond' },
        { value: 'fragrance', label: 'Fragrance', icon: 'local_pharmacy' },
        { value: 'corporate', label: 'Corporate Wears', icon: 'business_center' },
        { value: 'dress', label: 'Dresses', icon: 'dry_cleaning' },
        { value: 'new', label: 'New Arrivals', icon: 'new_releases' },
        { value: 'shoes', label: 'Shoes', icon: 'settings_accessibility' },
        { value: 'bags', label: 'Bags', icon: 'shopping_bag' },
        { value: 'clothes', label: 'Clothes', icon: 'checkroom' },
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
    
    // Get subcategory icon
    const getSubcategoryIcon = (category, subcategory) => {
        // Default icons for common subcategories based on their names
        const iconMap = {
            // Accessories subcategory icons
            'sunglasses': 'visibility',
            'wrist-watches': 'watch',
            'belts': 'no_encryption_gmailerrorred',
            'bangles-bracelet': 'circle',
            'earrings': 'stars',
            'necklace': 'diamond',
            'pearls': 'radio_button_unchecked',
            
            // Fragrance subcategory icons
            'designer-niche': 'spa',
            'unboxed': 'inventory_2',
            'testers': 'science',
            'arabian': 'mosque',
            'diffuser': 'air',
            'mist': 'water_drop',
            
            // Corporate subcategory icons
            'suits': 'person',
            'blazers': 'groups',
            'office-wear': 'work',
            
            // Dress subcategory icons
            'casual': 'weekend',
            'formal': 'event',
            'party': 'celebration',
            
            // Shoes subcategory icons
            'heels': 'high_heels',
            'flats': 'slippers',
            'sandals': 'co_present',
            'sneakers': 'directions_walk',
            
            // New subcategory icons
            'this-week': 'today',
            'this-month': 'calendar_month',
        };
        
        return iconMap[subcategory] || 'sell';
    };

    // Check if a category has subcategories
    const categoryHasSubcategories = (category) => {
        const subcategories = getSubcategories(category);
        return subcategories.length > 0;
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className='mb-8'>
                <h3 className='font-medium mb-4 text-lg flex items-center gap-2'>
                    <span className="material-icons text-gold">filter_alt</span>
                    Categories
                </h3>
                <div className='space-y-3'>
                    {allCategories.map(category => {
                        const hasSubcategories = categoryHasSubcategories(category.value);
                        const isExpanded = expandedCategories[category.value];
                        
                        return (
                            <div key={category.value} className="category-item">
                                <div className={`flex items-center justify-between ${filtersState.category === category.value ? 'text-gold' : ''} hover:text-gold transition-colors duration-200`}>
                                    <label className='flex items-center cursor-pointer flex-1'>
                                        <input
                                            type='radio'
                                            name='category'
                                            checked={filtersState.category === category.value}
                                            onChange={() => handleCategoryChange(category.value)}
                                            className='mr-2 accent-gold'
                                        />
                                        <span className="material-icons text-lg mr-2">
                                            {category.icon}
                                        </span>
                                        {category.label}
                                    </label>
                                    
                                    {hasSubcategories && (
                                        <button 
                                            onClick={() => toggleCategoryExpansion(category.value)}
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                            aria-label={isExpanded ? "Collapse" : "Expand"}
                                        >
                                            <span className="material-icons text-lg">
                                                {isExpanded ? 'expand_less' : 'expand_more'}
                                            </span>
                                        </button>
                                    )}
                                </div>
                                
                                {/* Subcategories dropdown */}
                                <AnimatePresence>
                                    {hasSubcategories && isExpanded && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className='ml-8 mt-2 space-y-2 overflow-hidden'
                                        >
                                            {getSubcategories(category.value).map((sub) => (
                                                <label key={sub.value} className={`flex items-center cursor-pointer py-1 pl-2 rounded-md ${filtersState.subcategory === sub.value ? 'text-gold bg-gold/5' : ''} hover:bg-gold/5 hover:text-gold transition-all duration-200`}>
                                                    <input
                                                        type='radio'
                                                        name='subcategory'
                                                        checked={filtersState.category === category.value && filtersState.subcategory === sub.value}
                                                        onChange={() => handleSubcategoryChange(category.value, sub.value)}
                                                        className='mr-2 accent-gold'
                                                    />
                                                    <span className="material-icons text-sm mr-2">
                                                        {getSubcategoryIcon(category.value, sub.value)}
                                                    </span>
                                                    {sub.label}
                                                </label>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className='mb-8'>
                <h3 className='font-medium mb-4 text-lg flex items-center gap-2'>
                    <span className="material-icons text-gold">payments</span>
                    Price Range
                </h3>
                <div className='space-y-3'>
                    {filters.priceRanges.map((range, index) => (
                        <label key={index} className={`flex items-center cursor-pointer py-1 rounded-md ${filtersState.priceRange === `${range.min}-${range.max === Infinity ? 'Infinity' : range.max}` ? 'text-gold' : ''} hover:text-gold transition-colors duration-200`}>
                            <input
                                type='radio'
                                name='priceRange'
                                checked={filtersState.priceRange === `${range.min}-${range.max === Infinity ? 'Infinity' : range.max}`}
                                onChange={() => onPriceRangeChange(range)}
                                className='mr-2 accent-gold'
                            />
                            <span className="material-icons text-lg mr-2">
                                {index === 0 ? 'savings' : 
                                 index === 1 ? 'sell' :
                                 index === 2 ? 'diamond' : 'paid'}
                            </span>
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
                className='w-full bg-gold/10 text-gold py-3 rounded-md hover:bg-gold hover:text-white transition-all duration-300 flex items-center justify-center'
            >
                <span className="material-icons mr-2">refresh</span>
                Clear Filters
            </button>
        </div>
    );
};

export default ShopFiltering;