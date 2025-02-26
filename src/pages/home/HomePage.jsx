import React from 'react'
import InfiniteScrollSection from './InfiniteScrollSection'
import TrendingProducts from '../../components/TrendingProducts'
// ... other imports

const HomePage = () => {
  return (
    <>
      <InfiniteScrollSection />
      <TrendingProducts />
      {/* ... other sections */}
    </>
  )
}

export default HomePage
