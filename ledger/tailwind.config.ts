import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Near-black background, warm white text, deep emerald accent.
        ink: {
          950: "#0a0a09",
          900: "#111110",
          850: "#161614",
          800: "#1c1c1a",
          700: "#2a2a27",
          600: "#3d3d38",
          500: "#57574f",
        },
        paper: {
          50: "#faf8f3",
          100: "#f2ede2",
          200: "#e4dcc9",
          400: "#b9b2a0",
          600: "#847d6e",
        },
        emerald: {
          950: "#03130d",
          900: "#062419",
          800: "#0a3826",
          700: "#0f4d33",
          600: "#146640",
          500: "#1f8354",
          400: "#3aa873",
          300: "#6fc79b",
          200: "#a9e0c3",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "14px",
      },
      boxShadow: {
        rail: "0 0 0 1px rgba(255,255,255,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
