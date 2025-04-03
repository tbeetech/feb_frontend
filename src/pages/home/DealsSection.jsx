import React, { useState, useEffect } from 'react';
import dealsImg from '../../assets/deals.png';
import { motion } from 'framer-motion';

const DealsSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set end date to 14 days from now
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });

      if (distance < 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section__container deals__container flex flex-col md:flex-row items-center justify-between py-12 bg-white">
      <motion.div 
        className="deals__image w-full md:w-1/2"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <img src={dealsImg} alt="deals" className="w-full h-auto rounded-lg shadow-sm" />
      </motion.div>
      <motion.div 
        className="deals__content w-full md:w-1/2 mt-8 md:mt-0 md:ml-8 text-center md:text-left"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h5 className="text-lg text-gray-600">Get Up To 20% Discount</h5>
        <h4 className="text-4xl font-bold text-gray-900 mt-2 font-display">Deals Of This Month</h4>
        <p className="text-gray-600 mt-4 font-sans">
          Our Unisex Fashion Deals of the Month are here to make your style dreams a reality without breaking the bank. Discover a curated collection of exquisite clothing, accessories, and footwear, all handpicked to elevate your wardrobe.
        </p>
        <div className="deals__countdown flex justify-center md:justify-start gap-4 mt-6">
          <div className="deals__countdown__card bg-white border border-gray-200 text-gray-900 p-4 rounded-lg shadow-sm transform transition-transform hover:scale-105 hover:bg-black hover:text-white">
            <h4 className="text-2xl font-bold">{timeLeft.days}</h4>
            <p>Days</p>
          </div>
          <div className="deals__countdown__card bg-white border border-gray-200 text-gray-900 p-4 rounded-lg shadow-sm transform transition-transform hover:scale-105 hover:bg-black hover:text-white">
            <h4 className="text-2xl font-bold">{timeLeft.hours}</h4>
            <p>Hours</p>
          </div>
          <div className="deals__countdown__card bg-white border border-gray-200 text-gray-900 p-4 rounded-lg shadow-sm transform transition-transform hover:scale-105 hover:bg-black hover:text-white">
            <h4 className="text-2xl font-bold">{timeLeft.minutes}</h4>
            <p>Mins</p>
          </div>
          <div className="deals__countdown__card bg-white border border-gray-200 text-gray-900 p-4 rounded-lg shadow-sm transform transition-transform hover:scale-105 hover:bg-black hover:text-white">
            <h4 className="text-2xl font-bold">{timeLeft.seconds}</h4>
            <p>Secs</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default DealsSection;