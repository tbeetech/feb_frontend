import React from 'react';
import { Link } from 'react-router-dom';

const cards = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    tag: '100% Egyptian Cotton',
    title: 'Crochet Couture',
    desc: 'Timeless dresses & airy separates',
    link: '/categories/fashion',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    tag: 'Handwoven Daily Wear',
    title: 'Artisanal Accessories',
    desc: 'Totes, bucket hats & delicate jewelry',
    link: '/categories/accessories',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
    tag: 'Hands-on Workshops',
    title: 'Beginner Classes & Kits',
    desc: 'Start your creative crochet journey today',
    link: '/categories/classes',
  },
];

const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="relative overflow-hidden rounded-2xl shadow-md group h-96">
            <img 
              src={card.image} 
              alt={card.title} 
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F223D]/90 via-[#0F223D]/40 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs uppercase tracking-widest text-[#E8C5A5] font-semibold mb-1">
                {card.tag}
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {card.title}
              </h3>
              <p className="text-sm text-stone-200 mb-4">
                {card.desc}
              </p>
              <Link 
                to={card.link} 
                className="inline-block bg-[#E8C5A5] text-[#0F223D] px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-white hover:text-[#0F223D] transition-colors w-fit"
              >
                Discover Collection
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;