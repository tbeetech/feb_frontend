import React from 'react';
import { Link } from 'react-router-dom';
import bannerImg from '../../assets/header.png';

const Banner = () => {
  return (
    <div className="section__container header__container flex flex-col md:flex-row items-center justify-between py-12">
      <div className="header__content z-30 text-center md:text-left">
        <h4 className="uppercase text-lg text-gray-600">UP TO 30% Discount on</h4>
        <h1 className="text-5xl font-bold text-gray-800">Unisex Fashion</h1>
        <p className="text-gray-600 mt-4">
          Discover the latest trends and express your unique style at febluxury. Explore a curated collection of clothing and accessories that cater to every taste and occasion.
        </p>
        <button className="btn bg-primary text-white px-6 py-3 rounded-lg mt-6">
          <Link to="/shop">Explore Now</Link>
        </button>
      </div>
      <div className="header__images mt-8 md:mt-0">
        <img src={bannerImg} alt="banner img" className="w-full h-auto" />
      </div>
    </div>
  );
};

export default Banner;