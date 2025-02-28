import React, { useState, useEffect } from 'react'
import productsData from "../../data/products.json"
import ProductCards from '../shop/ProductCards'

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(productsData);

    const handleSearch = (query) => {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            setFilteredProducts(productsData);
            return;
        }

        const filtered = productsData.filter(product => {
            // Create an array of searchable fields
            const searchableFields = [
                product.name,
                product.description,
                product.category,
                product.subcategory,
                product.price?.toString()
            ];

            // Check if any field contains the search term
            return searchableFields.some(field => 
                field?.toLowerCase().includes(searchTerm)
            );
        });

        setFilteredProducts(filtered);
    };

    // Handle input change with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch(searchQuery);
        }, 300); // 300ms delay

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>SearchPage</h2>
                <p className='section__subheader'>Browse a diverse range of categories, from classic dresses to stylish outfits. Elevate your style today!</p>
            </section>
            <section className='section__container'>
                <div className='w-full mb-12 flex flex-col md:flex-row items-center justify-center gap-4'>
                    <input 
                        type="text" 
                        value={searchQuery}
                        className='search-bar w-full max-w-4x1 p-2 border rounded'
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Search for items...'
                    />
                </div>
                {filteredProducts.length === 0 ? (
                    <div className="text-center text-gray-600">
                        No products found matching "{searchQuery}"
                    </div>
                ) : (
                    <div>
                        <div className="mb-4 text-gray-600">
                            Found {filteredProducts.length} products
                        </div>
                        <ProductCards products={filteredProducts}/>
                    </div>
                )}
            </section>
        </>
    )
}

export default Search