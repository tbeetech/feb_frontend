import React from 'react';
import card1 from '../../assets/card-1.png';
import card2 from '../../assets/card-2.png';
import card3 from '../../assets/card-3.png';

const cards = [
  {
    id: 1,
    image: card1,
    trend: '2025 Trend',
    title: 'Unisex Shirts',
  },
  {
    id: 2,
    image: card2,
    trend: '2025 Trend',
    title: 'Unisex Dresses',
  },
  {
    id: 3,
    image: card3,
    trend: '2025 Trend',
    title: 'Unisex Casuals',
  },
];

const HeroSection = () => {
  return (
    <section className="section__container hero__container grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
      {cards.map((card) => (
        <div key={card.id} className="hero__card relative overflow-hidden rounded-lg shadow-lg">
          <img src={card.image} alt="" className="w-full h-full object-cover" />
          <div className="hero__content absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4">
            <p className="text-lg">{card.trend}</p>
            <h4 className="text-2xl font-bold">{card.title}</h4>
            <a href="#" className="mt-4 bg-primary text-white px-4 py-2 rounded-lg">
              Discover more
            </a>
          </div>
        </div>
      ))}
    </section>
  );
};

export default HeroSection;