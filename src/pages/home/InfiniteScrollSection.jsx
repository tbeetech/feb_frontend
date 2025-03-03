import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGem, FaSprayCan, FaTshirt, FaShoppingBag } from 'react-icons/fa';
import { GiNecklace } from 'react-icons/gi';
import image1 from '../../assets/scroll-1.jpg';
// Add two more images in the assets folder:
import image2 from '../../assets/scroll-2.jpg';
import image3 from '../../assets/scroll-3.jpg';

const categories = [
  { icon: FaGem, name: 'Accessories', path: '/category/accessories' },
  { icon: FaSprayCan, name: 'Fragrance', path: '/category/fragrance' },
  { icon: FaTshirt, name: 'Clothes', path: '/category/clothes' },
  { icon: FaShoppingBag, name: 'Bags', path: '/category/bags' },
  { icon: GiNecklace, name: 'Jewelry', path: '/category/jewelry' },
];

const InfiniteScrollSection = () => {
  const [currentImage, setCurrentImage] = React.useState(0);
  const images = [image1]; // Add image2 and image3 to this array

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden -mt-[60px]"> {/* Add negative margin to compensate for navbar height */}
      <div className="h-full w-full relative">
        {images.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentImage === index ? 1 : 0,
              scale: currentImage === index ? 1 : 1.1 
            }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={img} 
              alt={`Slide ${index + 1}`} 
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        ))}
        
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold mb-4 text-white">F.E.B LUXURY</h1>
          <p className="text-xl mb-6 text-white">Boost Your Confidence</p>
          <Link 
            to="/shop" 
            className="btn bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg transition-all"
          >
            Explore Now
          </Link>
        </div>

        {/* Scrolling Category Buttons */}
        <motion.div 
          className="absolute bottom-8 w-full overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="flex gap-4 px-4"
            animate={{ x: [0, -1000] }}
            transition={{
              x: {
                repeat: Infinity,
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {[...categories, ...categories].map((cat, index) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={`${cat.name}-${index}`}
                  to={cat.path}
                  className="flex items-center gap-2 bg-white/90 hover:bg-primary hover:text-white px-4 py-2 rounded-full whitespace-nowrap transition-all transform hover:scale-105"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Icon className="text-xl" />
                  </motion.div>
                  <span className="font-medium">{cat.name}</span>
                </Link>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              currentImage === index ? 'bg-white w-4' : 'bg-white/50'
            }`}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default InfiniteScrollSection;
