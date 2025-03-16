import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { FaQuoteLeft } from 'react-icons/fa';

const TestimonialSlider = ({ testimonials = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  
  // Default testimonials if none provided
  const defaultTestimonials = [
    {
      id: 1,
      name: "Olivia Johnson",
      role: "Fashion Enthusiast",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote: "The quality of the products from FEB Luxury is exceptional. Every piece I've purchased has exceeded my expectations in terms of craftsmanship and attention to detail.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Business Executive",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "I've been a loyal customer for years. Their fragrances are unique and long-lasting, and their customer service is impeccable. Truly a luxury experience from start to finish.",
      rating: 5
    },
    {
      id: 3,
      name: "Sophia Williams",
      role: "Interior Designer",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      quote: "The accessories from FEB Luxury have become statement pieces in my wardrobe. The compliments I receive when wearing their pieces are endless.",
      rating: 4
    }
  ];
  
  const testimonialsToUse = testimonials.length > 0 ? testimonials : defaultTestimonials;
  
  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    fade: true
  };
  
  // Handle slider navigation
  const handlePrev = () => {
    sliderRef.current.slickPrev();
  };
  
  const handleNext = () => {
    sliderRef.current.slickNext();
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
  
  // Render stars for rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-gold' : 'text-gray-300'}`}>★</span>
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-pearl to-cream">
      <div className="container mx-auto px-4">
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 text-gray-900">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Discover why our customers love shopping with us and how our products have enhanced their lives.
          </p>
          <div className="w-24 h-1 bg-gold mx-auto"></div>
        </motion.div>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between z-10 px-4 md:px-0">
            <motion.button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gold hover:text-white transition-colors duration-300 -ml-5"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous testimonial"
            >
              <span className="material-icons">chevron_left</span>
            </motion.button>
            
            <motion.button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gold hover:text-white transition-colors duration-300 -mr-5"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next testimonial"
            >
              <span className="material-icons">chevron_right</span>
            </motion.button>
          </div>
          
          {/* Testimonial Slider */}
          <Slider ref={sliderRef} {...settings}>
            {testimonialsToUse.map((testimonial) => (
              <div key={testimonial.id} className="px-4 py-8">
                <motion.div 
                  className="bg-white rounded-lg shadow-luxury p-8 md:p-10 text-center"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-6 relative"
                    variants={itemVariants}
                  >
                    <div className="absolute inset-0 rounded-full bg-gold/20 transform -rotate-6"></div>
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover rounded-full border-2 border-gold p-1 relative z-10"
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="text-gold mb-4 flex justify-center"
                    variants={itemVariants}
                  >
                    <FaQuoteLeft className="text-3xl opacity-50" />
                  </motion.div>
                  
                  <motion.p 
                    className="text-gray-700 text-lg mb-6 font-serif italic"
                    variants={itemVariants}
                  >
                    "{testimonial.quote}"
                  </motion.p>
                  
                  <motion.div 
                    className="mb-4 flex justify-center"
                    variants={itemVariants}
                  >
                    {renderStars(testimonial.rating)}
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl font-display font-bold text-gray-900"
                    variants={itemVariants}
                  >
                    {testimonial.name}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-500 text-sm"
                    variants={itemVariants}
                  >
                    {testimonial.role}
                  </motion.p>
                </motion.div>
              </div>
            ))}
          </Slider>
          
          {/* Slider Pagination */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonialsToUse.map((_, index) => (
              <button
                key={index}
                onClick={() => sliderRef.current.slickGoTo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-gold w-6' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider; 