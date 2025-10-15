import type { Config } from 'tailwindcss';
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hack-black': '#000000',
        'hack-navy': '#0a0a1f',
        'hack-deep': '#050510',
        'cyber-blue': {
          400: '#00a8ff',
          500: '#0097e6',
        },
        'neon-blue': '#00d9ff',
        'electric-cyan': '#00fff7',
        'matrix-green': '#00ff41',
        'alert-red': '#ff4757',
        'warning-orange': '#ff6b35',
        'glass': {
          border: 'rgba(255, 255, 255, 0.1)',
          panel: 'rgba(255, 255, 255, 0.05)',
          strong: 'rgba(0, 0, 0, 0.4)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '12px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'glitch': 'glitch 0.5s infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(28, 171, 242, 0.4), 0 0 40px rgba(28, 171, 242, 0.2)',
            opacity: '1'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(28, 171, 242, 0.6), 0 0 60px rgba(28, 171, 242, 0.3)',
            opacity: '0.9'
          },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;