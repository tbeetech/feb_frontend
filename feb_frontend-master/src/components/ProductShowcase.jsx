import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import ProductCard from './ProductCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductShowcase = ({ title, subtitle, products, viewAllLink, category }) => {
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef(null);
  
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false, // Disable autoplay to let users control sliding
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          dots: false,
        }
      }
    ]
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };
  
  // Handle slider navigation
  const handlePrev = () => {
    sliderRef.current.slickPrev();
  };
  
  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  return (
    <section className="py-16 bg-pearl">
      <div className="container mx-auto px-4">
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 text-gray-900">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              {subtitle}
            </p>
          )}
          
          <div className="w-24 h-1 bg-gold mx-auto"></div>
        </motion.div>
        
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Arrows - Always visible on mobile, shown on hover on desktop */}
          <motion.button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gold hover:text-white transition-colors duration-300 -ml-5 lg:-ml-6 md:opacity-70 md:hover:opacity-100"
            initial={{ opacity: 0, x: 10 }}
            animate={{ 
              opacity: isHovered ? 1 : (window.innerWidth < 768 ? 0.7 : 0), 
              x: isHovered ? 0 : (window.innerWidth < 768 ? 0 : 10)  
            }}
            transition={{ duration: 0.3 }}
            aria-label="Previous slide"
          >
            <FaChevronLeft className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gold hover:text-white transition-colors duration-300 -mr-5 lg:-mr-6 md:opacity-70 md:hover:opacity-100"
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: isHovered ? 1 : (window.innerWidth < 768 ? 0.7 : 0), 
              x: isHovered ? 0 : (window.innerWidth < 768 ? 0 : -10)
            }}
            transition={{ duration: 0.3 }}
            aria-label="Next slide"
          >
            <FaChevronRight className="w-4 h-4" />
          </motion.button>
          
          {/* Product Slider */}
          <Slider ref={sliderRef} {...settings} className="trending-slider">
            {products.map((product) => (
              <div key={product._id} className="px-3 py-4">
                <ProductCard product={product} />
              </div>
            ))}
          </Slider>
        </div>
        
        {/* View All Link */}
        {viewAllLink && (
          <div className="text-center mt-10">
            <Link 
              to={viewAllLink}
              className="inline-flex items-center px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-white transition-colors duration-300 rounded-md font-medium"
            >
              View All {category || 'Products'}
              <span className="ml-2">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShowcase; 