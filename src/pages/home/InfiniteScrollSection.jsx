import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const images = [image1, image2, image3]; // Using all three images
  const scrollContainerRef = useRef(null);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };
  
  // Backdrop variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 1.5 }
    }
  };

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };
  
  // Button animation variants
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        delay: 0.6
      }
    },
    hover: {
      scale: 1.05,
      backgroundColor: "var(--gold)",
      transition: { duration: 0.3 }
    },
    tap: {
      scale: 0.95
    }
  };

  // Handle manual navigation for the image slider
  const goToNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };
  
  const goToPrev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentImage(index);
  };

  return (
    <section className="relative h-screen overflow-hidden -mt-[60px]">
      {/* Main Background Images */}
      <div className="h-full w-full relative">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={images[currentImage]} 
              alt={`Luxury Collection ${currentImage + 1}`} 
              className="w-full h-full object-cover object-center"
            />
            
            {/* Gradient Overlay for better text readability */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
          <motion.button
            onClick={goToPrev}
            className="bg-white/30 hover:bg-white/60 text-white rounded-full p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.7, x: 0 }}
          >
            <FaChevronLeft className="text-2xl" />
          </motion.button>
          
          <motion.button
            onClick={goToNext}
            className="bg-white/30 hover:bg-white/60 text-white rounded-full p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.7, x: 0 }}
          >
            <FaChevronRight className="text-2xl" />
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
              <Link to="/shop">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="bg-white/90 text-primary px-8 py-3 rounded-lg shadow-lg transition-all group flex items-center gap-2 mx-auto"
                >
                  {carouselContent[currentImage].cta}
                  <FaLongArrowAltRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Category Buttons with Navigation */}
        <div className="absolute bottom-12 w-full z-20">
          <div className="relative max-w-5xl mx-auto">
            {/* Scrollable Container */}
            <motion.div 
              ref={scrollContainerRef}
              className="flex gap-4 px-10 overflow-x-auto scroll-smooth py-4 no-scrollbar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {icons.map((cat, index) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={`${cat.name}-${index}`}
                    to={cat.path}
                    className="flex items-center gap-2 bg-white/90 hover:bg-gold hover:text-white px-4 py-2 rounded-full whitespace-nowrap transition-all transform hover:scale-105 flex-shrink-0 shadow-md"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: index * 0.2, // Staggered animation
                      }}
                    >
                      <Icon className="text-xl" />
                    </motion.div>
                    <span className="font-medium">{cat.name}</span>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {images.map((_, index) => (
          <motion.button
            key={index}
            className={`h-2 rounded-full transition-all ${
              currentImage === index 
                ? 'bg-gold w-8' 
                : 'bg-white/70 w-2 hover:bg-white'
            }`}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          />
        ))}
      </div>
    </section>
  );
};

export default InfiniteScrollSection;
