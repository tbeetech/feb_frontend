import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi'
import { CATEGORIES } from '../../constants/categoryConstants'
import { motion } from 'framer-motion'
import { springAnimation } from '../../utils/animations'
import RatingStars from '../../components/RatingStars'
import ImagePreviewModal from '../../components/ImagePreviewModal'
import ProductCardSkeleton from '../../components/ProductCardSkeleton'

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

const ProductManagement = () => {
  const [filtersState, setFiltersState] = useState({
    category: 'all',
    subcategory: '',
    priceRange: ''
  })
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(8)
  const [previewImage, setPreviewImage] = useState({
    isOpen: false,
    url: '',
    name: ''
  })

  const { category, subcategory, priceRange } = filtersState
  
  // Parse price range
  let minPrice, maxPrice
  if (priceRange) {
    if (priceRange === '400000-Infinity') {
      minPrice = 400000
      maxPrice = undefined
    } else {
      const [min, max] = priceRange.split('-').map(Number)
      minPrice = !isNaN(min) ? min : undefined
      maxPrice = !isNaN(max) && isFinite(max) ? max : undefined
    }
  }

  const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery({
    category: category !== 'all' ? category : '',
    subcategory: subcategory || '',
    minPrice,
    maxPrice,
    page: currentPage,
    limit: productsPerPage,
  })

  const clearFilters = () => {
    setFiltersState({
      category: 'all',
      subcategory: '',
      priceRange: ''
    })
    setCurrentPage(1)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePriceRangeChange = (range) => {
    setFiltersState(prev => ({
      ...prev,
      priceRange: range
    }))
    setCurrentPage(1)
  }

  const handleCategoryChange = (category) => {
    setFiltersState(prev => ({
      ...prev,
      category,
      subcategory: '' // Reset subcategory when category changes
    }))
    setCurrentPage(1)
  }

  const handleSubcategoryChange = (subcategory) => {
    setFiltersState(prev => ({
      ...prev,
      subcategory
    }))
    setCurrentPage(1)
  }

  const openPreview = (e, imageUrl, productName) => {
    e.preventDefault()
    e.stopPropagation()
    setPreviewImage({
      isOpen: true,
      url: imageUrl,
      name: productName
    })
  }

  const closePreview = () => {
    setPreviewImage({
      isOpen: false,
      url: '',
      name: ''
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Product Management</h1>
      
      {/* Filters */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button 
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        </div>
        
        {/* Category Filter */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3 py-1 rounded-full ${
                category === 'all' ? 'bg-black text-white' : 'bg-gray-200'
              }`}
            >
              All
            </button>
            {Object.keys(filters.categories).filter(cat => cat !== 'all').map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1 rounded-full ${
                  category === cat ? 'bg-black text-white' : 'bg-gray-200'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Subcategory Filter */}
        {category !== 'all' && filters.categories[category]?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Subcategories</h3>
            <div className="flex flex-wrap gap-2">
              {filters.categories[category].map((subcat) => (
                <button
                  key={typeof subcat === 'object' ? subcat.value : subcat}
                  onClick={() => handleSubcategoryChange(typeof subcat === 'object' ? subcat.value : subcat)}
                  className={`px-3 py-1 rounded-full ${
                    subcategory === (typeof subcat === 'object' ? subcat.value : subcat) ? 'bg-black text-white' : 'bg-gray-200'
                  }`}
                >
                  {typeof subcat === 'object' ? subcat.label : subcat}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Price Range Filter */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Price Range</h3>
          <div className="flex flex-wrap gap-2">
            {filters.priceRanges.map((range, index) => (
              <button
                key={index}
                onClick={() => handlePriceRangeChange(`${range.min}-${range.max}`)}
                className={`px-3 py-1 rounded-full ${
                  priceRange === `${range.min}-${range.max}` ? 'bg-black text-white' : 'bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Add New Product Button */}
      <div className="mb-8">
        <Link 
          to="/admin/upload-product"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
        >
          + Add New Product
        </Link>
      </div>
      
      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">Error loading products. Please try again.</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">No products found matching your criteria.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <motion.div
                key={product._id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                variants={springAnimation}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover cursor-pointer"
                    onClick={(e) => openPreview(e, product.image, product.name)}
                  />
                  {product.oldPrice > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Sale
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <RatingStars rating={product.rating || 0} />
                  </div>
                  {product.oldPrice > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold">₦{product.price.toLocaleString()}</span>
                      <span className="text-gray-500 line-through text-sm">
                        ₦{product.oldPrice.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="font-bold">₦{product.price.toLocaleString()}</div>
                  )}
                  <div className="mt-4 space-y-2">
                    <Link
                      to={`/admin/edit-product/${product._id}`}
                      className="bg-blue-600 text-white w-full py-2 rounded flex items-center justify-center hover:bg-blue-700 transition-all"
                    >
                      Edit Product
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-full ${
                      currentPage === page
                        ? 'bg-black text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={previewImage.isOpen}
        imageUrl={previewImage.url}
        altText={previewImage.name}
        onClose={closePreview}
      />
    </div>
  )
}

export default ProductManagement 