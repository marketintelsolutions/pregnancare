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

        // new
        'lightblue': '#CEDBE6',
        'darkblue': '#0A3F6E',
        'coolblue': '#3158A4',
        'navyblue': '#193B7E',
        'yellow': '#FFE500',
        'primarytext': '#44566C',
        'red': '#DB3E4D',
      },
    },
  },
  variants: {},
  plugins: [],
}


