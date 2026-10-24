import type { Config } from "tailwindcss";

// Palette measured from onlines.com.ar (Apple-like neutrals + Figma accents).
const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#ffffff",
        mist: "#f5f5f7",
        ink: "#1d1d1f",
        "ink-soft": "#424242",
        "ink-faint": "#8a8a8e",
        blue: { DEFAULT: "#0859d4", hover: "#1a59f9" },
        yellow: "#ffc700",
        sky: "#18a0fb",
        pink: "#ee46d3",
        green: "#1bc47d",
        orange: "#ef5533",
        violet: "#6465ed",
        teal: "#00b5ce",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        marker: ["var(--font-marker)", "cursive"],
        note: ["var(--font-note)", "cursive"],
      },
      boxShadow: {
        lift: "0 18px 40px -18px rgba(29,29,31,0.35)",
        paper: "0 1px 2px rgba(29,29,31,0.08), 0 8px 24px -12px rgba(29,29,31,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
