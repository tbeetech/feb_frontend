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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
                    <motion.div 
                        className="order-2 lg:order-1"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-6">
                            A Journey of Luxury and Excellence
                        </h2>
                        <div className="space-y-4 text-gray-600">
                            <p>
                                Founded in 2015, F.E.B Luxury was born from a passion for authentic luxury goods and a vision to make them accessible to discerning customers worldwide.
                            </p>
                            <p>
                                Our journey began as a small boutique offering a curated selection of luxury fragrances. Today, we've expanded to include high-end fashion pieces, accessories, and lifestyle products from the world's most prestigious brands.
                            </p>
                            <p>
                                We take pride in our commitment to authenticity. Every item in our collection is carefully sourced and verified to ensure you receive only genuine luxury products.
                            </p>
                        </div>
                        <Link 
                            to="/contact" 
                            className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </motion.div>
                    <motion.div 
                        className="order-1 lg:order-2"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <img 
                            src="/images/about-image.jpg" 
                            alt="About F.E.B Luxury" 
                            className="rounded-lg shadow-xl w-full h-auto"
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/600x400?text=About+Us";
                            }}
                        />
                    </motion.div>
                </div>

                {/* Mission and Values */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
                            Our Mission and Values
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Guided by principles of authenticity, excellence, and customer satisfaction
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div 
                            className="bg-white p-6 rounded-lg shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <FaAward className="text-4xl text-black mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Authenticity</h3>
                            <p className="text-gray-600">
                                We guarantee the authenticity of every product we sell, sourcing directly from brands or authorized distributors.
                            </p>
                        </motion.div>
                        
                        <motion.div 
                            className="bg-white p-6 rounded-lg shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <FaShieldAlt className="text-4xl text-black mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality</h3>
                            <p className="text-gray-600">
                                We meticulously inspect each item to ensure it meets the highest standards of craftsmanship and quality.
                            </p>
                        </motion.div>
                        
                        <motion.div 
                            className="bg-white p-6 rounded-lg shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <FaHandshake className="text-4xl text-black mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Trust</h3>
                        <p className="text-gray-600">
                                We build lasting relationships with our customers based on transparency, integrity, and exceptional service.
                        </p>
                        </motion.div>
                    </div>
                </div>
                
                {/* Why Choose Us */}
                <div className="py-12 bg-gray-50 rounded-lg">
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
                            <FaShippingFast className="text-4xl text-black mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Global Shipping</h3>
                            <p className="text-gray-600 text-center">
                                We offer worldwide shipping with specialized packaging to ensure your luxury items arrive in perfect condition.
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center p-6">
                            <FaHeadset className="text-4xl text-black mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">VIP Support</h3>
                            <p className="text-gray-600 text-center">
                                Our dedicated customer support team is available to assist with any questions or concerns about your purchase.
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center p-6">
                            <FaDollarSign className="text-4xl text-black mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Competitive Pricing</h3>
                            <p className="text-gray-600 text-center">
                                We offer luxury products at fair prices, with special promotions and loyalty rewards for our valued customers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
