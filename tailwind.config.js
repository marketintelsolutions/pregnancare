/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'primary-blue': '#3058A6',
        'primary-red': '#DB3E4D',
        'primary-green': '#0B9339',
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
      boxShadow: {
        mapShadow: '30px 35px 45px 0px rgba(209, 217, 230, 0.48), 30px 28px 38px 0px rgba(209, 217, 230, 0.40), 30px 24px 34px 0px rgba(209, 217, 230, 0.34), 30px 54px 67px 0px rgba(209, 217, 230, 0.67)',
        submitBtn: '0px 8px 30px 0px rgba(0, 191, 178, 0.10)'
      }
    },
  },
  variants: {},
  plugins: [],
}


