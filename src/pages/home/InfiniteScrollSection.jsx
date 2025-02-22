import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import image1 from '../../assets/scroll-1.jpg';
import image2 from '../../assets/scroll-2.jpg';
import image3 from '../../assets/scroll-3.jpg';

const images = [image1, image2, image3];

const InfiniteScrollSection = () => {
  return (
    <section className="relative overflow-hidden h-[90vh] mb-0">
      <div className="absolute top-0 left-0 w-full h-full flex animate-[scroll_20s_linear_infinite]">
        {images.concat(images).map((image, index) => (
          <motion.div
            key={index}
            className="w-full h-full flex-shrink-0 border-2 border-yellow-400"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <img src={image} alt={`scroll-${index}`} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 flex flex-col justify-center items-center ${index === 0 ? '' : 'bg-black bg-opacity-30'}`}>
              <h1 className="text-5xl font-bold mb-4 text-white">Discover Your Style</h1>
              <p className="text-xl mb-6 text-white">Unisex fashion for every occasion</p>
              <Link to="/shop" className="btn bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg transition-all">
                Explore Now
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default InfiniteScrollSection;
