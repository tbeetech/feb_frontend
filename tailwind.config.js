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
        'primary': '#D4AF37',
        'primary-dark': '#B38728',
        'primary-light': '#E5C76B',
        'text-dark': '#0f172a',
        'text-light': '#64748b',
        'extra-light': '#f8fafc',
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E5C76B',
          dark: '#B38728',
        }
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