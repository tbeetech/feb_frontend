import React from 'react'
import InfiniteScrollSection from './InfiniteScrollSection'
import NewArrivalsSlider from '../../components/NewArrivalsSlider'
import TrendingProducts from '../../components/TrendingProducts'

const HomePage = () => {
  return (
    <main className="min-h-screen">
      <InfiniteScrollSection />
      
      {/* New Arrivals Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-12">
            New Arrivals
          </h2>
          <NewArrivalsSlider />
        </div>
      </section>
      
      <TrendingProducts />
    </main>
  )
}

export default HomePage
