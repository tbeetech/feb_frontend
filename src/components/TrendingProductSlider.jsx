import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFetchAllProductsQuery } from '../redux/features/products/productsApi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TrendingProductSlider = () => {
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    
    const { data, isLoading } = useFetchAllProductsQuery({
        limit: 10,
        sort: '-rating'
    });

    const products = data?.products || [];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
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

    const handlePrev = () => {
        sliderRef.current?.slickPrev();
    };

    const handleNext = () => {
        sliderRef.current?.slickNext();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="relative py-8"
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}>
            {/* Navigation Arrows */}
            <motion.button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition-all duration-300 -ml-5 lg:-ml-6"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
                transition={{ duration: 0.3 }}
                aria-label="Previous slide"
            >
                <FaChevronLeft className="w-4 h-4" />
            </motion.button>

            <motion.button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition-all duration-300 -mr-5 lg:-mr-6"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                transition={{ duration: 0.3 }}
                aria-label="Next slide"
            >
                <FaChevronRight className="w-4 h-4" />
            </motion.button>

            {/* Product Slider */}
            <Slider ref={sliderRef} {...settings} className="trending-slider -mx-2">
                {products.map((product) => (
                    <div key={product._id} className="px-2">
                        <motion.div
                            whileHover={{ y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="group relative bg-white rounded-lg overflow-hidden shadow-lg"
                        >
                            <div className="relative aspect-square overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <button
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        className="bg-white text-black px-6 py-2 rounded-full transform -translate-y-10 group-hover:translate-y-0 transition-transform duration-300"
                                    >
                                        View Product
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2 truncate">{product.name}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-primary font-bold">₦{product.price.toLocaleString()}</span>
                                    {product.oldPrice > 0 && (
                                        <span className="text-gray-500 line-through text-sm">
                                            ₦{product.oldPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </Slider>
            
            <style>{`
                .trending-slider .slick-track {
                    display: flex !important;
                    gap: 1rem;
                }
                .trending-slider .slick-slide {
                    height: inherit !important;
                }
                .trending-slider .slick-slide > div {
                    height: 100%;
                }
                .trending-slider .slick-dots {
                    bottom: -2.5rem;
                }
                .trending-slider .slick-dots li button:before {
                    font-size: 8px;
                }
            `}</style>
        </div>
    );
};

export default TrendingProductSlider;
