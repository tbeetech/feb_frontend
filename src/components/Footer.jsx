import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCreditCard, FaPaypal, FaApplePay } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
    }, 1500);
  };

  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <footer className="bg-off-black dark:bg-gray-900 text-white pt-16 pb-8">
      {/* Newsletter Banner */}
      <div className="bg-gold/10 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-display text-gold mb-2">Join Our VIP List</h3>
              <p className="text-gray-300 max-w-md">Subscribe to receive exclusive offers, early access to new collections, and luxury lifestyle tips.</p>
            </div>
            
            <div className="w-full md:w-auto">
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address" 
                    className="bg-black/30 text-white px-4 py-3 rounded-md text-sm border border-gold/30 focus:border-gold focus:outline-none w-full md:w-64"
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-md text-sm font-medium transition-colors duration-300 flex items-center justify-center"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : 'Subscribe'}
                  </button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald/20 text-emerald px-6 py-3 rounded-md text-sm font-medium border border-emerald/30"
                >
                  Thank you for subscribing! ✓
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo & About */}
          <motion.div 
            variants={itemVariants}
            className="space-y-4"
          >
            <Link to="/" className="font-display text-3xl font-semibold tracking-wide">
              feb<span className="text-gold">luxury</span><span className="text-gold">.</span>
            </Link>
            <p className="text-gray-400 dark:text-gray-300 mt-4 text-sm">
              Redefining luxury with stylish, practical, and affordable fashion accessories and clothing for the modern individual.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-3 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-gray-800 dark:bg-gray-700 flex items-center justify-center hover:bg-gold transition-colors duration-300">
                <FaFacebookF className="text-white" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-gray-800 dark:bg-gray-700 flex items-center justify-center hover:bg-gold transition-colors duration-300">
                <FaTwitter className="text-white" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-gray-800 dark:bg-gray-700 flex items-center justify-center hover:bg-gold transition-colors duration-300">
                <FaInstagram className="text-white" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-gray-800 dark:bg-gray-700 flex items-center justify-center hover:bg-gold transition-colors duration-300">
                <FaPinterestP className="text-white" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            variants={itemVariants}
            className="space-y-4"
          >
            <h3 className="text-xl font-display font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 dark:text-gray-300 hover:text-gold transition-colors duration-300">Home</Link></li>
              <li><Link to="/shop" className="text-gray-400 dark:text-gray-300 hover:text-gold transition-colors duration-300">Shop</Link></li>
              <li><Link to="/about" className="text-gray-400 dark:text-gray-300 hover:text-gold transition-colors duration-300">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 dark:text-gray-300 hover:text-gold transition-colors duration-300">Contact</Link></li>
              <li><Link to="/category/new" className="text-gray-400 dark:text-gray-300 hover:text-gold transition-colors duration-300">New Arrivals</Link></li>
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            variants={itemVariants}
            className="space-y-4"
          >
            <h3 className="text-xl font-display font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-gold mt-1 flex-shrink-0 text-lg" />
                <span className="text-gray-400 dark:text-gray-300">Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-gold flex-shrink-0 text-lg" />
                <a href="tel:+2348033825144" className="text-gray-400 dark:text-gray-300 hover:text-gold transition-colors duration-300">
                  +234 803 382 5144
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-gold flex-shrink-0 text-lg" />
                <a href="mailto:febluxurycloset@gmail.com" className="text-gray-400 dark:text-gray-300 hover:text-gold transition-colors duration-300">
                  febluxurycloset@gmail.com
                </a>
              </li>
            </ul>
            
            <h3 className="text-xl font-display font-semibold mt-8 mb-4">Business Hours</h3>
            <ul className="text-sm space-y-2 text-gray-400 dark:text-gray-300">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 4:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
            </ul>
          </motion.div>

          {/* Instagram Feed */}
          <motion.div 
            variants={itemVariants}
            className="space-y-4"
          >
            <h3 className="text-xl font-display font-semibold mb-6">Instagram</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <a 
                  key={item} 
                  href="https://www.instagram.com/f.e.b_luxurycloset" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block aspect-square overflow-hidden rounded-md group"
                >
                  <div className="w-full h-full bg-gray-800 dark:bg-gray-700 relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300">
                      <FaInstagram className="text-white text-xl" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            <h3 className="text-xl font-display font-semibold mt-8 mb-4">We Accept</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <FaCreditCard className="text-2xl text-gray-400 dark:text-gray-300" />
              <FaPaypal className="text-2xl text-gray-400 dark:text-gray-300" />
              <FaApplePay className="text-2xl text-gray-400 dark:text-gray-300" />
              <span className="text-2xl text-gray-400 font-medium dark:text-gray-300">Bank Transfer</span>
            </div>
          </motion.div>
        </div>

        {/* Social Media Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300">
              <FaFacebookF />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com/f.e.b_luxurycloset" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300">
              <FaInstagram />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300">
              <FaPinterestP />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p className="text-gray-500">© {currentYear} febluxury. All rights reserved.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-gray-500">
            <Link to="/privacy" className="hover:text-gold transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors duration-300">Terms of Service</Link>
            <Link to="/shipping" className="hover:text-gold transition-colors duration-300">Shipping Policy</Link>
            <Link to="/returns" className="hover:text-gold transition-colors duration-300">Returns & Exchanges</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;