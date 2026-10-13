import React from 'react'
import InfiniteScrollSection from './InfiniteScrollSection'
import Categories from './Categories'
import Banner from './Banner'
import NewArrivalsSlider from '../../components/NewArrivalsSlider'
import TrendingProductSlider from '../../components/TrendingProductSlider'
import DealsSection from './DealsSection'
import PromoBanner from './PromoBanner'
import TestimonialsSlider from '../../components/TestimonialsSlider'
import ProductQuizComponent from './ProductQuizComponent'

const Home = () => {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Hero Banner */}
      <InfiniteScrollSection />

      {/* Featured Categories Grid */}
      <Categories />

      {/* Oriental Artisanal Banner */}
      <div className="container mx-auto px-4">
        <Banner />
      </div>
      
      {/* New Arrivals Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-[#C49B76] font-semibold">Fresh Off The Hook</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F223D] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              New Arrivals
            </h2>
            <p className="text-stone-600 text-center max-w-2xl mx-auto mt-2 text-sm md:text-base">
              Discover our latest handcrafted crochet garments, airy resort silhouettes, and newly announced weekend masterclasses.
            </p>
            <div className="w-16 h-0.5 bg-[#C49B76] mx-auto mt-3"></div>
          </div>
          <NewArrivalsSlider />
        </div>
      </section>
      
      {/* Trending Products Section */}
      <section className="py-16 bg-gradient-to-b from-[#FAF8F5] to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-[#C49B76] font-semibold">Most Loved Pieces</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F223D] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Trending Handmade Wears
            </h2>
            <p className="text-stone-600 text-center max-w-2xl mx-auto mt-2 text-sm md:text-base">
              Our signature crochet pieces setting the standard for conscious luxury, crafted with Egyptian cotton and Japanese paper yarn.
            </p>
            <div className="w-16 h-0.5 bg-[#C49B76] mx-auto mt-3"></div>
          </div>
          <TrendingProductSlider />
        </div>
      </section>
      
      {/* Product Quiz Section */}
      <section className="py-16 bg-[#F4EFEA]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-[#C49B76] font-semibold">Style Concierge</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F223D] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Find Your Perfect Match
            </h2>
            <p className="text-stone-600 text-center max-w-2xl mx-auto mt-2 text-sm md:text-base">
              Take our 30-second quiz to discover custom crochet designs or beginner masterclasses made for your personal vibe.
            </p>
            <div className="w-16 h-0.5 bg-[#C49B76] mx-auto mt-3"></div>
          </div>
          <ProductQuizComponent />
        </div>
      </section>
      
      {/* Testimonials Section */}
      <TestimonialsSlider />

      {/* Limited Offers Section */}
      <DealsSection />

      {/* Values & Assurance Banner */}
      <PromoBanner />
    </main>
  )
}

export default Home
