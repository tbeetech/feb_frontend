import React, { useState, useEffect, useRef } from 'react'
import ProductCards from '../shop/ProductCards'
import { useSearchProductsQuery } from '../../redux/features/products/productsApi'
import { motion, AnimatePresence } from 'framer-motion';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const searchInputRef = useRef(null);

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
    };

    // Debounce search query
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            if (searchQuery.trim()) {
                saveToHistory(searchQuery);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Close history dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowHistory(false);
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
                className='section__container bg-gradient-to-r from-primary-light to-white pt-28 pb-12'
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
                        <div className="relative rounded-full shadow-md overflow-hidden">
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowHistory(true)}
                                className='w-full py-4 pl-12 pr-4 border-none focus:ring-2 focus:ring-primary rounded-full'
                                placeholder='Search for items by name, category, or description...'
                            />
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </span>
                            {searchQuery && (
                                <button 
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setSearchQuery('')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        
                        {/* Search history dropdown */}
                        <AnimatePresence>
                            {showHistory && searchHistory.length > 0 && (
                                <motion.div 
                                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10 overflow-hidden"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="p-2">
                                        <div className="flex justify-between items-center p-2">
                                            <h3 className="text-sm font-medium text-gray-500">Recent Searches</h3>
                                            <button 
                                                className="text-xs text-gray-500 hover:text-primary"
                                                onClick={clearHistory}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        {searchHistory.map((query, index) => (
                                            <motion.div 
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md flex items-center gap-2"
                                                onClick={() => selectFromHistory(query)}
                                                whileHover={{ x: 5 }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {query}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <motion.p 
                        className="mt-3 text-sm text-gray-500"
                        variants={itemVariants}
                    >
                        Try searching for "shoes", "accessories", or "jewerly"
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
                            <div className="relative w-20 h-20">
                                <motion.div 
                                    className="absolute inset-0 border-4 border-primary/30 rounded-full"
                                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                <motion.div 
                                    className="absolute inset-0 border-4 border-t-primary border-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                            <p className="mt-4 text-gray-500">Searching for "{searchQuery}"</p>
                        </motion.div>
                    ) : error ? (
                        <motion.div 
                            key="error"
                            className="text-center py-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="inline-block p-4 bg-red-50 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Search Error</h3>
                            <p className="text-gray-600 mb-4">{error.message || "Something went wrong with your search"}</p>
                            <button 
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                                onClick={() => setSearchQuery('')}
                            >
                                Clear Search
                            </button>
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
                                            <>Found <span className="text-primary font-bold">{products.length}</span> results for "<span className="italic">{searchQuery}</span>"</>
                                        ) : (
                                            <>No products found matching "<span className="italic">{searchQuery}</span>"</>
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
                                    <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">No results found</h3>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        We couldn't find any products matching "{searchQuery}". 
                                        Try using different keywords or browsing our categories.
                                    </p>
                                    <div className="space-x-4">
                                        <button 
                                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                                            onClick={() => setSearchQuery('')}
                                        >
                                            Clear Search
                                        </button>
                                        <a href="/shop" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
                                            Browse Shop
                                        </a>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className="text-center py-16"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="inline-block p-4 bg-primary-light rounded-full mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">Ready to search</h3>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        Start typing to search for products by name, category, or description
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.section>
        </>
    )
}

export default Search