import type { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#080808',
        deep: '#0f0f0f',
        surface: '#161616',
        border: '#2a2a2a',
        gold: '#C9A84C',
        'gold-light': '#e8c96a',
        'gold-dim': 'rgba(201,168,76,0.15)',
        cream: '#F5EFE0',
        'cream-dim': 'rgba(245,239,224,0.6)',
        'tech-blue': '#4a9eff',
        'strategy-amber': '#C9A84C',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
