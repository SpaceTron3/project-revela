/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        revela: {
          blue: '#185FA5',
          'blue-light': '#E6F1FB',
          'blue-dark': '#0C447C',
          navy: '#1A1A2E',
        },
      },
    },
  },
  plugins: [],
}
