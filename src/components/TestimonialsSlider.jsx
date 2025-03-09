import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Ajayi Oluwaseun",
    position: "Regular Customer",
    quote: "The delivery speed was impressive! I received my watch within 24 hours of placing the order. The packaging was also very secure.",
    category: "Delivery"
  },
  {
    id: 2,
    name: "Gbenga Adeyemi",
    position: "Loyal Customer",
    quote: "I've been shopping with F.E.B Luxury for over a year now, and their product quality is unmatched. My sunglasses are still in perfect condition.",
    category: "Product Quality"
  },
  {
    id: 3,
    name: "Eniola Babatunde",
    position: "New Customer",
    quote: "The customer service team was extremely helpful when I had questions about sizing. They responded within minutes and guided me through the process.",
    category: "Customer Support"
  },
  {
    id: 4,
    name: "Blessing Okonkwo",
    position: "Repeat Customer",
    quote: "I ordered a belt that arrived with a minor defect, and the team replaced it immediately without any hassle. Their customer service is top-notch!",
    category: "Customer Support"
  },
  {
    id: 5,
    name: "Vivian Nnamdi",
    position: "Satisfied Customer",
    quote: "The quality of the accessories I purchased exceeded my expectations. The attention to detail and craftsmanship is evident in every piece.",
    category: "Product Quality"
  },
  {
    id: 6,
    name: "Funmilayo Adeleke",
    position: "VIP Customer",
    quote: "Even during the holiday rush, my order was processed and delivered promptly. Their logistics team deserves praise for their efficiency.",
    category: "Delivery"
  }
];

const TestimonialsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);
  
  // Auto-advance testimonials every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);
  
  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // Swipe threshold of 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left
        nextTestimonial();
      } else {
        // Swiped right
        prevTestimonial();
      }
    }
  };
  
  // Animation variants for slide transitions
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };
  
  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-2">What Our Customers Say</h2>
          <p className="text-sm md:text-base text-gray-600">Read testimonials from our satisfied customers</p>
        </div>
        
        <div className="relative max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          <div 
            className="relative min-h-[200px] md:min-h-[220px] overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="p-4 md:p-8"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-1">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {testimonials[currentIndex].category}
                      </span>
                    </div>
                    <blockquote className="italic text-gray-700 mb-3 text-sm md:text-base">
                      "{testimonials[currentIndex].quote}"
                    </blockquote>
                    <h4 className="font-semibold text-base md:text-lg">{testimonials[currentIndex].name}</h4>
                    <p className="text-gray-500 text-xs md:text-sm">{testimonials[currentIndex].position}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevTestimonial} 
            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white shadow-md rounded-full flex items-center justify-center border border-gray-200 hover:bg-primary hover:text-white transition-colors z-10 -ml-2 md:ml-0"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextTestimonial} 
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white shadow-md rounded-full flex items-center justify-center border border-gray-200 hover:bg-primary hover:text-white transition-colors z-10 -mr-2 md:mr-0"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Indicator Dots */}
          <div className="flex justify-center space-x-1.5 mt-4 mb-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
