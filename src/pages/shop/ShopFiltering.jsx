import React from 'react'

const ShopFiltering = ({filters, filtersState, setFiltersState, clearFilters}) => {
  if (!filters || !filters.categories) {
    return <div>Loading...</div>
  }

  return (
    <div className='space-y-5 flex-shrink-0'>
      <h3>Filters</h3>
      {/* categories */}
      <div className='flex flex-col space-y-2'>
        <h4 className='font-medium text-lg'>Category</h4>
        <hr/>
        {
          filters.categories.map((category)=>(
            <label key={category} className='capitalize cursor-pointer'>
              <input 
                type="radio" 
                name='category' 
                id='category'
                value={category} 
                checked={filtersState?.category === category}
                onChange={(e)=>setFiltersState({...filtersState, category: e.target.value})}
              />
              <span className='ml-1'>{category}</span>
            </label>
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
      <button onClick={clearFilters} className='bg-primary py-1 text-white rounded'>
          Clear Filters
      </button>
    </div>  
  )
}

export default ShopFiltering