/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f6fa',
          100: '#e9ebf5',
          200: '#d0d5ea',
          300: '#a8b2d7',
          400: '#7886be',
          500: '#5e6ca8',
          600: '#4b558c',
          700: '#3f4672',
          800: '#363c5e',
          900: '#30364f',
          950: '#1e2134',
        },
        accent: {
          50: '#f6f7f2',
          100: '#e7ead9',
          200: '#d3dab9',
          300: '#b9c58f',
          400: '#a3b36a',
          500: '#869748',
          600: '#687639',
          700: '#515c30',
          800: '#434b2c',
          900: '#3b4129',
          950: '#1e2213',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
} 