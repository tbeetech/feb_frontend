import React, { useState, useEffect } from 'react'
import ProductCards from '../../pages/shop/ProductCards'
import ShopFiltering from '../../pages/shop/ShopFiltering'
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi'
const filters = {
  categories: ['all', 'accessories', 'bags', 'clothes', 'jewerly', 'perfumes'],
  priceRanges: [
    { label: 'Under ₦50,000', min: 0, max: 50000 },
    { label: '₦50,000 - ₦100,000', min: 50000, max: 100000 },
    { label: '₦100,000 - ₦400,000', min: 100000, max: 400000 },
    { label: '₦400,000 & above', min: 400000, max: Infinity },
  ]
}
const ShopPage = () => {
  const [filtersState, setFiltersState] = useState({
    category: 'all',
    priceRange: ''
  })

  const [currentPage, setCurrentPage] = useState(1);
  const [ProductsPerPage] = useState(8);

  const { category, priceRange } = filtersState;
  const [minPrice, maxPrice] = priceRange.split('-').map(Number);

  const { data: { products = [], totalPages, totalProducts } ={}, error, isLoading} = useFetchAllProductsQuery({
    category: category !== 'all' ? category : '',
    minPrice: isNaN(minPrice) ? '' : minPrice,
    maxPrice: isNaN(maxPrice) ? '' : maxPrice,
    page: currentPage,
    limit: ProductsPerPage,
  })

    const clearFilters = () => {
      setFiltersState({
        category: 'all',
        priceRange: ''
      })
    }
    if(isLoading) return <div>Loading...</div>
    if(error) return <div>Error Loading products.</div>
  return(
    <>
      <section className='section__container bg-primary-light'>
        <h2 className='section__header capitalize'>Shop page</h2>
        <p className='section__subheader'>Discover the hotest picks, Elevate your style with our curated collection of trending women fashion products</p>

      </section>
      <section className='section__container'>
        <div className='flex flex-col md:flex-row md:gap-12 gap-8'>
          {/* left side */}
          <ShopFiltering
            filters={{ categories: filters.categories, priceRanges: filters.priceRanges }}
            filtersState={filtersState}
            setFiltersState={setFiltersState}
            clearFilters={clearFilters}
          />

          {/* right side */}
          <div>
            <h3 className='text-x1 font-medium mb-4'>Products available: {products.length}</h3>
            <ProductCards products={products} />
          </div>

        </div>
      </section>

    </>
  )
}
export default ShopPage