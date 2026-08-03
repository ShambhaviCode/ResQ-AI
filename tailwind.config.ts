import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f7ff',
          100: '#dfeeff',
          500: '#2d6cf6',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        crisis: '#ff6b57',
        rescue: '#10b981',
        midnight: '#07111f',
      },
      boxShadow: {
        soft: '0 10px 45px -12px rgba(15, 23, 42, 0.2)',
      },
    },
  },
  plugins: [],
} satisfies Config;
