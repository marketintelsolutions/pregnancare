/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'primary-blue': '#3058A6',
        'primary-red': '#DB3E4D',
        'danger-red': '#FF4D4F',
        'light-red': 'rgba(255, 77, 79, 0.10)',
        'neutral-gray': '#C6C6C6',
      },
    },
  },
  variants: {},
  plugins: [],
}


