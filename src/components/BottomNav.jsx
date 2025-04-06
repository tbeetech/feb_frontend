import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import avatarImg from "../assets/avatar.png";
import { AnimatePresence, motion } from 'framer-motion';
import CartModal from '../pages/shop/CartModal';
import { CATEGORIES } from '../constants/categoryConstants';
import { 
    FaHome, 
    FaSearch, 
    FaShoppingBag, 
    FaBars, 
    FaTimes, 
    FaInfoCircle, 
    FaEnvelope,
    FaShoppingBasket,
    FaSprayCan,
    FaGem,
    FaTshirt,
    FaShoePrints,
    FaBriefcase
} from 'react-icons/fa';
import { CiShoppingCart } from 'react-icons/ci';
import { GiDress } from 'react-icons/gi';

// Country flag emojis for regions
const REGION_FLAGS = {
    'US': '🇺🇸',
    'UK': '🇬🇧',
    'EU': '🇪🇺',
    'CA': '🇨🇦',
    'AU': '🇦🇺',
    'JP': '🇯🇵'
};

const BottomNav = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const { products } = useSelector((state) => state.cart);
    const location = useLocation();
    const navigate = useNavigate();
    
    // For demo purposes, assume the currently selected region is UK
    // In a real app, this would come from your context/state/redux
    const currentRegion = 'UK';
    const regionFlag = REGION_FLAGS[currentRegion] || '🌍';
    
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
    
    // Simplified category data - only showing main categories that exist in the database
    const categoryData = [
        { name: 'All Products', path: 'shop', icon: <FaShoppingBasket className="text-lg" /> },
        { name: 'Fragrances', path: 'fragrance', icon: <FaSprayCan className="text-lg" />, hasSubcategories: true },
        { name: 'Bags', path: 'bags', icon: <FaShoppingBag className="text-lg" /> },
        { name: 'Clothes', path: 'clothes', icon: <FaTshirt className="text-lg" /> },
        { name: 'Accessories', path: 'accessories', icon: <FaGem className="text-lg" />, hasSubcategories: true },
        { name: 'Shoes', path: 'shoes', icon: <FaShoePrints className="text-lg" />, hasSubcategories: true },
        { name: 'Dresses', path: 'dress', icon: <GiDress className="text-lg" />, hasSubcategories: true },
        { name: 'Corporate Wear', path: 'corporate', icon: <FaBriefcase className="text-lg" />, hasSubcategories: true },
    ];
    
    // Get subcategories from CATEGORIES constant
    const getSubcategories = (category) => {
        if (!category) return [];
        
        const upperCategory = category.toUpperCase();
        return CATEGORIES[upperCategory]?.subcategories || [];
    };
    
    // Handle navigation to category path
    const handleCategoryNavigation = (path) => {
        if (path === 'shop') {
            navigate('/shop');
        } else {
            navigate(`/categories/${path}`);
        }
        setShowMenu(false);
        setExpandedCategory(null);
    }
    
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
                            
                            <Link 
                                to="/shop" 
                                className={`flex flex-col items-center text-xs py-1 ${
                                    location.pathname.includes('/shop') || location.pathname.includes('/product') || location.pathname.includes('/categories') ? 'text-black' : 'text-gray-500'
                                }`}
                            >
                                <FaShoppingBag className="text-lg mb-0.5" />
                                <span>Shop</span>
                            </Link>

                            <Link 
                                to="/cart" 
                                className={`flex flex-col items-center px-1 ${
                                    location.pathname === '/cart' ? 'text-black' : 'text-gray-500'
                                }`}
                            >
                                <div className="relative">
                                    <CiShoppingCart className="w-7 h-7" />
                                    {productCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                            {productCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs mt-1">Cart</span>
                            </Link>
                            
                            <button 
                                onClick={() => setShowMenu(!showMenu)} 
                                className={`flex flex-col items-center text-xs py-1 ${
                                    showMenu ? 'text-black' : 'text-gray-500'
                                }`}
                            >
                                {showMenu ? (
                                    <>
                                        <FaTimes className="text-lg mb-0.5" />
                                        <span>Close</span>
                                    </>
                                ) : (
                                    <>
                                        <FaBars className="text-lg mb-0.5" />
                                        <span>Menu</span>
                                    </>
                                )}
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
                                    <FaSearch className="text-white" />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Mobile Menu Panel - Simplified */}
                <AnimatePresence>
                    {showMenu && (
                        <motion.div 
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed inset-0 top-auto bg-white border-t border-gray-200 shadow-lg z-40 h-[70vh] overflow-y-auto"
                        >
                            <div className="p-4">
                                {/* Header with close button */}
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                    <div className="flex items-center">
                                        <h2 className="text-xl font-bold uppercase tracking-widest">F.E.B</h2>
                                        <p className="text-sm ml-2 tracking-widest uppercase">LUXURY</p>
                                    </div>
                                    <button 
                                        onClick={() => setShowMenu(false)}
                                        className="w-8 h-8 rounded-full bg-black flex items-center justify-center"
                                    >
                                        <FaTimes className="text-lg text-white" />
                                    </button>
                                </div>
                                
                                <h3 className="text-lg font-medium uppercase tracking-wide mb-4">Categories</h3>
                                
                                {/* Simplified categories list */}
                                <div className="space-y-1 mb-8">
                                    {categoryData.map(category => (
                                        <div key={category.path} className="overflow-hidden">
                                            {category.hasSubcategories ? (
                                                <>
                                                    <motion.div 
                                                        className={`flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group ${
                                                            expandedCategory === category.path ? 'bg-gray-50' : ''
                                                        }`}
                                                        onClick={() => handleCategoryClick(category.path)}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <div className="flex items-center">
                                                            <span className="w-6 h-6 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                                                {category.icon}
                                                            </span>
                                                            <span className="font-medium uppercase tracking-wide text-sm">{category.name}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-400">
                                                            {expandedCategory === category.path ? '−' : '+'}
                                                        </span>
                                                    </motion.div>
                                                    
                                                    {/* Subcategories */}
                                                    <AnimatePresence>
                                                        {expandedCategory === category.path && (
                                                            <motion.div 
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
                                                                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                                className="ml-9 border-l border-gray-200 pl-4 space-y-1 overflow-hidden"
                                                            >
                                                                {getSubcategories(category.path).map((subcategory) => {
                                                                    const subValue = typeof subcategory === 'string' ? subcategory : subcategory.value;
                                                                    const subLabel = typeof subcategory === 'string' 
                                                                        ? subcategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                                                                        : subcategory.label;
                                                                        
                                                                    return (
                                                                        <motion.div 
                                                                            key={subValue}
                                                                            className="py-2 px-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                                                                            onClick={() => handleSubcategoryClick(category.path, subValue)}
                                                                            whileHover={{ x: 4 }}
                                                                            whileTap={{ scale: 0.97 }}
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            transition={{ duration: 0.2, delay: 0.05 }}
                                                                        >
                                                                            {subLabel}
                                                                        </motion.div>
                                                                    );
                                                                })}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </>
                                            ) : (
                                                <div 
                                                    className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                                                    onClick={() => handleCategoryNavigation(category.path)}
                                                >
                                                    <span className="w-6 h-6 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                                        {category.icon}
                                                    </span>
                                                    <span className="font-medium uppercase tracking-wide text-sm">{category.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Pages section */}
                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wide">Pages</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link 
                                            to="/about" 
                                            className="flex items-center py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            <FaInfoCircle className="mr-2 text-gray-700 group-hover:scale-110 transition-transform" />
                                            <span className="font-medium uppercase tracking-wide text-sm">About</span>
                                        </Link>
                                        <Link 
                                            to="/contact" 
                                            className="flex items-center py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            <FaEnvelope className="mr-2 text-gray-700 group-hover:scale-110 transition-transform" />
                                            <span className="font-medium uppercase tracking-wide text-sm">Contact</span>
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
