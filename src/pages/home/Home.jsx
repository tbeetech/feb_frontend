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
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-4">
            New Arrivals
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Discover our latest additions to the luxury collection. These freshly curated pieces represent the pinnacle of contemporary elegance and timeless sophistication.
          </p>
          <NewArrivalsSlider />
        </div>
      </section>
      
      {/* Trending Products Section */}
      <section className="py-12 bg-gradient-to-r from-gray-100/20 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-4">
            Trending Products
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Our most sought-after luxury items that fashion enthusiasts are obsessing over. These carefully selected pieces are setting the standards in premium style and quality.
          </p>
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
