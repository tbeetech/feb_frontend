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
            <h4 className="text-sm font-medium uppercase mb-4">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/contact" className="text-gray-400">Help & Contact</Link></li>
              <li><span className="text-gray-400">Shipping & Delivery</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium uppercase mb-4">About FEB Luxury</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-gray-500 hover:text-black transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium uppercase mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/terms" className="text-gray-500 hover:text-black transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-black transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium uppercase mb-4">Connect with us</h4>
            <div className="flex space-x-4 mt-4">
                <a 
                    href="https://www.instagram.com/f.e.b_luxuryclosetbackup1" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-black transition-colors retro-shadow"
                    aria-label="Instagram"
                >
                    <FaInstagram size={18} />
                </a>
                <a 
                    href="https://wa.me/message/NP6XO5SXNXG5G1" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-black transition-colors retro-shadow"
                    aria-label="WhatsApp"
                >
                    <FaWhatsapp size={18} />
                </a>
                <a 
                    href="https://t.me/febluxury" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-black transition-colors retro-shadow"
                    aria-label="Telegram"
                >
                    <FaTelegram size={18} />
                </a>
            </div>
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0 retro-text">
            &copy; {currentYear} FEB Luxury. All rights reserved.
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
            
            <a href="https://tbeetech.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-black transition-colors">
              Designed by Tbeetech
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;