import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#070812',
        aurora: '#8b5cf6',
        cyber: '#22d3ee',
        spotify: '#1DB954',
        youtube: '#FF0033',
        tiktok: '#00F2EA',
      },
      boxShadow: {
        glow: '0 0 70px rgba(139, 92, 246, 0.35)',
        glass: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 24px 80px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        'noise-gradient': 'radial-gradient(circle at top left, rgba(34, 211, 238, 0.24), transparent 36%), radial-gradient(circle at top right, rgba(139, 92, 246, 0.26), transparent 38%), linear-gradient(135deg, #070812 0%, #101225 45%, #080914 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
