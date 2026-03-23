import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050b24',
          900: '#0A1D56',
          800: '#102E7A'
        },
        gold: {
          500: '#D4AF37',
          400: '#EACB68'
        }
      },
      boxShadow: {
        glow: '0 0 50px rgba(212,175,55,0.28)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, #1f357f 0%, #050b24 60%)'
      }
    }
  },
  plugins: []
};

export default config;
