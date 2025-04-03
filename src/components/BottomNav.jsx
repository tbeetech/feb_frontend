import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import avatarImg from "../assets/avatar.png";
import { AnimatePresence, motion } from 'framer-motion';
import CartModal from '../pages/shop/CartModal';
import { CATEGORIES } from '../constants/categoryConstants';
import { FaHome, FaSearch, FaShoppingBag, FaBars, FaTimes, FaChevronRight } from 'react-icons/fa';

const BottomNav = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const { products } = useSelector((state) => state.cart);
    const location = useLocation();
    const navigate = useNavigate();
    
    const productCount = products?.reduce((total, item) => total + item.quantity, 0) || 0;
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setShowSearch(false);
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    
    const handleCategoryClick = (category) => {
        if (expandedCategory === category) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(category);
        }
    };
    
    const handleSubcategoryClick = (category, subcategory) => {
        navigate(`/categories/${category}/${subcategory}`);
        setShowMenu(false);
        setExpandedCategory(null);
    };
    
    // Category data for navigation
    const categoryData = [
        { name: 'Women', path: 'women', icon: '👩' },
        { name: 'Men', path: 'men', icon: '👨' },
        { name: 'New', path: 'new', icon: '✨', hasSubcategories: true },
        { name: 'Clothing', path: 'clothes', icon: '👕', hasSubcategories: false },
        { name: 'Dresses', path: 'dress', icon: '👗', hasSubcategories: true },
        { name: 'Shoes', path: 'shoes', icon: '👠', hasSubcategories: true },
        { name: 'Bags', path: 'bags', icon: '👜', hasSubcategories: false },
        { name: 'Accessories', path: 'accessories', icon: '⌚', hasSubcategories: true },
        { name: 'Fragrances', path: 'fragrance', icon: '🧴', hasSubcategories: true },
        { name: 'Corporate', path: 'corporate', icon: '👔', hasSubcategories: true }
    ];
    
    // Get subcategories from CATEGORIES constant
    const getSubcategories = (category) => {
        if (!category) return [];
        const upperCategory = category.toUpperCase();
        return CATEGORIES[upperCategory]?.subcategories || [];
    };
    
    return (
        <>
            {/* Primary Navigation Bar */}
            <div className="fixed-bottom-nav fixed bottom-0 left-0 right-0 z-30 lg:hidden">
                <div className="bg-white border-t border-gray-200 shadow-lg">
                    <div className="max-w-md mx-auto">
                        <nav className="flex justify-around items-center h-16">
                            <Link 
                                to="/" 
                                className={`flex flex-col items-center text-xs py-1 ${
                                    location.pathname === '/' ? 'text-black' : 'text-gray-500'
                                }`}
                            >
                                <FaHome className="text-lg mb-0.5" />
                                <span>Home</span>
                            </Link>
                            
                            <button 
                                onClick={() => setShowSearch(!showSearch)} 
                                className={`flex flex-col items-center text-xs py-1 ${
                                    showSearch ? 'text-black' : 'text-gray-500'
                                }`}
                            >
                                <FaSearch className="text-lg mb-0.5" />
                                <span>Search</span>
                            </button>
                            
                            <button 
                                onClick={() => setIsCartOpen(true)}
                                className="flex flex-col items-center text-xs py-1 text-gray-500 relative"
                            >
                                <FaShoppingBag className="text-lg mb-0.5" />
                                {productCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {productCount > 99 ? '99+' : productCount}
                                    </span>
                                )}
                                <span>Cart</span>
                            </button>
                            
                            <button 
                                onClick={() => setShowMenu(!showMenu)}
                                className={`flex flex-col items-center text-xs py-1 ${
                                    showMenu ? 'text-black' : 'text-gray-500'
                                }`}
                            >
                                {showMenu ? (
                                    <FaTimes className="text-lg mb-0.5" />
                                ) : (
                                    <FaBars className="text-lg mb-0.5" />
                                )}
                                <span>Menu</span>
                            </button>
                        </nav>
                    </div>
                </div>
                
                {/* Mobile Search Input */}
                <AnimatePresence>
                    {showSearch && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white border-t border-gray-200 shadow-inner p-3"
                        >
                            <form onSubmit={handleSearchSubmit} className="flex items-center">
                                <input 
                                    type="text" 
                                    placeholder="Search products..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-2 px-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                />
                                <button 
                                    type="submit"
                                    className="bg-black text-white py-2 px-4 rounded-r-md"
                                >
                                    <FaSearch />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Mobile Menu Panel */}
                <AnimatePresence>
                    {showMenu && (
                        <motion.div 
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 top-auto bg-white border-t border-gray-200 shadow-lg z-40 h-[70vh] overflow-y-auto"
                        >
                            <div className="p-4">
                                <h3 className="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Categories</h3>
                                
                                <div className="space-y-1">
                                    <Link 
                                        to="/shop" 
                                        className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
                                        onClick={() => setShowMenu(false)}
                                    >
                                        <span className="mr-2">🛍️</span>
                                        <span>All Products</span>
                                    </Link>
                                    
                                    {categoryData.map(category => (
                                        <div key={category.path}>
                                            <div 
                                                className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    if (category.hasSubcategories) {
                                                        handleCategoryClick(category.path);
                                                    } else {
                                                        navigate(`/categories/${category.path}`);
                                                        setShowMenu(false);
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center">
                                                    <span className="mr-2">{category.icon}</span>
                                                    <span>{category.name}</span>
                                                </div>
                                                
                                                {category.hasSubcategories && (
                                                    <FaChevronRight 
                                                        className={`w-3 h-3 transition-transform ${
                                                            expandedCategory === category.path ? 'rotate-90' : ''
                                                        }`} 
                                                    />
                                                )}
                                            </div>
                                            
                                            {/* Subcategories */}
                                            {expandedCategory === category.path && (
                                                <div className="ml-8 my-1 border-l-2 border-gray-200 pl-2 space-y-1">
                                                    {getSubcategories(category.path).map((subcategory) => {
                                                        const subValue = typeof subcategory === 'string' ? subcategory : subcategory.value;
                                                        const subLabel = typeof subcategory === 'string' 
                                                            ? subcategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                                                            : subcategory.label;
                                                            
                                                        return (
                                                            <div 
                                                                key={subValue}
                                                                className="py-2 px-3 text-sm hover:bg-gray-100 rounded-md cursor-pointer"
                                                                onClick={() => handleSubcategoryClick(category.path, subValue)}
                                                            >
                                                                {subLabel}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <h3 className="text-lg font-medium pb-2 mb-2">Quick Links</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link 
                                            to="/about" 
                                            className="py-2 px-3 bg-gray-100 rounded-md text-center hover:bg-gray-200"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            About Us
                                        </Link>
                                        <Link 
                                            to="/contact" 
                                            className="py-2 px-3 bg-gray-100 rounded-md text-center hover:bg-gray-200"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            Contact
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Cart Modal */}
            <AnimatePresence>
                {isCartOpen && (
                    <CartModal onClose={() => setIsCartOpen(false)} />
                )}
            </AnimatePresence>
        </>
    );
};

export default BottomNav;
