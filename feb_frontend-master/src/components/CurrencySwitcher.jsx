import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const currencies = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' }
];

// Fixed exchange rates (In real app, these would come from an API)
const exchangeRates = {
  NGN: 1,
  USD: 0.00067, // 1 NGN = 0.00067 USD
  EUR: 0.00062, // 1 NGN = 0.00062 EUR
  GBP: 0.00052  // 1 NGN = 0.00052 GBP
};

const CurrencySwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]); // Default to Naira
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Save selected currency to localStorage
  useEffect(() => {
    localStorage.setItem('selectedCurrency', JSON.stringify(selectedCurrency));
    // Dispatch an event so other components can listen for currency changes
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: selectedCurrency }));
  }, [selectedCurrency]);

  // Load saved currency on initial render
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      try {
        setSelectedCurrency(JSON.parse(savedCurrency));
      } catch (e) {
        console.error('Error loading saved currency', e);
      }
    }
  }, []);

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm text-gray-700 hover:text-black"
        aria-label="Select currency"
      >
        <span className="font-medium mr-1">{selectedCurrency.symbol} {selectedCurrency.code}</span>
        <FaChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              className={`block w-full text-left px-4 py-2 text-sm ${
                selectedCurrency.code === currency.code
                  ? 'bg-gray-100 font-medium'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleCurrencySelect(currency)}
            >
              <div className="flex justify-between items-center">
                <span>{currency.name}</span>
                <span className="font-medium">{currency.symbol}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Utility function to format price in the selected currency
export const formatPrice = (priceInNaira, currencyCode = 'NGN') => {
  if (!priceInNaira) return '0';
  
  // Get the exchange rate for the selected currency
  const rate = exchangeRates[currencyCode] || 1;
  
  // Convert the price from Naira to the selected currency
  const convertedPrice = priceInNaira * rate;
  
  // Format the price with commas and the appropriate number of decimal places
  let formattedPrice;
  if (currencyCode === 'NGN') {
    formattedPrice = convertedPrice.toLocaleString('en-NG', { maximumFractionDigits: 0 });
  } else {
    formattedPrice = convertedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  return formattedPrice;
};

// Custom hook to use the selected currency throughout the app
export const useCurrency = () => {
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    return savedCurrency ? JSON.parse(savedCurrency) : currencies[0];
  });
  
  useEffect(() => {
    const handleCurrencyChange = (e) => {
      setCurrency(e.detail);
    };
    
    window.addEventListener('currencyChange', handleCurrencyChange);
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, []);
  
  return {
    currency,
    formatPrice: (price) => formatPrice(price, currency.code),
    currencySymbol: currency.symbol
  };
};

export default CurrencySwitcher; 