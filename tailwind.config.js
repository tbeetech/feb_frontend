/** @type {import('tailwindcss').Config} */
import aspectRatio from '@tailwindcss/aspect-ratio';
import forms from '@tailwindcss/forms';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        'screen-2xl': '1400px', 
        'custom-1200': '1200px', 
        'custom-900': '900px', 
      },
      colors: {
        'primary': '#D4AF37',
        'primary-dark': '#B38728',
        'primary-light': '#E5C76B',
        'text-dark': '#0f172a',
        'text-light': '#64748b',
        'extra-light': '#f8fafc',
        'off-black': '#1A1A1A',
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E5C76B',
          dark: '#B38728',
          50: '#F9F4E3',
          100: '#F3E9C6',
          200: '#ECD98E',
          300: '#E5C956',
          400: '#DFBA1E',
          500: '#D4AF37',
          600: '#B38728',
          700: '#8A671F',
          800: '#624815',
          900: '#39290C',
        },
        black: {
          DEFAULT: '#000000',
          rich: '#0A0A0A',
          off: '#1A1A1A',
        },
        cream: '#F8F5E6',
        ivory: '#FFFFF0',
        pearl: '#F5F5F5',
        burgundy: {
          DEFAULT: '#800020',
          light: '#A30028',
          dark: '#5C0018',
        },
        navy: {
          DEFAULT: '#000080',
          light: '#0000A0',
          dark: '#000060',
        },
        emerald: {
          DEFAULT: '#046307',
          light: '#057709',
          dark: '#034F05',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Times New Roman', 'serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      boxShadow: {
        'luxury': '0 4px 20px rgba(212, 175, 55, 0.15)',
        'luxury-hover': '0 10px 30px rgba(212, 175, 55, 0.2)',
        'card': '0 4px 10px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 30px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(45deg, #D4AF37, #E5C76B)',
        'gold-gradient-reverse': 'linear-gradient(45deg, #E5C76B, #D4AF37)',
        'dark-gradient': 'linear-gradient(45deg, #000000, #1A1A1A)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [
    aspectRatio,
    forms,
  ],
}