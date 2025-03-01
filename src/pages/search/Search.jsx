import React, { useState, useEffect } from 'react'
import ProductCards from '../shop/ProductCards'
import { useSearchProductsQuery } from '../../redux/features/products/productsApi'
import { motion } from 'framer-motion';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce search query
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Fetch products based on search query
    const { data, isLoading, error } = useSearchProductsQuery(debouncedQuery, {
        skip: debouncedQuery === ''
    });

    const products = data?.products || [];

    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>Search Products</h2>
                <p className='section__subheader'>Find your perfect style from our diverse collection</p>
            </section>

            <section className='section__container'>
                <motion.div 
                    className='w-full mb-12 flex flex-col md:flex-row items-center justify-center gap-4'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='search-bar w-full max-w-4xl p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary'
                        placeholder='Search for items by name, category, or description...'
                    />
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">
                        Error: {error.message}
                    </div>
                ) : (
                    <>
                        {searchQuery && (
                            <div className="mb-8 text-gray-600 text-center">
                                Found {products.length} results for "{searchQuery}"
                            </div>
                        )}
                        
                        {products.length > 0 ? (
                            <ProductCards products={products}/>
                        ) : searchQuery ? (
                            <div className="text-center text-gray-600">
                                No products found matching "{searchQuery}"
                            </div>
                        ) : (
                            <div className="text-center text-gray-600">
                                Start typing to search for products
                            </div>
                        )}
                    </>
                )}
            </section>
        </>
    )
}

export default Search