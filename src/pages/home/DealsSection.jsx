import React from 'react';
import dealsImg from '../../assets/deals.png';

const DealsSection = () => {
  return (
    <section className="section__container deals__container flex flex-col md:flex-row items-center justify-between py-12">
      <div className="deals__image w-full md:w-1/2">
        <img src={dealsImg} alt="deals" className="w-full h-auto rounded-lg shadow-lg" />
      </div>
      <div className="deals__content w-full md:w-1/2 mt-8 md:mt-0 md:ml-8 text-center md:text-left">
        <h5 className="text-lg text-gray-600">Get Up To 20% Discount</h5>
        <h4 className="text-4xl font-bold text-gray-800 mt-2">Deals Of This Month</h4>
        <p className="text-gray-600 mt-4">
          Our Unisex Fashion Deals of the Month are here to make your style dreams a reality without breaking the bank. Discover a curated collection of exquisite clothing, accessories, and footwear, all handpicked to elevate your wardrobe.
        </p>
        <div className="deals__countdown flex justify-center md:justify-start gap-4 mt-6">
          <div className="deals__countdown__card bg-primary text-white p-4 rounded-lg shadow-lg">
            <h4 className="text-2xl font-bold">14</h4>
            <p>Days</p>
          </div>
          <div className="deals__countdown__card bg-primary text-white p-4 rounded-lg shadow-lg">
            <h4 className="text-2xl font-bold">20</h4>
            <p>Hours</p>
          </div>
          <div className="deals__countdown__card bg-primary text-white p-4 rounded-lg shadow-lg">
            <h4 className="text-2xl font-bold">15</h4>
            <p>Mins</p>
          </div>
          <div className="deals__countdown__card bg-primary text-white p-4 rounded-lg shadow-lg">
            <h4 className="text-2xl font-bold">05</h4>
            <p>Secs</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;