import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaTelegram, FaInstagram } from 'react-icons/fa';

const Contact = () => {
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
                        Contact Us
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We're here to help you find the perfect luxury items. Get in touch with us for any inquiries or assistance.
                    </p>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <motion.div 
                        {...fadeIn}
                        className="space-y-8"
                    >
                        <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6">
                            Get in Touch
                        </h2>
                        
                        <div className="flex items-start space-x-4">
                            <FaMapMarkerAlt className="text-primary text-xl mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900">Visit Us</h3>
                                <p className="text-gray-600">Lagos, Nigeria</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <FaPhone className="text-primary text-xl mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900">Call Us</h3>
                                <p className="text-gray-600">+234 803 382 5144</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <FaEnvelope className="text-primary text-xl mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900">Email Us</h3>
                                <p className="text-gray-600">febluxurycloset@gmail.com</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Follow Us</h3>
                            <div className="flex space-x-4">
                                <a href="https://wa.me/message/NP6XO5SXNXG5G1" 
                                   className="text-gray-600 hover:text-green-500 transition-colors">
                                    <FaWhatsapp className="text-2xl" />
                                </a>
                                <a href="https://wa.me/2348088690856" 
                                   className="text-gray-600 hover:text-green-500 transition-colors">
                                    <FaWhatsapp className="text-2xl" />
                                </a>
                                <a href="https://t.me/febluxury" 
                                   className="text-gray-600 hover:text-blue-500 transition-colors">
                                    <FaTelegram className="text-2xl" />
                                </a>
                                <a href="https://www.instagram.com/f.e.b_luxuryclosetbackup1" 
                                   className="text-gray-600 hover:text-pink-500 transition-colors">
                                    <FaInstagram className="text-2xl" />
                                </a>
                                <a href="https://www.instagram.com/jumiescent_backup" 
                                   className="text-gray-600 hover:text-pink-500 transition-colors">
                                    <FaInstagram className="text-2xl" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div 
                        {...fadeIn}
                        className="bg-white p-8 rounded-lg shadow-lg"
                    >
                        <form className="space-y-6">
                            <div>
                                <label className="block text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="Your email"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Message</label>
                                <textarea
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="Your message"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors"
                            >
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
