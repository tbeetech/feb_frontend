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
    const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
    const [isFragranceOpen, setIsFragranceOpen] = useState(false);
    
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
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropDownOpen, showSearch]);

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

    const handleAccessoriesToggle = () => {
        setIsAccessoriesOpen(!isAccessoriesOpen);
    };

    const handleFragranceToggle = () => {
        setIsFragranceOpen(!isFragranceOpen);
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
        handleMobileMenuToggle(); // Close mobile menu
        const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
        
        let path;
        if (subcategory) {
            path = `/categories/${normalizedCategory}/${subcategory}`;
        } else {
            path = `/categories/${normalizedCategory}`;
        }
        
        navigate(path);
    };

    const adminDropDownMenus = [
        {label: "Dashboard", path: "/dashboard/admin", icon: "dashboard"},
        {label: "Upload Product", path: "/admin/upload-product", icon: "upload"},
        {label: "Manage Products", path: "/admin/manage-products", icon: "inventory"},
        {label: "All Orders", path: "/dashboard/manage-orders", icon: "list_alt"},
        {label: "Add New Post", path: "/dashboard/add-new-post", icon: "post_add"},
    ];
    
    const userDropDownMenus = [
        {label: "Dashboard", path: "/dashboard", icon: "dashboard"},
        {label: "Profile", path: "/dashboard/profile", icon: "person"},
        {label: "Payments", path: "/dashboard/payments", icon: "payment"},
        {label: "Orders", path: "/dashboard/orders", icon: "shopping_bag"},
    ];
    
    const dropdownMenus = user?.role === 'admin' ? [...adminDropDownMenus] : [...userDropDownMenus];

    const navigationLinks = [
        { label: "Home", path: "/" },
        { label: "Shop", path: "/shop" },
        { label: "About", path: "/about" },
        { label: "Contact", path: "/contact" }
    ];

    const mobileCategories = [
        {label: "New Arrivals", path: "new", icon: "material-icons", iconName: "new_releases"},
        {label: "Clothing", path: "clothes", icon: "material-icons", iconName: "checkroom"},
        {label: "Corporate Wears", path: "corporate", icon: "material-icons", iconName: "business_center"},
        {label: "Dresses", path: "dress", icon: "material-icons", iconName: "dry_cleaning"},
        {label: "Shoes", path: "shoes", icon: "material-icons", iconName: "settings_accessibility"},
        {label: "Bags", path: "bags", icon: "material-icons", iconName: "shopping_bag"},
    ];

    const accessoriesCategories = [
        {label: "Sunglasses", path: "sunglasses", icon: "material-icons", iconName: "visibility"},
        {label: "Wrist Watches", path: "wrist-watches", icon: "material-icons", iconName: "watch"},
        {label: "Belts", path: "belts", icon: "material-icons", iconName: "no_encryption_gmailerrorred"},
        {label: "Bangles & Bracelet", path: "bangles-bracelet", icon: "material-icons", iconName: "circle"},
        {label: "Earrings", path: "earrings", icon: "material-icons", iconName: "stars"},
        {label: "Necklace", path: "necklace", icon: "material-icons", iconName: "diamond"},
        {label: "Pearls", path: "pearls", icon: "material-icons", iconName: "radio_button_unchecked"},
    ];

    const fragranceCategories = [
        {label: "Designer Perfumes & Niche", path: "designer-niche", icon: "material-icons", iconName: "spa"},
        {label: "Unboxed Perfume", path: "unboxed", icon: "material-icons", iconName: "inventory_2"},
        {label: "Testers", path: "testers", icon: "material-icons", iconName: "science"},
        {label: "Arabian Perfume", path: "arabian", icon: "material-icons", iconName: "mosque"},
        {label: "Diffuser", path: "diffuser", icon: "material-icons", iconName: "air"},
        {label: "Mist", path: "mist", icon: "material-icons", iconName: "water_drop"},
    ];

    // Animation variants
    const dropdownVariants = {
        hidden: { opacity: 0, y: -5, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } }
    };

    const mobileMenuVariants = {
        hidden: { x: "-100%" },
        visible: { x: 0, transition: { type: "tween", duration: 0.3 } }
    };

    const searchVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } }
    };

    return (
        <header className={`fixed-nav-bar w-full z-50 transition-all duration-300 ${isScrolled ? 'shadow-md dark:bg-gray-900/95 bg-white/95 backdrop-blur-sm' : 'dark:bg-gray-900 bg-white'}`}>
            <nav className='max-w-screen-2xl mx-auto px-4 flex justify-between items-center h-20 text-primary dark:text-white'>
                {/* Mobile Menu Button */}
                <span className='md:hidden'>
                    <button 
                        onClick={handleMobileMenuToggle} 
                        className='hover:text-gold p-2 transition-colors duration-300'
                        aria-label="Toggle mobile menu"
                    >
                        <i className="ri-menu-line text-2xl"></i>
                    </button>
                </span>
                
                {/* Desktop Navigation Links */}
                <ul className='nav__links hidden md:flex space-x-8'>
                    {navigationLinks.map((link, index) => (
                        <li key={index} className='link'>
                            <Link 
                                to={link.path} 
                                className={`relative font-medium text-sm tracking-wide hover:text-gold transition-colors duration-300 ${location.pathname === link.path ? 'text-gold' : ''}`}
                            >
                                {link.label}
                                {location.pathname === link.path && (
                                    <motion.div 
                                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold"
                                        layoutId="navbar-underline"
                                    />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
                
                {/* Logo */}
                <div className='nav__logo'>
                    <Link to="/" className="font-display text-2xl tracking-wide">
                        feb<span className="text-gold">luxury</span><span className="text-gold">.</span>
                    </Link>
                </div>
                
                {/* Nav Icons */}
                <div className='nav__icons relative flex items-center space-x-6'>
                    {/* Theme Toggle */}
                    <ToggleTheme className="hidden md:flex" />
                    
                    {/* Search Icon */}
                    <span className="relative search-container">
                        <button 
                            onClick={handleSearchToggle}
                            className='hover:text-gold transition-colors duration-300'
                            aria-label="Search"
                        >
                            <i className="ri-search-line text-xl"></i>
                        </button>
                        
                        {/* Search Dropdown */}
                        <AnimatePresence>
                            {showSearch && (
                                <motion.div 
                                    className="absolute right-0 mt-3 w-72 bg-white rounded-lg shadow-luxury p-3 z-50"
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={searchVariants}
                                >
                                    <form onSubmit={handleSearchSubmit} className="flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            className="search-input w-full py-2 px-3 border border-gray-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all duration-200"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                        <button 
                                            type="submit"
                                            className="bg-gold text-white py-2 px-4 rounded-r-md hover:bg-gold-dark transition-colors duration-300"
                                        >
                                            <i className="ri-search-line"></i>
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </span>
                    
                    {/* Cart Icon */}
                    <span>
                        <button 
                            onClick={handleCartToggle}
                            className='hover:text-gold transition-colors duration-300 relative'
                            aria-label="Shopping cart"
                        >
                            <span className="material-icons text-xl">
                                shopping_cart
                            </span>
                            {products.length > 0 && (
                                <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gold rounded-full"
                                >
                                    {products.length}
                                </motion.span>
                            )}
                        </button>
                    </span>
                    
                    {/* User Profile / Login */}
                    <span className="user-dropdown">
                        {user ? (
                            <>
                                <button
                                    onClick={handleDropDownToggle}
                                    className="flex items-center space-x-2 hover:text-gold transition-colors duration-300"
                                    aria-label="User menu"
                                >
                                    <img
                                        src={user?.profileImage || avatarImg} 
                                        alt="User profile" 
                                        className="w-8 h-8 rounded-full object-cover border-2 border-gold/30" 
                                    />
                                    <span className="hidden lg:block text-sm font-medium">
                                        {user.name?.split(' ')[0]}
                                    </span>
                                </button>
                                
                                {/* User Dropdown Menu */}
                                <AnimatePresence>
                                    {isDropDownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-10"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                                <p className="text-sm leading-5 dark:text-gray-200">Signed in as</p>
                                                <p className="text-sm font-medium leading-5 text-gray-900 dark:text-white truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <ul className="py-2">
                                                {dropdownMenus.map((menu, index) => (
                                                    <li key={index}>
                                                        <Link
                                                            to={menu.path}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gold/5 hover:text-gold transition-colors duration-200"
                                                            onClick={() => setIsDropDownOpen(false)}
                                                        >
                                                            <span className="material-icons text-lg mr-3 text-gray-400 dark:text-gray-500">
                                                                {menu.icon}
                                                            </span>
                                                            {menu.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                            <ul className="py-1">
                                                <li>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                                                    >
                                                        <span className="material-icons text-lg mr-3 text-gray-400 dark:text-gray-500">
                                                            logout
                                                        </span>
                                                        Sign out
                                                    </button>
                                                </li>
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <Link 
                                to="/login"
                                className="flex items-center space-x-1 hover:text-gold transition-colors duration-300"
                            >
                                <i className="ri-user-line text-xl"></i>
                                <span className="hidden lg:block text-sm font-medium">Login</span>
                            </Link>
                        )}
                    </span>
                </div>
            </nav>
            
            {/* Cart Modal */}
            {isCartOpen && <CartModal products={products} isOpen={isCartOpen} onClose={handleCartToggle} />}
            
            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div 
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={backdropVariants}
                            onClick={handleMobileMenuToggle}
                        />
                        <motion.div 
                            className="fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-gray-900 z-50 mobile-menu-scroll overflow-y-auto"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={mobileMenuVariants}
                        >
                            <div className="sticky top-0 dark:bg-gray-900 bg-white p-4 border-b dark:border-gray-700 border-gray-200 flex justify-between items-center">
                                <Link to="/" className="font-display text-xl" onClick={handleMobileMenuToggle}>
                                    feb<span className="text-gold">luxury</span>
                                </Link>
                                <div className="flex items-center gap-2">
                                    <ToggleTheme />
                                    <button 
                                        onClick={handleMobileMenuToggle} 
                                        className="p-1 hover:text-gold transition-colors duration-300"
                                        aria-label="Close menu"
                                    >
                                        <span className="material-icons text-xl">close</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Mobile Search */}
                            <div className="p-4">
                                <form 
                                    className="relative flex items-center"
                                    onSubmit={handleSearchSubmit}
                                >
                                    <input 
                                        type="text" 
                                        placeholder="Search products..." 
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="w-full py-2 px-4 pr-10 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    />
                                    <button 
                                        type="submit"
                                        className="absolute right-3 text-gray-500 dark:text-gray-400"
                                    >
                                        <i className="ri-search-line"></i>
                                    </button>
                                </form>
                            </div>
                            
                            <div className="p-4 overflow-y-auto dark:text-gray-200">
                                {/* Navigation Links */}
                                <ul className="space-y-1 mb-6">
                                    {navigationLinks.map((link, index) => (
                                        <li key={index}>
                                            <Link
                                                to={link.path}
                                                onClick={handleMobileMenuToggle}
                                                className={`flex items-center py-2 px-3 rounded-md hover:bg-gold/5 hover:text-gold transition-colors duration-200 ${location.pathname === link.path ? 'bg-gold/10 text-gold' : ''}`}
                                            >
                                                <span className="material-icons mr-3 text-lg">
                                                    {link.path === "/" ? "home" : 
                                                     link.path === "/shop" ? "store" :
                                                     link.path === "/about" ? "info" : "mail"}
                                                </span>
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                <div className="border-t border-gray-100 dark:border-gray-700 my-4"></div>

                                {/* Categories Section */}
                                <div className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Categories
                                </div>
                                <ul className="space-y-1">
                                    {/* Fragrances Section First */}
                                    <li>
                                        <button 
                                            onClick={handleFragranceToggle}
                                            className="flex items-center justify-between w-full py-2 px-3 rounded-md hover:bg-gold/5 hover:text-gold transition-colors duration-200"
                                        >
                                            <div className="flex items-center">
                                                <span className="material-icons text-lg mr-3">local_pharmacy</span>
                                                <span>Fragrances</span>
                                            </div>
                                            <span className="material-icons text-lg">
                                                {isFragranceOpen ? 'expand_less' : 'expand_more'}
                                            </span>
                                        </button>
                                        <AnimatePresence>
                                            {isFragranceOpen && (
                                                <motion.ul 
                                                    className="ml-8 mt-1 space-y-1"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {fragranceCategories.map((category, index) => (
                                                        <li key={index}>
                                                            <button
                                                                onClick={() => handleCategoryClick('fragrance', category.path)}
                                                                className='flex items-center py-2 px-3 rounded-md text-gray-600 hover:bg-gold/5 hover:text-gold w-full text-left transition-colors duration-200'
                                                            >
                                                                <span className={`${category.icon} text-lg mr-3`}>
                                                                    {category.iconName}
                                                                </span>
                                                                {category.label}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </li>

                                    <div className="border-t border-gray-100 my-2"></div>

                                    {/* Main Categories */}
                                    {mobileCategories.map((category, index) => (
                                        <li key={index}>
                                            <button
                                                onClick={() => handleCategoryClick(category.path)}
                                                className='flex items-center py-2 px-3 rounded-md hover:bg-gold/5 hover:text-gold w-full text-left transition-colors duration-200'
                                            >
                                                <span className={`${category.icon} text-lg mr-3`}>
                                                    {category.iconName}
                                                </span>
                                                {category.label}
                                            </button>
                                        </li>
                                    ))}

                                    <div className="border-t border-gray-100 my-2"></div>

                                    {/* Accessories Section */}
                                    <li>
                                        <button 
                                            onClick={handleAccessoriesToggle}
                                            className="flex items-center justify-between w-full py-2 px-3 rounded-md hover:bg-gold/5 hover:text-gold transition-colors duration-200"
                                        >
                                            <div className="flex items-center">
                                                <span className="material-icons text-lg mr-3">diamond</span>
                                                <span>Accessories</span>
                                            </div>
                                            <span className="material-icons text-lg">
                                                {isAccessoriesOpen ? 'expand_less' : 'expand_more'}
                                            </span>
                                        </button>
                                        <AnimatePresence>
                                            {isAccessoriesOpen && (
                                                <motion.ul 
                                                    className="ml-8 mt-1 space-y-1"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {accessoriesCategories.map((category, index) => (
                                                        <li key={index}>
                                                            <button
                                                                onClick={() => handleCategoryClick('accessories', category.path)}
                                                                className='flex items-center py-2 px-3 rounded-md text-gray-600 hover:bg-gold/5 hover:text-gold w-full text-left transition-colors duration-200'
                                                            >
                                                                <span className={`${category.icon} text-lg mr-3`}>
                                                                    {category.iconName}
                                                                </span>
                                                                {category.label}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </li>
                                </ul>
                                
                                {/* User Account Section (Mobile) */}
                                {user ? (
                                    <div className="mt-6 border-t border-gray-100 pt-4">
                                        <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Your Account
                                        </div>
                                        <ul className="space-y-1">
                                            {dropdownMenus.map((menu, index) => (
                                                <li key={index}>
                                                    <Link
                                                        to={menu.path}
                                                        className="flex items-center py-2 px-3 rounded-md hover:bg-gold/5 hover:text-gold transition-colors duration-200"
                                                        onClick={handleMobileMenuToggle}
                                                    >
                                                        <span className="material-icons text-lg mr-3">
                                                            {menu.icon}
                                                        </span>
                                                        {menu.label}
                                                    </Link>
                                                </li>
                                            ))}
                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full text-left py-2 px-3 rounded-md hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                                                >
                                                    <span className="material-icons text-lg mr-3">
                                                        logout
                                                    </span>
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="mt-6 border-t border-gray-100 pt-4">
                                        <Link
                                            to="/login"
                                            className="flex items-center justify-center w-full py-3 px-4 bg-gold text-white rounded-md hover:bg-gold-dark transition-colors duration-300"
                                            onClick={handleMobileMenuToggle}
                                        >
                                            <span className="material-icons text-lg mr-2">
                                                login
                                            </span>
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="flex items-center justify-center w-full mt-2 py-3 px-4 border border-gold text-gold rounded-md hover:bg-gold/5 transition-colors duration-300"
                                            onClick={handleMobileMenuToggle}
                                        >
                                            <span className="material-icons text-lg mr-2">
                                                person_add
                                            </span>
                                            Create Account
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;