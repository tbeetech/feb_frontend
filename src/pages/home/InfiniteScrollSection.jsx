import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLongArrowAltRight } from 'react-icons/fa';
import image1 from '../../assets/scroll-1.jpg';

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 1.2, 
      ease: "easeOut"
    } 
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.05,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  tap: { scale: 0.98 }
};

const InfiniteScrollSection = () => {
  const navigate = useNavigate();

  const handleShopNavigation = () => {
    navigate('/shop');
  };

  return (
    <div className="relative h-screen max-h-[1000px] overflow-hidden">
      {/* Static background image */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${image1})` 
          }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      </div>
      
      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-4">
        <motion.div
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
            F.E.B LUXURY
          </motion.h1>
          
          <motion.p 
            variants={textVariants}
            className="text-xl md:text-2xl mb-8 text-white font-serif"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
          >
            Boost Your Confidence
          </motion.p>
          
          <motion.div variants={textVariants}>
            <motion.button
              onClick={handleShopNavigation}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-white/90 text-black font-semibold px-8 py-3 rounded-lg shadow-lg transition-all group flex items-center gap-2 mx-auto"
            >
              Explore Shop
              <FaLongArrowAltRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default InfiniteScrollSection;
