import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="pt-24 pb-16">
            {/* Header Section */}
            <motion.div 
                className="bg-gradient-to-r from-primary-light to-white py-16 mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4">
                        About F.E.B Luxury
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Elevating your style with authentic luxury fashion and fragrances
                    </p>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                    <motion.div 
                        {...fadeIn}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-playfair font-bold text-gray-900">
                            Our Story
                        </h2>
                        <p className="text-gray-600">
                            F.E.B Luxury was founded with a passion for bringing authentic luxury fashion and fragrances to discerning clients. We curate collections of the finest designer pieces, ensuring each item meets our strict standards for quality and authenticity.
                        </p>
                        <p className="text-gray-600">
                            Our expertise in both contemporary and traditional luxury fashion allows us to offer a unique selection that caters to diverse tastes and preferences.
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        {...fadeIn}
                        className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl"
                    >
                        <img 
                            src="/about-image.jpg" 
                            alt="Luxury Fashion Collection"
                            className="object-cover w-full h-full"
                        />
                    </motion.div>
                </div>

                <motion.div 
                    {...fadeIn}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                >
                    <div className="text-center p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Assurance</h3>
                        <p className="text-gray-600">
                            Every item in our collection undergoes rigorous authentication and quality checks to ensure you receive only the finest genuine products.
                        </p>
                    </div>
                    <div className="text-center p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Curation</h3>
                        <p className="text-gray-600">
                            Our team of fashion experts carefully selects each piece to create a collection that combines timeless elegance with contemporary trends.
                        </p>
                    </div>
                    <div className="text-center p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Service</h3>
                        <p className="text-gray-600">
                            We provide personalized styling advice and assistance to help you find the perfect pieces that match your style and preferences.
                        </p>
                    </div>
                </motion.div>

                <motion.div 
                    {...fadeIn}
                    className="text-center max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-6">
                        Experience Luxury Shopping
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Discover our carefully curated collection of designer fashion, accessories, and fragrances. Each piece is selected to help you express your unique style with confidence.
                    </p>
                    <Link 
                        to="/shop"
                        className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dark transition-colors"
                    >
                        Explore Our Collection
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
