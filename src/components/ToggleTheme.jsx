import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ToggleTheme = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      className={`flex items-center justify-center p-2 rounded-full ${
        theme === 'dark' 
          ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${className}`}
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <motion.div
          initial={{ rotate: -30, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 30, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaSun className="w-5 h-5" />
        </motion.div>
      ) : (
        <motion.div
          initial={{ rotate: 30, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: -30, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaMoon className="w-5 h-5" />
        </motion.div>
      )}
    </motion.button>
  );
};

export default ToggleTheme; 