import { useState, useRef } from 'react'
import ProductCards from './ProductCards'
import ShopFiltering from './ShopFiltering'
import ShopHeader from './ShopHeader'
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi'
import { CATEGORIES } from '../../constants/categoryConstants'
import { CiFilter, CiGrid41, CiGrid2H } from 'react-icons/ci'
import { FaChevronLeft, FaChevronRight, FaShoppingBag, FaTshirt, FaGem, FaShoePrints, FaBriefcase, FaStar, FaSprayCan } from 'react-icons/fa'
import ProductCardSkeleton from '../../components/ProductCardSkeleton'
import { GiDress } from 'react-icons/gi'

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
    priceRange: '',
    stockStatus: '' // Add stock status to filter state
  })
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  const [currentPage, setCurrentPage] = useState(1);
  const [ProductsPerPage] = useState(12);

  const { category, subcategory, priceRange, stockStatus } = filtersState;
  
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

  // Map stock status to API query parameter
  const stockStatusMap = {
    'in-stock': 'In Stock',
    'pre-order': 'Pre Order'
  };

  const { data: { products = [], totalPages, totalProducts } ={}, error, isLoading} = useFetchAllProductsQuery({
    category: category !== 'all' ? category : '',
    subcategory: subcategory ? subcategory.replace(/\s+/g, '-').toLowerCase() : '',
    minPrice,
    maxPrice,
    stockStatus: stockStatusMap[stockStatus] || '',
    page: currentPage,
    limit: ProductsPerPage,
  })

  const clearFilters = () => {
    setFiltersState({
      category: 'all',
      subcategory: '',
      priceRange: '',
      stockStatus: ''
    })
    setCurrentPage(1)
  }

  const handlePageChange = (pageNumber) => {
    if(pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const categorySliderRef = useRef(null);
  
  const handleCategoryClick = (category) => {
    setFiltersState(prev => ({
      ...prev,
      category: category === 'all' ? 'all' : category,
      subcategory: ''
    }));
    setCurrentPage(1);
  };
  
  const scrollCategories = (direction) => {
    if (categorySliderRef.current) {
      categorySliderRef.current.scrollBy({
        left: direction * 200,
        behavior: 'smooth'
      });
    }
  };
  
  // Generate all categories for the slider
  const allCategoryOptions = [
    { value: 'all', label: 'All Products', icon: <FaShoppingBag className="w-4 h-4" /> },
    { value: 'new', label: 'New Arrivals', icon: <FaStar className="w-4 h-4" /> },
    { value: 'clothes', label: 'Clothing', icon: <FaTshirt className="w-4 h-4" /> },
    { value: 'dress', label: 'Dresses', icon: <GiDress className="w-4 h-4" /> },
    { value: 'shoes', label: 'Shoes', icon: <FaShoePrints className="w-4 h-4" /> },
    { value: 'bags', label: 'Bags', icon: <FaShoppingBag className="w-4 h-4" /> },
    { value: 'accessories', label: 'Accessories', icon: <FaGem className="w-4 h-4" /> },
    { value: 'fragrance', label: 'Fragrances', icon: <FaSprayCan className="w-4 h-4" /> },
    { value: 'corporate', label: 'Corporate Wear', icon: <FaBriefcase className="w-4 h-4" /> },
  ];

  if(isLoading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Shop</h1>
        <p className="text-gray-600">Browse our collection</p>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-40 h-6 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Skeleton for filters panel */}
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="w-32 h-6 bg-gray-200 animate-pulse rounded mb-4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="mb-4">
                <div className="w-full h-5 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Skeleton for products grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
  
  if(error) return (
    <div className="text-center py-10 text-red-500">
      Error loading products. Please try again later.
    </div>
  )

  const startProduct = (currentPage - 1) * ProductsPerPage + 1; 
  const endProduct = Math.min(startProduct + products.length - 1, totalProducts);

  return(
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Slider */}
      <div className="mb-6 relative">
        <button 
          onClick={() => scrollCategories(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 p-2 hover:border-gray-400 transition-colors duration-200"
          aria-label="Scroll categories left"
        >
          <FaChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        
        <div 
          ref={categorySliderRef}
          className="flex space-x-3 overflow-x-auto py-2 px-8 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allCategoryOptions.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryClick(cat.value)}
              className={`flex items-center space-x-2 px-4 py-2 min-w-max border transition-all duration-200
                ${category === cat.value 
                  ? 'border-black text-black bg-white' 
                  : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'}`}
            >
              <span className="text-current">{cat.icon}</span>
              <span className="font-medium">{cat.label}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => scrollCategories(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 p-2 hover:border-gray-400 transition-colors duration-200"
          aria-label="Scroll categories right"
        >
          <FaChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <ShopHeader products={products} />
      
      <div className="border-t border-gray-200 pt-6 pb-4">
        {/* Filtering controls */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-sm"
            >
              <CiFilter className="h-5 w-5" />
              <span>All Filters</span>
            </button>
            
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 ${viewMode === 'grid' ? 'text-black' : 'text-gray-400'}`}
              >
                <CiGrid41 className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 ${viewMode === 'list' ? 'text-black' : 'text-gray-400'}`}
              >
                <CiGrid2H className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {startProduct}-{endProduct} of {totalProducts} results
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters panel */}
          <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
            <ShopFiltering
              filters={filters}
              filtersState={filtersState}
              setFiltersState={setFiltersState}
              clearFilters={clearFilters}
              onPriceRangeChange={handlePriceRangeChange}
              closeMobileFilter={() => setIsMobileFilterOpen(false)}
            />
          </div>
          
          {/* Products grid */}
          <div className="flex-1">
            <ProductCards products={products} viewMode={viewMode} />
            
            {/* Empty state */}
            {products.length === 0 && (
              <div className="text-center py-16 border border-gray-200">
                <h3 className="text-lg text-gray-500 mb-2">No products found</h3>
                <p className="text-sm text-gray-400 mb-4">Try adjusting your filters</p>
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50"
                >
                  Clear all filters
                </button>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex border border-gray-200 divide-x">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)} 
                    className="px-4 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                  >
                    Previous
                  </button>
                  
                  {totalPages <= 5 ? (
                    [...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 ${
                          currentPage === index + 1
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))
                  ) : (
                    <>
                      {/* First page */}
                      <button
                        onClick={() => handlePageChange(1)}
                        className={`px-4 py-2 ${
                          currentPage === 1
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        1
                      </button>
                      
                      {/* Ellipsis if needed */}
                      {currentPage > 3 && (
                        <span className="px-4 py-2 text-gray-500">...</span>
                      )}
                      
                      {/* Pages around current page */}
                      {[...Array(5)]
                        .map((_, i) => {
                          const pageNum = currentPage - 2 + i;
                          return pageNum > 1 && pageNum < totalPages ? pageNum : null;
                        })
                        .filter(Boolean)
                        .map(pageNum => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 ${
                              currentPage === pageNum
                                ? 'bg-black text-white'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      
                      {/* Ellipsis if needed */}
                      {currentPage < totalPages - 2 && (
                        <span className="px-4 py-2 text-gray-500">...</span>
                      )}
                      
                      {/* Last page */}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-4 py-2 ${
                          currentPage === totalPages
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)} 
                    className="px-4 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

ShopPage.propTypes = {
    // Component doesn't take any props currently
}

export default ShopPage