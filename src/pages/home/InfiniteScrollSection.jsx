import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGem, FaSprayCan, FaTshirt, FaShoppingBag, FaChevronLeft, FaChevronRight, FaStar, FaShoePrints, FaBriefcase, FaLongArrowAltRight } from 'react-icons/fa';
import { GiNecklace, GiDress } from 'react-icons/gi';
import image1 from '../../assets/scroll-1.jpg';
// Add two more images in the assets folder:
import image2 from '../../assets/scroll-2.jpg';
import image3 from '../../assets/scroll-3.jpg';

const icons = [
  { icon: FaGem, name: 'Accessories', path: '/categories/accessories' },
  { icon: FaSprayCan, name: 'Fragrance', path: '/categories/fragrance' },
  { icon: FaTshirt, name: 'Clothes', path: '/categories/clothes' },
  { icon: FaShoppingBag, name: 'Bags', path: '/categories/bags' },
  { icon: GiNecklace, name: 'Jewelry', path: '/categories/jewelry' },
  { icon: GiDress, name: 'Dresses', path: '/categories/dress' },
  { icon: FaBriefcase, name: 'Corporate Wears', path: '/categories/corporate' },
  { icon: FaShoePrints, name: 'Shoes', path: '/categories/shoes' },
  { icon: FaStar, name: 'New Arrivals', path: '/categories/new' },
];

// Carousel text content for each slide
const carouselContent = [
  {
    heading: "F.E.B LUXURY",
    subheading: "Boost Your Confidence",
    cta: "Explore Collection"
  },
  {
    heading: "Exquisite Style",
    subheading: "Curated for Elegance",
    cta: "Discover More"
  },
  {
    heading: "Premium Quality",
    subheading: "Crafted with Excellence",
    cta: "Shop Now"
  }
];

const InfiniteScrollSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [image1, image2, image3];
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  
  // Scroll through images every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [images.length]);
  
  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut"
      } 
    }
  };
  
  // Button animation variants
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // Handlers for manual navigation
  const goToPrev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handleShopNavigation = () => {
    navigate('/shop');
  };

  return (
    <div className="home-hero relative h-screen max-h-[1000px] overflow-hidden">
      {/* Background images with fade transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`img-${currentImage}`}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-10000 transform scale-110 animate-slow-zoom"
            style={{ 
              backgroundImage: `url(${images[currentImage]})` 
            }}
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
        <motion.button
          onClick={goToPrev}
          className="bg-white/30 hover:bg-white/60 text-white rounded-full p-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.7, x: 0 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        
        <motion.button
          onClick={goToNext}
          className="bg-white/30 hover:bg-white/60 text-white rounded-full p-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.7, x: 0 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
      
      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-4">
        <motion.div
          key={`content-${currentImage}`}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.h1 
            variants={textVariants}
            className="text-5xl md:text-7xl font-bold mb-4 text-white font-display tracking-wider"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
          >
            {carouselContent[currentImage].heading}
          </motion.h1>
          
          <motion.p 
            variants={textVariants}
            className="text-xl md:text-2xl mb-8 text-white font-serif"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
          >
            {carouselContent[currentImage].subheading}
          </motion.p>
          
          <motion.div variants={textVariants}>
            <motion.button
              onClick={handleShopNavigation}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-white/90 text-primary px-8 py-3 rounded-lg shadow-lg transition-all group flex items-center gap-2 mx-auto"
            >
              {carouselContent[currentImage].cta}
              <FaLongArrowAltRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentImage === index 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default InfiniteScrollSection;
