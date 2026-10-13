import { useState } from 'react';
import { Link } from 'react-router-dom';
import CurrencySwitcher from './CurrencySwitcher';
import { FaChevronDown, FaInstagram, FaWhatsapp, FaTelegram } from 'react-icons/fa';

const RegionSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState({ code: 'NG', name: 'Nigeria', flag: '🇳🇬' });
  
  const regions = [
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'EU', name: 'European Union', flag: '🇪🇺' }
  ];
  
  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm text-gray-700 hover:text-black"
      >
        <span className="font-medium mr-1">{selectedRegion.flag} {selectedRegion.name}</span>
        <FaChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100">
          {regions.map((region) => (
            <button
              key={region.code}
              className={`block w-full text-left px-4 py-2 text-sm ${
                selectedRegion.code === region.code
                  ? 'bg-gray-100 font-medium'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleRegionSelect(region)}
            >
              <div className="flex items-center">
                <span className="mr-2">{region.flag}</span>
                <span>{region.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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

  return (
    <footer className="border-t border-gray-200 bg-white text-gray-700 py-12 pb-32 lg:pb-12">
      {/* Newsletter section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-xl font-medium mb-3">NEVER MISS A THING</h3>
          <p className="text-gray-500 mb-6">
            Sign up for promotions, tailored new arrivals, stock updates and more – straight to your inbox
          </p>
          
              {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address" 
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 focus:outline-none focus:border-gray-500"
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                className="bg-black text-white px-6 py-2 font-medium hover:bg-gray-800 transition-all"
              >
                <span className="text-white">{loading ? 'Sending...' : 'Sign Up'}</span>
                  </button>
                </form>
              ) : (
            <div className="text-green-600 font-medium">
              Thank you for subscribing!
            </div>
          )}
        </div>
      </div>
      
      {/* Main footer */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2.5 mb-3">
              <img src="/knitbi-logo.png" alt="Knitbi" className="w-8 h-8 rounded-full object-cover border border-[#E8C5A5]" />
              <span className="font-serif font-bold text-base text-[#0F223D]">Knitbi-c</span>
            </div>
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              100% Handmade Crochet Wears & Mindful Maker Classes.
            </p>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-3">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-stone-500 hover:text-black">Help & Concierge</Link></li>
              <li><span className="text-stone-400">Shipping & Delivery</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium uppercase mb-4 tracking-wider text-[#0F223D]">About Knitbi</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-gray-500 hover:text-black transition-colors">Our Story & Craft</Link></li>
              <li><Link to="/categories/classes" className="text-gray-500 hover:text-black transition-colors">Crochet Classes</Link></li>
              <li><Link to="/categories/custom" className="text-gray-500 hover:text-black transition-colors">Bespoke Commissions</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium uppercase mb-4 tracking-wider text-[#0F223D]">Legal & Care</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/terms" className="text-gray-500 hover:text-black transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-black transition-colors">Privacy Policy</Link></li>
              <li><span className="text-stone-400">Crochet Care Guide</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium uppercase mb-4 tracking-wider text-[#0F223D]">Connect With Us</h4>
            <p className="text-xs text-stone-500 mb-3">Reach out for custom crochet orders, sizing advice, or class registrations.</p>
            <div className="flex space-x-3 mt-3">
                <a 
                    href="https://wa.me/2348033825144"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#0F223D] text-[#E8C5A5] rounded-full flex items-center justify-center hover:bg-[#1B355A] transition-colors"
                    aria-label="WhatsApp Concierge"
                >
                    <FaWhatsapp size={18} />
                </a>
                <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 hover:bg-stone-200 hover:text-black transition-colors"
                    aria-label="Instagram"
                >
                    <FaInstagram size={18} />
                </a>
            </div>
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {currentYear} Knitbi. 100% Handmade Crochet Wears. All rights reserved.
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center text-sm text-gray-500">
              <span>Country/Region:</span>
              <div className="ml-2">
                <RegionSwitcher />
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <span>Currency:</span>
              <div className="ml-2">
                <CurrencySwitcher />
              </div>
            </div>
            
              <a href="https://tbeetech.github.io" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-black transition-colors">
                Designed by Tbeetech <span className="text-blue-600 hover:text-blue-800">portfolio</span>              </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;