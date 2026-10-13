import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    {
      name: 'Crochet Fashion',
      tagline: 'Wearable Art & Resort Sets',
      path: 'fashion',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Artisanal Accessories',
      tagline: 'Handwoven Bags & Hats',
      path: 'accessories',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Custom Pieces',
      tagline: 'Bespoke Measurements',
      path: 'custom',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Crochet Classes',
      tagline: 'Beginner Workshops & Kits',
      path: 'classes',
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80'
    },
  ];

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest text-[#C49B76] font-semibold">Artisanal Collections</span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F223D] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          Crafted For The Discerning
        </h2>
        <div className="w-16 h-0.5 bg-[#C49B76] mx-auto mt-3"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/categories/${category.path}`}
            className="group block relative overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 bg-stone-50 border border-stone-200"
          >
            <div className="relative w-full h-80 overflow-hidden">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F223D]/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <span className="text-[11px] font-light text-[#E8C5A5] uppercase tracking-wider block mb-1">
                  {category.tagline}
                </span>
                <h3 className="text-xl font-serif font-bold group-hover:text-[#E8C5A5] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {category.name}
                </h3>
                <span className="mt-2 inline-flex items-center text-xs font-medium text-stone-200 group-hover:translate-x-1 transition-transform">
                  Explore Collection &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;