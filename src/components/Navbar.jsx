import React, {useState, useEffect} from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion';
import CartModal from '../pages/shop/CartModal';
import avatarImg from "../assets/avatar.png"
import { useLogoutUserMutation } from '../redux/features/auth/authApi';
import { logout } from '../redux/features/auth/authSlice';
import { CATEGORIES } from '../constants/categoryConstants';
import ToggleTheme from './ToggleTheme';
import { CiSearch, CiHeart, CiShoppingCart, CiUser } from 'react-icons/ci';
import { 
    FaChevronDown, 
    FaChevronRight, 
    FaTshirt, 
    FaFemale, 
    FaMale, 
    FaBaby,
    FaGem,
    FaShoppingBag,
    FaShoePrints,
    FaPaintBrush,
    FaHome,
    FaGift,
    FaTags,
    FaUser,
    FaSignOutAlt,
    FaSignInAlt,
    FaUserPlus,
    FaPlus,
    FaTh,
    FaEdit,
    FaInfoCircle,
    FaEnvelope
} from 'react-icons/fa';
import MiniCart from './MiniCart';

const Navbar = () => {
    const products = useSelector((state) => state.cart.products);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    
    const location = useLocation();
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth);
    const [logoutUser] = useLogoutUserMutation();
    const navigate = useNavigate(); 

    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState({});
    
    // Check if current page is search page
    const isSearchPage = location.pathname === '/search';

    // Extract search query from URL if on search page
    useEffect(() => {
        if (isSearchPage) {
            const queryParams = new URLSearchParams(location.search);
            const queryFromUrl = queryParams.get('q');
            if (queryFromUrl) {
                setSearchQuery(queryFromUrl);
            }
        }
    }, [location.search, isSearchPage]);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropDownOpen && !event.target.closest('.user-dropdown')) {
                setIsDropDownOpen(false);
            }
            if (showSearch && !event.target.closest('.search-container')) {
                setShowSearch(false);
            }
            if (isCategoryOpen && !event.target.closest('.category-dropdown')) {
                setIsCategoryOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropDownOpen, showSearch, isCategoryOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Toggle body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isMobileMenuOpen]);

    const handleCartToggle = () => {
        setIsCartOpen(!isCartOpen);
    }

    const handleDropDownToggle = (e) => {
        e.stopPropagation();
        setIsDropDownOpen(!isDropDownOpen);
    }

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    const handleCategoryToggle = () => {
        setIsCategoryOpen(!isCategoryOpen);
    };

    const handleSearchToggle = () => {
        setShowSearch(!showSearch);
        if (!showSearch) {
            setTimeout(() => {
                document.querySelector('.search-input')?.focus();
            }, 100);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        // If we're already on the search page, update URL in real-time
        if (isSearchPage && value.trim()) {
            const searchParams = new URLSearchParams(location.search);
            searchParams.set('q', value);
            const newUrl = `${location.pathname}?${searchParams.toString()}`;
            navigate(newUrl, { replace: true });
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowSearch(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            navigate("/");
            setIsDropDownOpen(false);
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const handleCategoryClick = (category, subcategory = null) => {
        if (subcategory) {
            const path = `/categories/${category}/${subcategory}`;
            navigate(path);
            setIsMobileMenuOpen(false);
        } else {
            // Toggle category expansion in mobile menu
            setExpandedCategories(prev => ({
                ...prev,
                [category]: !prev[category]
            }));
        }
    };

    const toggleMobileCategory = (categoryKey) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryKey]: !prev[categoryKey]
        }));
    };

    const mainCategories = [
        { name: "About", path: "about", icon: <FaInfoCircle className="w-5 h-5 mr-3" /> },
        { name: "Contact", path: "contact", icon: <FaEnvelope className="w-5 h-5 mr-3" /> }
    ];

    const shoppingCategories = [
        { name: "New in", path: "new", icon: <FaGift className="w-5 h-5 mr-3" /> },
        { name: "Brands", path: "brands", icon: <FaGem className="w-5 h-5 mr-3" /> },
        { name: "Clothing", path: "clothes", icon: <FaTshirt className="w-5 h-5 mr-3" /> },
        { name: "Shoes", path: "shoes", icon: <FaShoePrints className="w-5 h-5 mr-3" /> },
        { name: "Bags", path: "bags", icon: <FaShoppingBag className="w-5 h-5 mr-3" /> },
        { name: "Accessories", path: "accessories", icon: <FaGem className="w-5 h-5 mr-3" /> },
        { name: "Jewelry", path: "jewelry", icon: <FaGem className="w-5 h-5 mr-3" /> }
    ];

    // Function to check if a category has subcategories
    const hasSubcategories = (categoryPath) => {
        const categoryKey = categoryPath.toUpperCase();
        return CATEGORIES[categoryKey]?.subcategories?.length > 0;
    };

    // Function to get subcategories for a category
    const getSubcategories = (categoryPath) => {
        if (!categoryPath) return [];
        const categoryKey = categoryPath.toUpperCase();
        return CATEGORIES[categoryKey]?.subcategories || [];
    };

    return (
        <>
            <header className={`w-full bg-white z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
                {/* Top navigation - Main Categories */}
                <div className="border-b border-gray-200">
                    <div className="container mx-auto px-4 flex items-center justify-between">
                        <nav className="hidden md:flex space-x-6">
                            {mainCategories.map((category, index) => (
                            <Link 
                                    key={index} 
                                    to={`/categories/${category.path}`}
                                    className="py-3 text-sm text-gray-700 hover:text-black transition-colors font-sans"
                                >
                                    {category.name}
                            </Link>
                            ))}
                        </nav>
                        
                        {/* Mobile menu button */}
                        <button 
                            className="md:hidden p-2 focus:outline-none" 
                            onClick={handleMobileMenuToggle}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>

                        {/* Logo */}
                        <Link to="/" className="py-3 font-display text-2xl md:text-3xl font-bold tracking-tighter">
                            FEB LUXURY
                        </Link>

                        {/* Right navigation */}
                        <div className="flex items-center space-x-4">
                            <ToggleTheme className="text-gray-700" />
                            
                            {/* User account */}
                            <div className="relative user-dropdown">
                                <button
                                    onClick={handleDropDownToggle}
                                    className="p-1 text-gray-700 hover:text-black transition-colors"
                                >
                                    <CiUser className="h-6 w-6" />
                                </button>
                                
                                {/* User dropdown */}
                                    {isDropDownOpen && (
                                    <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-md overflow-hidden z-50 border border-gray-200">
                                        {user ? (
                                            <div>
                                                <div className="p-4 border-b border-gray-100">
                                                    <p className="text-sm font-medium">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                                <div className="py-2">
                                                    <Link 
                                                        to="/dashboard" 
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                        onClick={() => setIsDropDownOpen(false)}
                                                    >
                                                        Dashboard
                                                    </Link>
                                                    <Link
                                                        to="/dashboard/orders" 
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                        onClick={() => setIsDropDownOpen(false)}
                                                    >
                                                        Orders
                                                    </Link>
                                                    
                                                    {/* Admin menu items */}
                                                    {user?.role === 'admin' && (
                                                        <>
                                                            <div className="border-t border-gray-100 my-1"></div>
                                                            <span className="block px-4 py-1 text-xs text-gray-500">Admin</span>
                                                            <Link
                                                                to="/admin/upload-product" 
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                                onClick={() => setIsDropDownOpen(false)}
                                                            >
                                                                Upload Product
                                                            </Link>
                                                            <Link
                                                                to="/admin/manage-products" 
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                                onClick={() => setIsDropDownOpen(false)}
                                                            >
                                                                Manage Products
                                                            </Link>
                                                            <Link
                                                                to="/admin/edit-product" 
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                                onClick={() => setIsDropDownOpen(false)}
                                                            >
                                                                Edit Product
                                                            </Link>
                                                        </>
                                                    )}
                                                    
                                                    <button
                                                        onClick={handleLogout}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Sign out
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-2">
                            <Link 
                                to="/login"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setIsDropDownOpen(false)}
                                                >
                                                    Sign in
                                                </Link>
                                                <Link 
                                                    to="/register" 
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setIsDropDownOpen(false)}
                                                >
                                                    Register
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            {/* Wishlist */}
                            <Link to="/wishlist" className="p-1 text-gray-700 hover:text-black transition-colors">
                                <CiHeart className="h-6 w-6" />
                            </Link>
                            
                            {/* Cart */}
                            <Link to="/cart" className="p-1 text-gray-700 hover:text-black transition-colors relative">
                                <CiShoppingCart className="h-6 w-6" />
                                {products.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                        {products.reduce((sum, item) => sum + item.quantity, 0)}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Bottom navigation - Shopping Categories */}
                <div className="border-b border-gray-200 hidden md:block">
                    <div className="container mx-auto px-4">
                        <nav className="flex items-center justify-center space-x-6">
                            {shoppingCategories.map((category, index) => (
                                <Link 
                                    key={index} 
                                    to={`/categories/${category.path}`}
                                    className={`py-3 text-sm hover:text-black transition-colors font-sans ${
                                        category.highlight ? 'text-red-600 hover:text-red-700' : 'text-gray-700'
                                    }`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </nav>
                                </div>
                            </div>
                            
                {/* Search bar */}
                <div className="border-b border-gray-200">
                    <div className="container mx-auto px-4 py-2">
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                                    <input 
                                        type="text" 
                            
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 font-sans text-sm"
                            />
                            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </form>
                            </div>
                </div>
            </header>
            
            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-white overflow-y-auto"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                    >
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h2 className="font-display text-xl font-bold">Menu</h2>
                            <button 
                                                onClick={handleMobileMenuToggle}
                                className="p-2 text-gray-800 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <nav className="p-4">
                            <ul className="space-y-2">
                                {/* Logo */}
                                <li className="py-2">
                                    <Link to="/" className="flex items-center py-2 font-display text-xl font-bold" onClick={handleMobileMenuToggle}>
                                        FEB LUXURY
                                            </Link>
                                        </li>
                                
                                {/* Main categories */}
                                {mainCategories.map((category, index) => (
                                    <li key={`main-${index}`} className="py-1">
                                        <Link
                                            to={`/${category.path}`}
                                            className="flex items-center py-2 text-gray-800 font-medium"
                                            onClick={handleMobileMenuToggle}
                                        >
                                            {category.icon}
                                            {category.name}
                                        </Link>
                                        </li>
                                    ))}

                                {/* Shopping categories */}
                                {shoppingCategories.map((category, index) => (
                                    <li key={`shop-${index}`} className="py-1">
                                        {hasSubcategories(category.path) ? (
                                            <div>
                                        <button 
                                                    onClick={() => toggleMobileCategory(category.path)}
                                                    className={`flex items-center justify-between w-full py-2 ${
                                                        category.highlight ? 'text-red-600' : 'text-gray-800'
                                                    }`}
                                        >
                                            <div className="flex items-center">
                                                        {category.icon}
                                                        {category.name}
                                            </div>
                                                    <FaChevronDown 
                                                        className={`transition-transform ${
                                                            expandedCategories[category.path] ? 'rotate-180' : ''
                                                        }`} 
                                                    />
                                        </button>
                                                
                                                {expandedCategories[category.path] && (
                                                    <ul className="pl-8 mt-1 space-y-1">
                                                        {getSubcategories(category.path).map((subcategory, subIndex) => (
                                                            <li key={subIndex}>
                                                                <Link
                                                                    to={`/categories/${category.path}/${subcategory.value}`}
                                                                    className="block py-2 text-gray-700 hover:text-black"
                                                                    onClick={handleMobileMenuToggle}
                                                                >
                                                                    {subcategory.label}
                                                                </Link>
                                                        </li>
                                                    ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ) : (
                                            <Link 
                                                to={`/categories/${category.path}`}
                                                className={`flex items-center py-2 ${
                                                    category.highlight ? 'text-red-600' : 'text-gray-800'
                                                }`}
                                                onClick={handleMobileMenuToggle}
                                            >
                                                {category.icon}
                                                {category.name}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                                
                                {/* User account links */}
                                {user ? (
                                    <>
                                        <li className="py-1">
                                            <Link 
                                                to="/dashboard" 
                                                className="flex items-center py-2 text-gray-800"
                                                onClick={handleMobileMenuToggle}
                                            >
                                                <FaUser className="w-5 h-5 mr-3" />
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li className="py-1">
                                                    <Link
                                                to="/dashboard/orders" 
                                                className="flex items-center py-2 text-gray-800"
                                                        onClick={handleMobileMenuToggle}
                                                    >
                                                <FaShoppingBag className="w-5 h-5 mr-3" />
                                                Orders
                                                    </Link>
                                                </li>
                                        <li className="py-1">
                                            <button 
                                                className="flex items-center py-2 text-gray-800 w-full"
                                                onClick={() => {
                                                    logoutUser().unwrap()
                                                        .then(() => {
                                                            dispatch(logout());
                                                            handleMobileMenuToggle();
                                                            navigate('/');
                                                        });
                                                }}
                                            >
                                                <FaSignOutAlt className="w-5 h-5 mr-3" />
                                                Logout
                                            </button>
                                        </li>
                                        
                                        {/* Admin Links */}
                                        {user.isAdmin && (
                                            <>
                                                <li className="py-1">
                                                    <Link 
                                                        to="/admin/upload-product" 
                                                        className="flex items-center py-2 text-gray-800"
                                                        onClick={handleMobileMenuToggle}
                                                    >
                                                        <FaPlus className="w-5 h-5 mr-3" />
                                                        Add Product
                                                    </Link>
                                                </li>
                                                <li className="py-1">
                                                    <Link 
                                                        to="/admin/manage-products" 
                                                        className="flex items-center py-2 text-gray-800"
                                                        onClick={handleMobileMenuToggle}
                                                    >
                                                        <FaTh className="w-5 h-5 mr-3" />
                                                        Manage Products
                                                    </Link>
                                                </li>
                                                <li className="py-1">
                                                    <Link 
                                                        to="/admin/edit-product" 
                                                        className="flex items-center py-2 text-gray-800"
                                                        onClick={handleMobileMenuToggle}
                                                    >
                                                        <FaEdit className="w-5 h-5 mr-3" />
                                                        Edit Product
                                                    </Link>
                                                </li>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <li className="py-1">
                                            <Link 
                                                to="/login" 
                                                className="flex items-center py-2 text-gray-800"
                                                onClick={handleMobileMenuToggle}
                                            >
                                                <FaSignInAlt className="w-5 h-5 mr-3" />
                                                Login
                                            </Link>
                                        </li>
                                        <li className="py-1">
                                            <Link 
                                                to="/register" 
                                                className="flex items-center py-2 text-gray-800"
                                                onClick={handleMobileMenuToggle}
                                            >
                                                <FaUserPlus className="w-5 h-5 mr-3" />
                                                Register
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Cart modal */}
            <AnimatePresence>
                {isCartOpen && (
                    <CartModal onClose={handleCartToggle} />
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;