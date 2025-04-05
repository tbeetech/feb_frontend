import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaAward, FaShieldAlt, FaHandshake, FaShippingFast, FaHeadset, FaDollarSign } from 'react-icons/fa';

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
                className="bg-gradient-to-r from-gray-100 to-white py-16 mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4">
                        About F.E.B Luxury
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Elevating your style with authentic luxury fashion and fragrances since 2015
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
                            Our expertise in both contemporary and traditional luxury fashion allows us to offer a unique selection that caters to diverse tastes and preferences. What began as a small boutique has now grown into a premier destination for luxury shopping.
                        </p>
                        <p className="text-gray-600">
                            With direct relationships with designers and brands across Europe and America, we're able to source exclusive pieces that can't be found elsewhere. Our commitment to excellence has made us a trusted name in the luxury fashion industry.
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        {...fadeIn}
                        className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl"
                    >
                        <img 
                            src="https://i.pinimg.com/474x/36/11/fa/3611fafdeb4fdcd0a130c185ebb77dd0.jpg" 
                            alt="Luxury Fashion Collection"
                            className="object-cover w-full h-full"
                        />
                    </motion.div>
                </div>

                {/* Our Values Section */}
                <motion.div 
                    {...fadeIn}
                    className="mb-16"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
                            Our Values
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            At F.E.B Luxury, our business is built on core values that guide every decision we make and every interaction we have with our clients.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <FaAward className="text-gold text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Authenticity</h3>
                            <p className="text-gray-600 text-center">
                                We guarantee the authenticity of every item we sell. Our reputation is built on trust and integrity.
                            </p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <FaShieldAlt className="text-gold text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Quality</h3>
                            <p className="text-gray-600 text-center">
                                We never compromise on quality. Each piece is carefully inspected to ensure it meets our exacting standards.
                            </p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <FaHandshake className="text-gold text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Customer Focus</h3>
                            <p className="text-gray-600 text-center">
                                Our clients are at the heart of everything we do. We strive to exceed expectations in every interaction.
                            </p>
                        </div>
                    </div>
                </motion.div>

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

                {/* Why Choose Us Section */}
                <motion.div 
                    {...fadeIn}
                    className="mb-16"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
                            Why Choose F.E.B Luxury
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            What sets us apart in the world of luxury fashion retail
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center p-6">
                            <FaShippingFast className="text-4xl text-primary mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Global Shipping</h3>
                            <p className="text-gray-600 text-center">
                                We offer worldwide shipping with specialized packaging to ensure your luxury items arrive in perfect condition.
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center p-6">
                            <FaHeadset className="text-4xl text-primary mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">VIP Support</h3>
                            <p className="text-gray-600 text-center">
                                Our dedicated customer support team is available to assist with any questions or concerns about your purchase.
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center p-6">
                            <FaDollarSign className="text-4xl text-primary mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Value Retention</h3>
                            <p className="text-gray-600 text-center">
                                Many luxury items appreciate in value over time. We help you invest in pieces that maintain their worth.
                            </p>
                        </div>
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
