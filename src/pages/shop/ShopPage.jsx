import { useState } from 'react'
import ProductCards from './ProductCards'
import ShopFiltering from './ShopFiltering'
import ShopHeader from './ShopHeader'
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi'
import { CATEGORIES } from '../../constants/categoryConstants'

const filters = {
  categories: {
    all: [],
    accessories: CATEGORIES.ACCESSORIES.subcategories,
    fragrance: CATEGORIES.FRAGRANCE.subcategories,
    bags: [],
    clothes: [],
    jewerly: []
  },
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
    subcategory: '',
    priceRange: ''
  })
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1);
  const [ProductsPerPage] = useState(8);

  const { category, subcategory, priceRange } = filtersState;
  
  // Update price range parsing logic
  let minPrice, maxPrice;
  if (priceRange) {
    if (priceRange === '400000-Infinity') {
      minPrice = 400000;
      maxPrice = undefined;
    } else {
      const [min, max] = priceRange.split('-').map(Number);
      minPrice = !isNaN(min) ? min : undefined;
      maxPrice = !isNaN(max) && isFinite(max) ? max : undefined;
    }
  }

  const { data: { products = [], totalPages, totalProducts } ={}, error, isLoading} = useFetchAllProductsQuery({
    category: category !== 'all' ? category : '',
    subcategory: subcategory ? subcategory.replace(/\s+/g, '-').toLowerCase() : '',
    minPrice,
    maxPrice,
    page: currentPage,
    limit: ProductsPerPage,
  })

    const clearFilters = () => {
      setFiltersState({
        category: 'all',
        subcategory: '',
        priceRange: ''
      })
    }

    const handlePageChange =(pageNumber)=> {
      if(pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber)
      }
    }

    // Add handler for price range changes
    const handlePriceRangeChange = (range) => {
      setFiltersState(prev => ({
        ...prev,
        priceRange: `${range.min}-${range.max === Infinity ? 'Infinity' : range.max}`
      }));
      setCurrentPage(1);
    };

    if(isLoading) return <div>Loading...</div>
    if(error) return <div>Error Loading products.</div>

    const startProduct = (currentPage - 1) * ProductsPerPage + 1; 
    const endProduct = startProduct + products.length - 1;
  return(
    <>
      <ShopHeader products={products} />
      <section className='section__container'>
        <div className='md:hidden mb-4'>
          <button 
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className='bg-primary text-white px-4 py-2 rounded-md'
          >
            <i className="ri-filter-line mr-2"></i>
            Filters
          </button>
        </div>
        <div className='flex flex-col md:flex-row md:gap-12 gap-8'>
          {/* Filter section - show based on screen size or toggle */}
          <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} md:block`}>
            <ShopFiltering
              filters={filters}
              filtersState={filtersState}
              setFiltersState={setFiltersState}
              clearFilters={clearFilters}
              onPriceRangeChange={handlePriceRangeChange}
              closeMobileFilter={() => setIsMobileFilterOpen(false)}
            />
          </div>

          {/* right side */}
          <div>
            <h3 className='text-x1 font-medium mb-4'>
              Showing {startProduct} to {endProduct} of {totalProducts} products
              </h3>
            <ProductCards products={products} />

            {/* pagination controls */}
            <div className='mt-6 flex justify-center gap-2'>
                <button
                    disabled={currentPage === 1}
                    onClick={()=> handlePageChange(currentPage -1)} 
                    className='px-4 py-2 text-gray-700 border border-gray-300 hover:border-primary disabled:opacity-50 disabled:hover:border-gray-300'>
                    &#8592;</button>
                    {
                        [...Array(totalPages)].map((_, index)=> (
                          <button key={index}
                          onClick={()=> handlePageChange(index + 1)}
                          className={`px-4 py-2 border ${
                            currentPage === index + 1
                                ? 'border-primary text-primary'
                                : 'border-gray-300 text-gray-700 hover:border-primary'
                          }`}
                          >{index + 1}</button>
                        ))
                    }
                    <button
                    disabled={currentPage === totalPages}
                     onClick={()=> handlePageChange(currentPage + 1)} 
                    className='px-4 py-2 text-gray-700 border border-gray-300 hover:border-primary disabled:opacity-50 disabled:hover:border-gray-300'>
                    &#8594;</button>
            </div>
          </div>

        </div>
      </section>

    </>
  )
}
export default ShopPage