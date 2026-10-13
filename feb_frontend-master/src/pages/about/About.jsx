import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaAward, FaShieldAlt, FaHandshake, FaShippingFast, FaHeadset, FaHeart } from 'react-icons/fa';

const About = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="pt-24 pb-16 bg-[#FAF8F5]">
            {/* Header Section */}
            <motion.div 
                className="bg-gradient-to-r from-[#FAF8F5] via-[#F4EFEA] to-[#EAE0D5] py-20 mb-12 border-b border-[#E5DACD]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="container mx-auto px-4 text-center">
                    <span className="text-xs uppercase tracking-widest text-[#C49B76] font-semibold">The Story of Slow Fashion</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0F223D] mt-2 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                        About Knitbi
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                        100% Handmade Crochet Wears, Bespoke Couture & Beginner-Friendly Classes woven with patient intention in Lagos, Nigeria.
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
                        <span className="text-xs uppercase tracking-widest text-[#C49B76] font-semibold">Our Philosophy</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F223D] mt-1 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Wearable Art, Patiently Stitched
                        </h2>
                        <div className="space-y-4 text-stone-600 leading-relaxed">
                            <p>
                                At <strong className="text-[#0F223D]">Knitbi</strong>, we believe true luxury cannot be mass-produced on an industrial assembly line. True luxury is born from human hands, thoughtful time, and pure dedication to the craft.
                            </p>
                            <p>
                                Founded in Lagos by designer and artisan Jumoke Obembe, Knitbi began as an ode to timeless textile techniques and mindful living. Each garment, handbag, and accessory is meticulously hand-stitched using premium Egyptian cotton, natural raffia, and organic yarns that breathe effortlessly against the skin.
                            </p>
                            <p>
                                Beyond our ready-to-wear collections and bespoke commissions, Knitbi is dedicated to fostering community through our <em>Beginner-Friendly Crochet Masterclasses</em>. We empower women and aspiring makers to discover the therapeutic joy of working with fiber and creating heirlooms with their own hands.
                            </p>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <Link 
                                to="/shop" 
                                className="px-6 py-3 bg-[#0F223D] text-[#E8C5A5] rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#1A365D] transition-colors"
                            >
                                Shop Collection
                            </Link>
                            <Link 
                                to="/categories/classes" 
                                className="px-6 py-3 border border-[#0F223D] text-[#0F223D] rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#0F223D] hover:text-[#E8C5A5] transition-colors"
                            >
                                Explore Classes
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div 
                        className="order-1 lg:order-2"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                            <img 
                                src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80" 
                                alt="Knitbi Handmade Craftsmanship" 
                                className="w-full h-[450px] object-cover"
                            />
                            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-stone-200">
                                <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold">Artisanal Ethos</p>
                                <p className="text-sm font-serif font-bold text-[#0F223D]">100% Hand-Crocheted • Zero Industrial Waste</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Mission and Values */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <span className="text-xs uppercase tracking-widest text-[#C49B76] font-semibold">Guiding Principles</span>
                        <h2 className="text-3xl font-serif font-bold text-[#0F223D] mt-1 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Our Craft & Values
                        </h2>
                        <p className="text-stone-600 max-w-2xl mx-auto text-sm md:text-base">
                            Guided by patience, sustainability, and mindful craftsmanship in every stitch.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div 
                            className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <div className="w-14 h-14 bg-[#FAF8F5] text-[#0F223D] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8C5A5]">
                                <FaAward className="text-2xl text-[#0F223D]" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-[#0F223D] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>100% Pure Craft</h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                Every piece is completely hand-hooked without automated machinery, preserving ancient artisanal techniques.
                            </p>
                        </motion.div>
                        
                        <motion.div 
                            className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <div className="w-14 h-14 bg-[#FAF8F5] text-[#0F223D] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8C5A5]">
                                <FaShieldAlt className="text-2xl text-[#0F223D]" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-[#0F223D] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Natural Fibers</h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                We source premium Egyptian combed cotton, organic raffia, and soft non-itch merino wool that caress your skin.
                            </p>
                        </motion.div>
                        
                        <motion.div 
                            className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <div className="w-14 h-14 bg-[#FAF8F5] text-[#0F223D] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8C5A5]">
                                <FaHeart className="text-2xl text-[#0F223D]" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-[#0F223D] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Maker Community</h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                Through workshops and hands-on masterclasses, we pass forward the meditative art of crochet to new generations.
                            </p>
                        </motion.div>
                    </div>
                </div>
                
                {/* Why Choose Us */}
                <div className="py-12 px-6 bg-white rounded-2xl border border-stone-200">
                    <div className="text-center mb-10">
                        <span className="text-xs uppercase tracking-widest text-[#C49B76] font-semibold">The Knitbi Standard</span>
                        <h2 className="text-3xl font-serif font-bold text-[#0F223D] mt-1 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Why Choose Knitbi
                        </h2>
                        <p className="text-stone-600 max-w-2xl mx-auto text-sm md:text-base">
                            What sets our handmade crochet atelier apart
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center p-4 text-center">
                            <FaShippingFast className="text-3xl text-[#0F223D] mb-3" />
                            <h3 className="text-lg font-bold text-[#0F223D] mb-1">Global & Local Delivery</h3>
                            <p className="text-stone-600 text-sm">
                                Secure door-to-door delivery across Lagos, nationwide in Nigeria, and international courier for diaspora clients.
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center p-4 text-center">
                            <FaHeadset className="text-3xl text-[#0F223D] mb-3" />
                            <h3 className="text-lg font-bold text-[#0F223D] mb-1">WhatsApp Concierge</h3>
                            <p className="text-stone-600 text-sm">
                                Direct sizing consultations and colorway tailoring with Jumoke to ensure your pieces fit your measurements flawlessly.
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center p-4 text-center">
                            <FaHandshake className="text-3xl text-[#0F223D] mb-3" />
                            <h3 className="text-lg font-bold text-[#0F223D] mb-1">Fair Artisan Pricing</h3>
                            <p className="text-stone-600 text-sm">
                                Direct from maker to customer, providing ethical value that honors the immense time and skill invested into every row.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
