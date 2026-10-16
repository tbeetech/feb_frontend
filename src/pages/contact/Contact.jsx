import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Contact = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="pt-24 pb-16 bg-[#FAF8F5]">
            {/* Header Section */}
            <motion.div 
                className="bg-gradient-to-r from-[#FAF8F5] via-[#F4EFEA] to-[#EAE0D5] py-16 mb-12 border-b border-[#E5DACD]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="container mx-auto px-4 text-center">
                    <span className="text-xs uppercase tracking-widest text-[#C49B76] font-semibold">We'd Love To Hear From You</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0F223D] mt-2 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Contact Knitbi
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                        Inquire about custom bespoke crochet pieces, bridal commissions, sizing questions, or upcoming crochet masterclasses.
                    </p>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Contact Information */}
                    <motion.div 
                        {...fadeIn}
                        className="space-y-8 bg-white p-8 rounded-2xl border border-stone-200 shadow-sm"
                    >
                        <div>
                            <span className="text-xs uppercase tracking-widest text-[#C49B76] font-semibold">Artisan Atelier</span>
                            <h2 className="text-2xl font-serif font-bold text-[#0F223D] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Get In Touch
                            </h2>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#0F223D] border border-[#E8C5A5] flex-shrink-0">
                                <FaMapMarkerAlt className="text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-stone-900">Studio Location</h3>
                                <p className="text-stone-600 text-sm">Lagos, Nigeria (Worldwide Courier Available)</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#0F223D] border border-[#E8C5A5] flex-shrink-0">
                                <FaPhone className="text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-stone-900">Phone & Concierge</h3>
                                <p className="text-stone-600 text-sm">+234 803 382 5144</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#0F223D] border border-[#E8C5A5] flex-shrink-0">
                                <FaEnvelope className="text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-stone-900">Email Inquiries</h3>
                                <p className="text-stone-600 text-sm">
                                    <a href="mailto:knitbicloset@gmail.com" className="hover:text-[#0F223D] underline">
                                        knitbicloset@gmail.com
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-stone-200">
                            <h3 className="font-semibold text-stone-900 mb-3">Instant Messaging & Social</h3>
                            <div className="flex space-x-4">
                                <a 
                                    href="https://wa.me/2348033825144" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-[#0F223D] text-[#E8C5A5] flex items-center justify-center hover:bg-[#1A365D] transition-colors"
                                    title="Chat on WhatsApp"
                                >
                                    <FaWhatsapp className="text-2xl" />
                                </a>
                                <a 
                                    href="https://www.instagram.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-stone-100 text-[#0F223D] flex items-center justify-center hover:bg-stone-200 transition-colors"
                                    title="Instagram"
                                >
                                    <FaInstagram className="text-2xl" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div 
                        {...fadeIn}
                        className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm"
                    >
                        <h2 className="text-2xl font-serif font-bold text-[#0F223D] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Send A Message
                        </h2>
                        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message has been received. Jumoke will respond via WhatsApp or email shortly."); }}>
                            <div>
                                <label className="block text-stone-700 text-sm font-medium mb-1">Your Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:border-[#0F223D] focus:ring-1 focus:ring-[#0F223D] text-sm"
                                    placeholder="e.g. Chinelo Adebayo"
                                />
                            </div>
                            <div>
                                <label className="block text-stone-700 text-sm font-medium mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:border-[#0F223D] focus:ring-1 focus:ring-[#0F223D] text-sm"
                                    placeholder="e.g. name@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-stone-700 text-sm font-medium mb-1">Topic / Inquiry Type</label>
                                <select className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:border-[#0F223D] focus:ring-1 focus:ring-[#0F223D] text-sm">
                                    <option>Custom Commission / Bespoke Sizing</option>
                                    <option>Crochet Class Registration</option>
                                    <option>Order & Shipping Status</option>
                                    <option>Bridal / Bulk Inquiry</option>
                                    <option>General Question</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-stone-700 text-sm font-medium mb-1">Your Message or Custom Request</label>
                                <textarea
                                    rows="4"
                                    required
                                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:border-[#0F223D] focus:ring-1 focus:ring-[#0F223D] text-sm"
                                    placeholder="Tell us about the colors, measurements, or workshop dates you are interested in..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#0F223D] text-[#E8C5A5] py-3 rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#1A365D] transition-colors shadow-sm"
                            >
                                Send Inquiry
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
