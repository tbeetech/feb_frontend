import React, { useState } from 'react'

const ShopFiltering = ({filters, filtersState, setFiltersState, clearFilters, closeMobileFilter}) => {
  const [expandedCategory, setExpandedCategory] = useState(null)

  const handleCategoryClick = (category) => {
    setFiltersState({
      ...filtersState,
      category,
      subcategory: '' // Reset subcategory when changing main category
    })
    setExpandedCategory(category === expandedCategory ? null : category)
  }

  const handleSubcategoryClick = (subcategory) => {
    setFiltersState({
      ...filtersState,
      subcategory
    })
    if (window.innerWidth < 768) {
      closeMobileFilter()
    }
  }

  if (!filters || !filters.categories) {
    return <div>Loading...</div>
  }

  return (
    <div className='space-y-5 flex-shrink-0 bg-white p-4 md:p-0'>
      <div className='flex justify-between items-center md:hidden'>
        <h3 className='font-bold'>Filters</h3>
        <button onClick={closeMobileFilter} className='text-gray-500'>
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>

      {/* categories */}
      <div className='flex flex-col space-y-2'>
        <h4 className='font-medium text-lg'>Category</h4>
        <hr/>
        {
          Object.keys(filters.categories).map((category) => (
            <div key={category}>
              <label className='capitalize cursor-pointer flex items-center'>
                <input 
                  type="radio" 
                  name='category'
                  value={category}
                  checked={filtersState.category === category}
                  onChange={() => handleCategoryClick(category)}
                />
                <span className='ml-2'>{category}</span>
                {filters.categories[category].length > 0 && (
                  <i className={`ri-arrow-${expandedCategory === category ? 'up' : 'down'}-s-line ml-auto`}></i>
                )}
              </label>
              
              {/* Subcategories */}
              {expandedCategory === category && filters.categories[category].length > 0 && (
                <div className='ml-6 mt-2 space-y-2'>
                  {filters.categories[category].map((subcategory) => (
                    <label key={subcategory} className='capitalize cursor-pointer block'>
                      <input 
                        type="radio"
                        name='subcategory'
                        value={subcategory}
                        checked={filtersState.subcategory === subcategory}
                        onChange={() => handleSubcategoryClick(subcategory)}
                      />
                      <span className='ml-2'>{subcategory.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))
        }
      </div>

      {/* pricing filters */}
      <div className='flex flex-col space-y-2'>
        <h4 className='font-medium text-lg'>Price Range</h4>
        <hr/>
        {
          filters.priceRanges.map((range)=>(
            <label key={range.label} className='capitalize cursor-pointer'>
              <input 
                type="radio" 
                name='priceRange' 
                id='priceRange'
                value={`${range.min}-${range.max}`}
                checked={filtersState?.priceRange === `${range.min}-${range.max}`}
                onChange={(e)=>setFiltersState({...filtersState, priceRange: e.target.value})}
              />
              <span className='ml-1'>{range.label}</span>
            </label>
          ))
        }
      </div>
      <button 
        onClick={() => {
          clearFilters()
          if (window.innerWidth < 768) {
            closeMobileFilter()
          }
        }} 
        className='bg-primary py-1 px-4 text-white rounded w-full'
      >
        Clear Filters
      </button>
    </div>  
  )
}

export default ShopFiltering