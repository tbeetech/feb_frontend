import React from 'react';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div className="section__container header__container flex flex-col md:flex-row items-center justify-between py-12 px-4 md:px-8 my-6 bg-gradient-to-br from-[#FAF8F5] via-[#F4EFEA] to-[#EAE0D5] rounded-2xl border border-[#E5DACD] shadow-sm">
      <div className="header__content z-30 text-center md:text-left md:max-w-xl">
        <div className="inline-flex items-center space-x-2 bg-[#0F223D] text-[#E8C5A5] px-3 py-1 rounded-full text-xs uppercase tracking-widest font-medium mb-4">
          <span>Artisanal Weave</span>
          <span>•</span>
          <span>100% Handmade</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#0F223D] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          Wearable Art, <br />
          <span className="italic font-normal text-[#C49B76]">Patiently Stitched.</span>
        </h1>
        <p className="text-stone-600 mt-4 text-base md:text-lg leading-relaxed">
          Welcome to <strong className="text-[#0F223D]">Knitbi</strong>. Explore handcrafted crochet fashion, bespoke couture pieces, statement accessories, and beginner-friendly crochet masterclasses designed for modern soulfulness.
        </p>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
          <Link 
            to="/shop" 
            className="px-8 py-3.5 bg-[#0F223D] text-[#E8C5A5] rounded-full font-medium tracking-wider uppercase text-xs hover:bg-[#1A365D] hover:shadow-lg transition-all"
          >
            Explore Collection
          </Link>
          <Link 
            to="/categories/classes" 
            className="px-8 py-3.5 bg-transparent border border-[#0F223D] text-[#0F223D] rounded-full font-medium tracking-wider uppercase text-xs hover:bg-[#0F223D] hover:text-[#E8C5A5] transition-all"
          >
            Join Crochet Class
          </Link>
        </div>
      </div>
      <div className="header__images mt-10 md:mt-0 relative">
        <div className="w-72 sm:w-80 md:w-96 h-80 sm:h-96 md:h-[440px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform md:rotate-1 hover:rotate-0 transition-transform duration-500">
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80" 
            alt="Knitbi Handmade Crochet Wear" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm p-3.5 rounded-xl border border-stone-200 shadow-lg text-left hidden sm:block">
          <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Signature Piece</p>
          <p className="text-sm font-serif font-bold text-[#0F223D]">Sakura Blossom Maxi Dress</p>
          <p className="text-xs text-[#C49B76] font-medium">100% Combed Egyptian Cotton</p>
        </div>
      </div>
    </div>
  );
};

export default Banner;