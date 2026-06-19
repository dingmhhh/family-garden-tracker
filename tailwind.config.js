/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f2f7f1',
          100: '#dfeadb',
          200: '#bdd6b6',
          300: '#94bc89',
          400: '#6c9d61',
          500: '#4f7f45',
          600: '#3c6535',
          700: '#31502c',
          800: '#284025',
          900: '#1f3320',
        },
        soil: {
          50: '#f8f4f0',
          100: '#ecdfd2',
          200: '#d9bea2',
          300: '#bf9871',
          400: '#a3754d',
          500: '#825936',
          600: '#664429',
          700: '#4d3320',
          800: '#382517',
          900: '#271a10',
        },
        sun: {
          50: '#fefaed',
          100: '#fcf0c8',
          200: '#f8de8a',
          300: '#f3c84e',
          400: '#edb22b',
          500: '#dd961a',
          600: '#bb7414',
          700: '#945614',
          800: '#794417',
          900: '#673a18',
        },
        tomato: {
          400: '#e26747',
          500: '#cc4a28',
          600: '#ab3a1f',
        },
        cream: '#faf7f0',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(40, 64, 37, 0.08)',
      },
    },
  },
  plugins: [],
}
