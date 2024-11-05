/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FF7BAC',
        'primary-light': '#FFE5EE',
        secondary: '#FF97BE',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [],
}