import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroParallax = ({ 
  title = "Luxury Redefined", 
  subtitle = "Discover our exclusive collection of premium products crafted for the discerning individual.",
  ctaText = "Shop Now",
  ctaLink = "/shop",
  backgroundImage = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070",
  overlayProducts = []
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Parallax effect values
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Handle mouse movement for parallax effect
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Calculate mouse position as percentage of screen
    const x = (clientX / innerWidth - 0.5) * 2; // -1 to 1
    const y = (clientY / innerHeight - 0.5) * 2; // -1 to 1
    
    setMousePosition({ x, y });
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };
  
  const productVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };
  
  // Calculate transform values for floating products
  const getProductTransform = (index) => {
    const baseDelay = 0.5 + (index * 0.2);
    const xOffset = mousePosition.x * (10 + (index * 5));
    const yOffset = mousePosition.y * (10 + (index * 5));
    
    return {
      x: xOffset,
      y: yOffset,
      transition: { type: 'spring', stiffness: 50, damping: 30, delay: baseDelay }
    };
  };

  return (
    <motion.section 
      className="relative overflow-hidden bg-black text-white min-h-[80vh] flex items-center"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: y1, opacity }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            filter: 'brightness(0.6)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
      </motion.div>
      
      {/* Floating Product Images */}
      {overlayProducts.map((product, index) => (
        <motion.div
          key={index}
          className="absolute z-10 hidden md:block"
          style={{
            top: `${20 + (index * 15)}%`,
            [index % 2 === 0 ? 'right' : 'left']: `${10 + (index * 5)}%`,
            width: '180px',
            height: '180px'
          }}
          initial="hidden"
          animate="visible"
          variants={productVariants}
          custom={index}
          whileInView={getProductTransform(index)}
          viewport={{ once: false }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg transform rotate-12" />
            <img 
              src={product.image} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-contain p-4 transform -rotate-12"
            />
          </div>
        </motion.div>
      ))}
      
      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-20">
        <motion.div 
          className="max-w-2xl mx-auto md:mx-0 text-center md:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
            variants={itemVariants}
          >
            {title}
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl"
            variants={itemVariants}
          >
            {subtitle}
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Link 
              to={ctaLink}
              className="inline-flex items-center px-8 py-4 bg-gold text-white rounded-md hover:bg-gold-dark transition-colors duration-300 text-lg font-medium"
            >
              {ctaText}
              <span className="material-icons ml-2">arrow_forward</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative Elements */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-10"
        style={{ y: y2 }}
      />
      
      <div className="absolute bottom-10 right-10 z-20 hidden lg:block">
        <motion.div 
          className="w-32 h-32 border border-gold/30 rounded-full"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.section>
  );
};

export default HeroParallax; 