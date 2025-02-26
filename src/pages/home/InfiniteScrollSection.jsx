import React from 'react';
import { Link } from 'react-router-dom';
import image1 from '../../assets/scroll-1.jpg';

const InfiniteScrollSection = () => {
  return (
    <section className="relative h-[90vh] mb-0 overflow-hidden">
      <div className="h-full">
        <img 
          src={image1} 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold mb-4 text-white">F.E.B LUXURY</h1>
          <p className="text-xl mb-6 text-white">Boost Your Confidence</p>
          <Link 
            to="/shop" 
            className="btn bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg transition-all"
          >
            Explore Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InfiniteScrollSection;
