/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'primary-blue': '#3058A6',
        'primary-red': '#DB3E4D',
      },
    },
  },
  variants: {},
  plugins: [],
}


