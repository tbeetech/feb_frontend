import React, { useState, useEffect, useRef } from 'react'
import ProductCards from '../shop/ProductCards'
import { useSearchProductsQuery } from '../../redux/features/products/productsApi'
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const searchInputRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extract query parameter from URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const queryFromUrl = queryParams.get('q');
        
        if (queryFromUrl) {
            setSearchQuery(queryFromUrl);
            setDebouncedQuery(queryFromUrl);
        }
    }, [location.search]);

    // Load search history from localStorage
    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        setSearchHistory(history);
    }, []);

    // Save search to history
    const saveToHistory = (query) => {
        if (!query.trim()) return;
        
        const newHistory = [
            query,
            ...searchHistory.filter(item => item !== query)
        ].slice(0, 5); // Keep only 5 most recent searches
        
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    // Clear search history
    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('searchHistory');
    };

    // Select from history
    const selectFromHistory = (query) => {
        setSearchQuery(query);
        setShowHistory(false);
        updateUrlWithQuery(query);
    };

    // Update URL when search query changes
    const updateUrlWithQuery = (query) => {
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`, { replace: true });
        } else {
            navigate('/search', { replace: true });
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const newQuery = e.target.value;
        setSearchQuery(newQuery);
    };

    // Debounce search query and update URL
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            if (searchQuery.trim()) {
                saveToHistory(searchQuery);
                updateUrlWithQuery(searchQuery);
            } else if (location.search) {
                // Clear URL if search is empty
                navigate('/search', { replace: true });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Close history dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowHistory(false);
                setIsFocused(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch products based on search query
    const { data, isLoading, error } = useSearchProductsQuery(debouncedQuery, {
        skip: debouncedQuery === ''
    });

    const products = data?.products || [];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <>
            <motion.section 
                className='section__container bg-gradient-to-r from-gray-100 to-white pt-28 pb-12'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.h2 
                    className='section__header capitalize text-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Search Products
                </motion.h2>
                <motion.p 
                    className='section__subheader text-center max-w-2xl mx-auto'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Find your perfect style from our diverse collection of premium products
                </motion.p>
            </motion.section>

            <motion.section 
                className='section__container'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div 
                    className='w-full mb-16 flex flex-col items-center justify-center'
                    variants={itemVariants}
                >
                    <div className="relative w-full max-w-3xl" ref={searchInputRef}>
                        <motion.div 
                            className={`relative rounded-full overflow-hidden transition-all duration-300 ease-in-out ${
                                isFocused 
                                    ? 'shadow-lg ring-2 ring-primary/50 bg-white' 
                                    : 'shadow-md hover:shadow-lg bg-white/95'
                            }`}
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            <motion.span 
                                className={`absolute left-6 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                                    isFocused ? 'text-primary' : 'text-gray-400'
                                } ${searchQuery ? 'scale-110' : ''}`}
                                animate={searchQuery ? { x: 0 } : { x: 0 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </motion.span>
                            
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => {
                                    setShowHistory(true);
                                    setIsFocused(true);
                                }}
                                className='w-full py-5 pl-16 pr-14 border-none focus:ring-0 focus:outline-none bg-transparent rounded-full text-gray-800 placeholder-gray-400 transition-all duration-300'
                                placeholder='Search for items by name, category, or description...'
                                style={{ fontSize: '1rem', fontWeight: '400' }}
                            />
                            
                            {searchQuery && (
                                <motion.button 
                                    className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                                    onClick={() => setSearchQuery('')}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </motion.button>
                            )}
                        </motion.div>
                        
                        {/* Search history dropdown */}
                        <AnimatePresence>
                            {showHistory && searchHistory.length > 0 && (
                                <motion.div 
                                    className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl z-10 overflow-hidden backdrop-blur-sm border border-gray-100"
                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    <div className="p-3">
                                        <div className="flex justify-between items-center p-2 border-b border-gray-100 mb-1">
                                            <h3 className="text-sm font-medium text-gray-500">Recent Searches</h3>
                                            <motion.button 
                                                className="text-xs text-gray-500 hover:text-primary px-2 py-1 rounded-full hover:bg-gray-50"
                                                onClick={clearHistory}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Clear All
                                            </motion.button>
                                        </div>
                                        {searchHistory.map((query, index) => (
                                            <motion.div 
                                                key={index}
                                                className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer rounded-lg flex items-center gap-3 transition-all duration-200 my-1"
                                                onClick={() => selectFromHistory(query)}
                                                whileHover={{ x: 5, backgroundColor: 'rgba(243, 244, 246, 0.8)' }}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-gray-700 font-medium">{query}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <motion.p 
                        className="mt-4 text-sm text-gray-500 italic"
                        variants={itemVariants}
                    >
                        Try searching for "shoes", "accessories", or "jewelry"
                    </motion.p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div 
                            key="loading"
                            className="flex flex-col items-center justify-center py-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="relative w-24 h-24">
                                <motion.div 
                                    className="absolute inset-0 border-4 border-primary/20 rounded-full"
                                    animate={{ 
                                        scale: [1, 1.1, 1], 
                                        opacity: [0.5, 0.3, 0.5] 
                                    }}
                                    transition={{ 
                                        duration: 2, 
                                        repeat: Infinity, 
                                        ease: "easeInOut" 
                                    }}
                                />
                                <motion.div 
                                    className="absolute inset-0 border-4 border-primary/40 rounded-full"
                                    animate={{ 
                                        scale: [1, 1.15, 1], 
                                        opacity: [0.7, 0.5, 0.7] 
                                    }}
                                    transition={{ 
                                        duration: 2, 
                                        repeat: Infinity, 
                                        ease: "easeInOut",
                                        delay: 0.2
                                    }}
                                />
                                <motion.div 
                                    className="absolute inset-0 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ 
                                        duration: 1.5, 
                                        repeat: Infinity, 
                                        ease: "linear" 
                                    }}
                                />
                            </div>
                            <motion.p 
                                className="mt-6 text-gray-600 font-medium"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Searching for &ldquo;<span className="text-primary font-semibold">{searchQuery}</span>&rdquo;
                            </motion.p>
                        </motion.div>
                    ) : error ? (
                        <motion.div 
                            key="error"
                            className="text-center py-16"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <motion.div 
                                className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6"
                                initial={{ rotate: -10 }}
                                animate={{ rotate: [0, -5, 0, 5, 0] }}
                                transition={{ 
                                    duration: 0.5, 
                                    delay: 0.2,
                                    ease: "easeInOut"
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </motion.div>
                            <motion.h3 
                                className="text-xl font-bold text-gray-800 mb-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Search Error
                            </motion.h3>
                            <motion.p 
                                className="text-gray-600 mb-6 max-w-md mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {error.message || "Something went wrong with your search"}
                            </motion.p>
                            <motion.button 
                                className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark shadow-md hover:shadow-lg transition-all duration-300"
                                onClick={() => setSearchQuery('')}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                Clear Search
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {searchQuery && (
                                <motion.div 
                                    className="mb-8 text-center"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 className="text-xl font-medium text-gray-800">
                                        {products.length > 0 ? (
                                            <>Found <span className="text-primary font-bold">{products.length}</span> results for &ldquo;<span className="italic">{searchQuery}</span>&rdquo;</>
                                        ) : (
                                            <>No products found matching &ldquo;<span className="italic">{searchQuery}</span>&rdquo;</>
                                        )}
                                    </h3>
                                </motion.div>
                            )}
                            
                            {products.length > 0 ? (
                                <ProductCards products={products}/>
                            ) : searchQuery ? (
                                <motion.div 
                                    className="text-center py-16"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                >
                                    <motion.div 
                                        className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full mb-6 border border-gray-100"
                                        initial={{ y: -10 }}
                                        animate={{ y: [0, -5, 0, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </motion.div>
                                    <motion.h3 
                                        className="text-xl font-medium text-gray-800 mb-3"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        No results found
                                    </motion.h3>
                                    <motion.p 
                                        className="text-gray-600 mb-8 max-w-md mx-auto"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        We couldn&apos;t find any products matching &ldquo;{searchQuery}&rdquo;. 
                                        Try using different keywords or browsing our categories.
                                    </motion.p>
                                    <motion.div 
                                        className="space-x-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <motion.button 
                                            className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark shadow-md hover:shadow-lg transition-all duration-300"
                                            onClick={() => setSearchQuery('')}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            Clear Search
                                        </motion.button>
                                        <motion.a 
                                            href="/shop" 
                                            className="px-6 py-3 bg-gray-50 text-gray-800 rounded-full hover:bg-gray-100 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition-all duration-300"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            Browse Shop
                                        </motion.a>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <div></div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.section>
        </>
    )
}

export default Search