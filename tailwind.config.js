/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#F5F2EC', light: '#FFFFFF' },
        red: { DEFAULT: '#C8201A', dark: '#8B1410', light: '#E63B35' },
        cream: { DEFAULT: '#1A1A1A', dark: '#6B6B6B' },
        'site-white': '#FAFAF7',
        'site-gray': { DEFAULT: '#DDD9D0', light: '#C4C0B8', lighter: '#9B9B9B' },
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        marker: ['"Permanent Marker"', 'cursive'],
        body: ['"Noto Sans TC"', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
