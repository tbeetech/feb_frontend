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
    FaEnvelope,
    FaHeart
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

    const handleCartToggle = () => {
        setIsCartOpen(!isCartOpen);
    }

    const handleDropDownToggle = (e) => {
        e.stopPropagation();
        setIsDropDownOpen(!isDropDownOpen);
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
                        
                        {/* Desktop Search */}
                        <div className="hidden md:flex items-center space-x-3">
                            <ToggleTheme />
                            <button 
                                onClick={handleSearchToggle} 
                                className="p-2 text-gray-500 hover:text-black transition-colors"
                                aria-label="Search"
                            >
                                <CiSearch className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Main navigation */}
                <div className="py-4 border-b border-gray-200">
                    <div className="container mx-auto px-4 flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0">
                            <div className="flex items-center">
                                <h1 className="text-2xl md:text-3xl font-bold tracking-wider">F.E.B</h1>
                                <p className="text-sm ml-2 tracking-widest uppercase">LUXURY</p>
                            </div>
                        </Link>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            <div className="relative category-dropdown">
                                <button 
                                    onClick={handleCategoryToggle}
                                    className="flex items-center space-x-1 font-medium"
                                >
                                    <span>Categories</span>
                                    <FaChevronDown className={`w-3 h-3 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {/* Desktop Category dropdown */}
                                <AnimatePresence>
                                    {isCategoryOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute left-0 mt-5 bg-white rounded-md shadow-lg z-50 w-[650px] border border-gray-100"
                                        >
                                            <div className="grid grid-cols-3 gap-6 p-6">
                                                {Object.keys(CATEGORIES).map((categoryKey) => {
                                                    const category = CATEGORIES[categoryKey];
                                                    const subcategories = category.subcategories || [];
                                                    return (
                                                        <div key={categoryKey} className="space-y-2">
                                                            <Link 
                                                                to={`/categories/${category.name}`} 
                                                                className="font-semibold text-black block hover:underline"
                                                                onClick={() => setIsCategoryOpen(false)}
                                                            >
                                                                {categoryKey.charAt(0) + categoryKey.slice(1).toLowerCase()}
                                                            </Link>
                                                            <ul className="space-y-1 mt-2">
                                                                {subcategories.map((sub) => (
                                                                    <li key={sub.value}>
                                                                        <Link 
                                                                            to={`/categories/${category.name}/${sub.value}`}
                                                                            className="text-sm text-gray-600 hover:text-black block py-1"
                                                                            onClick={() => setIsCategoryOpen(false)}
                                                                        >
                                                                            {sub.label}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            
                            <Link to="/shop" className="font-medium">Shop All</Link>
                            <Link to="/categories/new" className="font-medium">New In</Link>
                            <Link to="/categories/fragrance" className="font-medium">Fragrance</Link>
                            <Link to="/categories/bags" className="font-medium">Bags</Link>
                        </div>
                        
                        {/* Action Icons */}
                        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                            <button 
                                onClick={handleSearchToggle}
                                className="p-2 text-gray-700 hover:text-black lg:hidden"
                            >
                                <CiSearch className="w-6 h-6" />
                            </button>
                            
                            <button 
                                onClick={handleCartToggle}
                                className="p-2 text-gray-700 hover:text-black relative"
                            >
                                <CiShoppingCart className="w-6 h-6" />
                                {products?.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                        {products.length}
                                    </span>
                                )}
                            </button>

                            <div className="relative user-dropdown">
                                <button 
                                    onClick={handleDropDownToggle}
                                    className="p-2 text-gray-700 hover:text-black flex items-center"
                                >
                                    <CiUser className="w-6 h-6" />
                                </button>
                                
                                <AnimatePresence>
                                    {isDropDownOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-100"
                                        >
                                            <div className="p-4">
                                                {user ? (
                                                    <>
                                                        <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                                                            <img 
                                                                src={user.avatar || avatarImg} 
                                                                alt="User" 
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                            <div>
                                                                <p className="font-semibold">
                                                                    {user.username || user.name || 'User'}
                                                                </p>
                                                                <p className="text-xs text-gray-500 truncate">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="pt-3 space-y-2">
                                                            <Link 
                                                                to="/dashboard" 
                                                                className="flex items-center text-gray-700 hover:text-black py-2"
                                                                onClick={() => setIsDropDownOpen(false)}
                                                            >
                                                                <FaUser className="w-4 h-4 mr-3" />
                                                                <span>Dashboard</span>
                                                            </Link>
                                                            
                                                            {/* Admin menu items */}
                                                            {user?.role === 'admin' && (
                                                                <>
                                                                    <div className="border-t border-gray-100 my-1"></div>
                                                                    <span className="block px-4 py-1 text-xs text-gray-500">Admin</span>
                                                                    <Link 
                                                                        to="/admin/dashboard" 
                                                                        className="flex items-center text-gray-700 hover:text-black py-2"
                                                                        onClick={() => setIsDropDownOpen(false)}
                                                                    >
                                                                        <FaTh className="w-4 h-4 mr-3" />
                                                                        <span>Admin Dashboard</span>
                                                                    </Link>
                                                                    <Link 
                                                                        to="/admin/upload-product" 
                                                                        className="flex items-center text-gray-700 hover:text-black py-2"
                                                                        onClick={() => setIsDropDownOpen(false)}
                                                                    >
                                                                        <FaPlus className="w-4 h-4 mr-3" />
                                                                        <span>Upload Product</span>
                                                                    </Link>
                                                                    <Link 
                                                                        to="/admin/manage-products" 
                                                                        className="flex items-center text-gray-700 hover:text-black py-2"
                                                                        onClick={() => setIsDropDownOpen(false)}
                                                                    >
                                                                        <FaTh className="w-4 h-4 mr-3" />
                                                                        <span>Manage Products</span>
                                                                    </Link>
                                                                    <Link 
                                                                        to="/admin/edit-product" 
                                                                        className="flex items-center text-gray-700 hover:text-black py-2"
                                                                        onClick={() => setIsDropDownOpen(false)}
                                                                    >
                                                                        <FaEdit className="w-4 h-4 mr-3" />
                                                                        <span>Edit Product</span>
                                                                    </Link>
                                                                </>
                                                            )}
                                                            
                                                            <button 
                                                                onClick={handleLogout}
                                                                className="flex items-center text-red-600 hover:text-red-700 py-2 w-full text-left"
                                                            >
                                                                <FaSignOutAlt className="w-4 h-4 mr-3" />
                                                                <span>Logout</span>
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <Link 
                                                            to="/login" 
                                                            className="flex items-center text-gray-700 hover:text-black py-2"
                                                            onClick={() => setIsDropDownOpen(false)}
                                                        >
                                                            <FaSignInAlt className="w-4 h-4 mr-3" />
                                                            <span>Login</span>
                                                        </Link>
                                                        <Link 
                                                            to="/register" 
                                                            className="flex items-center text-gray-700 hover:text-black py-2"
                                                            onClick={() => setIsDropDownOpen(false)}
                                                        >
                                                            <FaUserPlus className="w-4 h-4 mr-3" />
                                                            <span>Register</span>
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Search Bar (shown when search is active) */}
                <AnimatePresence>
                    {showSearch && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-b border-gray-200 search-container"
                        >
                            <div className="container mx-auto px-4 py-4">
                                <form onSubmit={handleSearchSubmit} className="flex items-center">
                                    <input 
                                        type="text" 
                                        placeholder="Search for products..." 
                                        className="w-full py-3 px-4 border-0 focus:outline-none search-input text-lg"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowSearch(false)}
                                        className="ml-4 text-gray-500 hover:text-black"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
            
            {/* Cart Sidebar */}
            <AnimatePresence>
                {isCartOpen && <CartModal onClose={handleCartToggle} />}
            </AnimatePresence>
        </>
    )
}

export default Navbar