// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // background
        'bg-light': '#FBFBFB',
        'bg-dark':  '#1B1B1B',
        // outer containers
        'outer-light': '#F4F4F4',
        'outer-dark':  '#242424',
        // inner containers
        'inner-light': '#FBFBFB',
        'inner-dark':  '#242424',
        // text primary / secondary
        'text-primary':      '#000000',
        'text-primary-dark': '#EDEDED',
        'text-secondary':    '#BFBFBF',
        'text-secondary-dark':'#6C6B6B',
      },
    },
  },
  plugins: [],
}
