import React from 'react';
import InfiniteScrollSection from './InfiniteScrollSection';
import Banner from './Banner';
import Categories from './Categories';
import HeroSection from './HeroSection';
import TrendingProduct from '../shop/TrendingProducts';
import DealsSection from './DealsSection';
import PromoBanner from './PromoBanner';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <InfiniteScrollSection />
      <div className="space-y-8">
        {/* <Banner /> */}
        <Categories />
        {/* <HeroSection /> */}
        <TrendingProduct />
        <DealsSection />
        <PromoBanner />
      </div>
    </div>
  );
};

export default Home;
