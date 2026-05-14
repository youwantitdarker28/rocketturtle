import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        mist: '#F8FAFC',
        sky: '#E0F2FE',
      },
      boxShadow: {
        soft: '0 10px 30px -15px rgba(2, 6, 23, 0.15)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 400ms ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
