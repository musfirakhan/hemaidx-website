/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FFE4E8', // Light pink
          DEFAULT: '#FFC0CB', // Pink
        },
        secondary: {
          DEFAULT: '#000080', // Navy blue
          dark: '#000066',
        }
      }
    },
  },
  plugins: [],
};