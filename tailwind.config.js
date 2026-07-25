/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './templates/**/*.html', './src/js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans KR"', '"Noto Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ios: {
          blue: '#007AFF',
          green: '#34C759',
          bg: '#FFFFFF',
          card: '#FFFFFF',
          label: '#1C1C1E',
          secondary: '#8E8E93',
          separator: '#E5E5EA',
          beige: '#FFFFFF',
          lavender: '#FFFFFF',
        },
      },
      maxWidth: {
        mobile: '430px',
        tablet: '720px',
      },
      screens: {
        ta: '768px',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
};
