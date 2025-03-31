import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import avatarImg from "../assets/avatar.png";
import { AnimatePresence, motion } from 'framer-motion';
import CartModal from '../pages/shop/CartModal';

const BottomNav = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
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
    
    return (
        <>
            <div className="fixed-bottom-nav fixed bottom-0 left-0 right-0 z-30 lg:hidden">
                <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
                    <div className="max-w-md mx-auto">
                        <nav className="flex justify-around items-center h-16">
                            <Link 
                                to="/" 
                                className={`bottom-nav-link flex flex-col items-center text-xs py-1 ${
                                    location.pathname === '/' ? 'text-gold' : 'text-gray-600 dark:text-gray-300'
                                }`}
                            >
                                <span className="material-icons text-xl mb-0.5">home</span>
                                <span>Home</span>
                            </Link>
                            
                            <button 
                                onClick={() => setShowSearch(!showSearch)} 
                                className={`bottom-nav-link flex flex-col items-center text-xs py-1 ${
                                    showSearch ? 'text-gold' : 'text-gray-600 dark:text-gray-300'
                                }`}
                            >
                                <span className="material-icons text-xl mb-0.5">search</span>
                                <span>Search</span>
                            </button>
                            
                            <Link 
                                to="/shop" 
                                className={`bottom-nav-link flex flex-col items-center text-xs py-1 ${
                                    location.pathname === '/shop' ? 'text-gold' : 'text-gray-600 dark:text-gray-300'
                                }`}
                            >
                                <span className="material-icons text-xl mb-0.5">store</span>
                                <span>Shop</span>
                            </Link>
                            
                            <button 
                                onClick={() => setIsCartOpen(true)}
                                className="bottom-nav-link flex flex-col items-center text-xs py-1 text-gray-600 dark:text-gray-300 relative"
                            >
                                <span className="material-icons text-xl mb-0.5">shopping_bag</span>
                                {productCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {productCount > 99 ? '99+' : productCount}
                                    </span>
                                )}
                                <span>Cart</span>
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
                            className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-inner p-3"
                        >
                            <form onSubmit={handleSearchSubmit} className="flex items-center">
                                <input 
                                    type="text" 
                                    placeholder="Search products..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                                />
                                <button 
                                    type="submit"
                                    className="bg-gold text-white py-2 px-4 rounded-r-md"
                                >
                                    <span className="material-icons">search</span>
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Cart Modal */}
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default BottomNav;
