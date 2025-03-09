/** @type {import('tailwindcss').Config} */
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
        'primary': 'gold',
        'gold': '#FFD700',  // Add this line
        'primary-dark': "#d23141",
        'primary-light': 'grey',
        'text-dark': '#0f172a',
        'text-light': '#64748b',
        'extra-light': '#f8fafc',
        primary: {
          DEFAULT: '#916d03',
          dark: '#6a5002',
        },
        gold: '#c9a64b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
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
    require('@tailwindcss/aspect-ratio'),
  ],
}