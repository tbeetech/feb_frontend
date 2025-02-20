import React from 'react'
import Banner from './Banner'
import Categories from './Categories'
import HeroSection from './HeroSection'
import TrendingProduct from '../shop/TrendingProducts'
import DealsSection from './DealsSection'
import PromoBanner from './PromoBanner'
const Home = () => {
  return (
   <>
   <Banner/>
   <Categories/>
   <HeroSection/>
   <TrendingProduct/>
   <DealsSection/>
   <PromoBanner/>
   </>
  )
}

export default Home
