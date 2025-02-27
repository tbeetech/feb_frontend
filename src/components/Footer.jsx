import React from 'react';
import { FaTelegram, FaWhatsapp, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div>
            <h3 className="text-2xl font-playfair text-white mb-4">
              febluxury<span className="text-primary">.</span>
            </h3>
            <p className="text-sm mb-4">
              Your premier destination for luxury fashion, accessories, and fragrances. 
              Experience elegance redefined.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <a href="https://t.me/febluxury" 
                 className="flex items-center gap-2 p-2 border border-gray-700 rounded hover:border-primary hover:text-primary transition-colors">
                <FaTelegram />
                <span className="text-sm">Telegram</span>
              </a>
              <a href="https://wa.me/message/NP6XO5SXNXG5G1" 
                 className="flex items-center gap-2 p-2 border border-gray-700 rounded hover:border-green-500 hover:text-green-500 transition-colors">
                <FaWhatsapp />
                <span className="text-sm">WhatsApp</span>
              </a>
              <a href="https://www.instagram.com/f.e.b_luxurycloset" 
                 className="flex items-center gap-2 p-2 border border-gray-700 rounded hover:border-pink-500 hover:text-pink-500 transition-colors">
                <FaInstagram />
                <span className="text-sm">F.E.B Luxury</span>
              </a>
              <a href="https://www.instagram.com/jumiescent" 
                 className="flex items-center gap-2 p-2 border border-gray-700 rounded hover:border-pink-500 hover:text-pink-500 transition-colors">
                <FaInstagram />
                <span className="text-sm">Jumiescent</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/shop" className="hover:text-primary transition-colors">Shop</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/track-order" className="hover:text-primary transition-colors">Track Order</a></li>
              <li><a href="/shipping" className="hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="/returns" className="hover:text-primary transition-colors">Returns & Exchange</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                <span>Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-primary flex-shrink-0" />
                <a href="tel:+2348033825144" className="hover:text-primary transition-colors">
                  +234 803 382 5144
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary flex-shrink-0" />
                <a href="mailto:febluxurycloset@gmail.com" className="hover:text-primary transition-colors">
                febluxurycloset@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Business Hours */}
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <form className="mb-4">
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-800 text-white px-3 py-2 rounded text-sm flex-1 border border-gray-700 focus:border-primary focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <h4 className="text-white font-semibold mb-2">Business Hours</h4>
            <ul className="text-sm space-y-1">
              <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
              <li>Saturday: 10:00 AM - 4:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-4 border-t border-gray-800 text-center text-sm">
          <p>© {currentYear} febluxury. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;