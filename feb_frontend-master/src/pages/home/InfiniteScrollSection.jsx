import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLongArrowAltRight } from 'react-icons/fa';

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 1.0, 
      ease: "easeOut"
    } 
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.05,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  tap: { scale: 0.98 }
};

const InfiniteScrollSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[580px] md:min-h-[640px] max-h-[850px] overflow-hidden flex items-center justify-center">
      {/* Background image with gentle overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1920&q=80')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F223D]/90 via-[#0F223D]/75 to-[#0F223D]/60 backdrop-blur-[1px]"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center flex flex-col justify-center items-center">
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <div className="inline-flex items-center space-x-2 bg-[#E8C5A5]/20 border border-[#E8C5A5]/40 text-[#E8C5A5] px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-semibold mb-6">
            <span>🧶 Oriental Zen Craft</span>
            <span>•</span>
            <span>100% Handmade in Nigeria</span>
          </div>

          <motion.h1 
            variants={textVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 text-white font-serif tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            KNITBI<span className="text-[#E8C5A5] font-light">-C</span>
          </motion.h1>
          
          <motion.p 
            variants={textVariants}
            className="text-lg sm:text-xl md:text-2xl mb-8 text-[#FAF8F5]/90 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Slow fashion, wearable crochet art, and beginner-friendly classes. Hand-stitched with love and patient intention.
          </motion.p>
          
          <motion.div variants={textVariants} className="flex flex-wrap gap-4 justify-center items-center">
            <motion.button
              onClick={() => navigate('/shop')}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-[#E8C5A5] text-[#0F223D] font-semibold px-8 py-3.5 rounded-full shadow-lg transition-all group flex items-center gap-2 hover:bg-white text-sm uppercase tracking-wider"
            >
              Explore Collection
              <FaLongArrowAltRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              onClick={() => navigate('/categories/classes')}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-transparent border-2 border-[#E8C5A5] text-[#E8C5A5] font-semibold px-8 py-3.5 rounded-full shadow-lg transition-all group flex items-center gap-2 hover:bg-[#E8C5A5] hover:text-[#0F223D] text-sm uppercase tracking-wider"
            >
              Join Crochet Class
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default InfiniteScrollSection;
