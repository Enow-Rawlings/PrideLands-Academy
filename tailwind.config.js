// FILE: tailwind.config.js  ← project ROOT
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PrideLands Brand Palette
        navy: {
          50:  '#e8edf5',
          100: '#c5d0e6',
          200: '#9fb0d4',
          300: '#7890c2',
          400: '#5a76b5',
          500: '#3d5da8',
          600: '#2d4a8f',
          700: '#1e3570',
          800: '#112050',
          900: '#0A1628', // PRIMARY NAVY
          950: '#060e1a',
        },
        gold: {
          300: '#e8d08a',
          400: '#dfc06a',
          500: '#C9A84C', // PRIMARY GOLD
          600: '#b08a30',
          700: '#8a6a20',
        },
        crimson: {
          400: '#e05555',
          500: '#cc2222',
          600: '#B91C1C', // PRIMARY RED ACCENT
          700: '#9b1515',
        },
        slate: {
          academy: '#F8F9FB', // section alternating bg
        }
      },
      fontFamily: {
        display: ['Barlow', 'sans-serif'],    // headings - bold, geometric
        body:    ['Inter', 'sans-serif'],     // body text
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['4.5rem',  { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl':  ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg':  ['3rem',    { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-md':  ['2.25rem', { lineHeight: '1.2',  letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm':  ['1.875rem',{ lineHeight: '1.25', fontWeight: '600' }],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0A1628 0%, #1e3570 50%, #0A1628 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #e8d08a 50%, #C9A84C 100%)',
        'navy-gold':     'linear-gradient(135deg, #0A1628 0%, #2d4a8f 70%, #C9A84C 100%)',
        'section-dark':  'linear-gradient(180deg, #0A1628 0%, #112050 100%)',
      },
      boxShadow: {
        'gold':   '0 4px 24px rgba(201, 168, 76, 0.25)',
        'navy':   '0 4px 24px rgba(10, 22, 40, 0.35)',
        'card':   '0 2px 16px rgba(10, 22, 40, 0.10)',
        'card-hover': '0 8px 32px rgba(10, 22, 40, 0.18)',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'shimmer':    'shimmer 2s infinite',
        'float':      'float 3s ease-in-out infinite',
        'count-up':   'countUp 2s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      borderRadius: {
        'academy': '12px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
