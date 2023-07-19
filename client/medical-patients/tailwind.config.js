/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      PTSans: ['PT Sans', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#008080',
        secondary: '#fcfbff',
        tertiary: '#003030',
      },
    },
  },
  plugins: [],
};
