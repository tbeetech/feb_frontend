import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import { FaChevronLeft, FaChevronRight, FaShoppingBag, FaClock, FaGift } from 'react-icons/fa';
import { useCurrency } from '../../components/CurrencySwitcher';

const DealsSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const { formatPrice, currencySymbol } = useCurrency();
  const featuredProductsRef = useRef(null);
  
  // Fetch some random products to display as deals
  const { data } = useFetchAllProductsQuery({ 
    limit: 6,
    sort: '-rating'
  });
  
  const discountedProducts = data?.products?.filter(product => product.oldPrice > 0) || [];
  
  const scrollLeft = () => {
    if (featuredProductsRef.current) {
      featuredProductsRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (featuredProductsRef.current) {
      featuredProductsRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

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

  // Create classic countdown display for countdown
  const CountdownUnit = ({ value, label }) => (
    <div className="countdown-unit relative">
      <div className="bg-black border border-gray-800 p-4 rounded-sm shadow-md transition-all duration-500">
        <div className="text-2xl md:text-3xl font-bold text-white mb-1">{value < 10 ? `0${value}` : value}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background with gradient and subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0">
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.15"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '60px 60px'
        }}/>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block bg-white text-black px-4 py-1 rounded-none border border-gray-200 text-sm font-medium mb-4"
          >
            <span className="flex items-center gap-2">
              <FaGift className="text-black" />
              Limited Time Offer
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Deals of the Month
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-300 max-w-2xl mx-auto mb-8"
          >
            Discover our exclusive selection of luxury items at unbeatable prices.
            Up to 20% off on selected premium products for a limited time only.
          </motion.p>
          
          {/* Countdown Timer */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h3 className="text-white text-xl mb-4 font-serif tracking-wider">COUNTDOWN TILL PROMO</h3>
            
            <div className="flex justify-center gap-4 md:gap-6">
              <CountdownUnit value={timeLeft.days} label="days" />
              <CountdownUnit value={timeLeft.hours} label="hours" />
              <CountdownUnit value={timeLeft.minutes} label="minutes" />
              <CountdownUnit value={timeLeft.seconds} label="seconds" />
            </div>
          </motion.div>
        </div>
        
        {/* Featured Products */}
        {discountedProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-white">Featured Deals</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={scrollLeft}
                  className="p-2 rounded-full border border-gray-700 text-gray-300 hover:bg-white hover:text-black hover:border-white transition-colors"
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={scrollRight}
                  className="p-2 rounded-full border border-gray-700 text-gray-300 hover:bg-white hover:text-black hover:border-white transition-colors"
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div 
              ref={featuredProductsRef}
              className="flex gap-5 overflow-x-auto pb-6 hide-scrollbar"
            >
              {discountedProducts.map((product) => {
                const discountPercentage = Math.round((product.oldPrice - product.price) / product.oldPrice * 100);
                
                return (
                  <motion.div
                    key={product._id}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    className="min-w-[250px] max-w-[250px] bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 shadow-lg"
                  >
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover" 
                      />
                      <div className="absolute top-2 right-2 bg-white text-black text-xs font-bold px-2 py-1 rounded-md">
                        {discountPercentage}% OFF
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-white font-medium truncate">{product.name}</h3>
                      <div className="flex justify-between items-center mt-2 mb-3">
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{currencySymbol}{formatPrice(product.price)}</span>
                          <span className="text-gray-400 text-sm line-through">{currencySymbol}{formatPrice(product.oldPrice)}</span>
                        </div>
                      </div>
                      
                      <Link 
                        to={`/product/${product._id}`}
                        className="block w-full bg-white hover:bg-gray-200 text-black text-center py-2 rounded-md transition-colors duration-300 text-sm flex items-center justify-center"
                      >
                        <FaShoppingBag className="mr-2" /> View Deal
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link 
            to="/shop" 
            className="inline-block bg-white hover:bg-gray-200 text-black px-8 py-3 rounded-lg font-medium transition-colors duration-300 shadow-lg"
          >
            Explore All Deals
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default DealsSection;