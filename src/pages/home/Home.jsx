import React from 'react'
import InfiniteScrollSection from './InfiniteScrollSection'
import NewArrivalsSlider from '../../components/NewArrivalsSlider'
import TrendingProductSlider from '../../components/TrendingProductSlider'
import DealsSection from './DealsSection';
import PromoBanner from './PromoBanner';
import TestimonialsSlider from '../../components/TestimonialsSlider'

const Home = () => {
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
      
      {/* Trending Products Section */}
      <section className="py-12 bg-gradient-to-r from-primary-light/20 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-12">
            Trending Products
          </h2>
          <TrendingProductSlider />
        </div>
      </section>
{/* Testimonials Section */}
<TestimonialsSlider />
      <DealsSection />
      <PromoBanner />
    </main>
  )
}

export default Home
