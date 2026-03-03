import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nanofi: {
          dark: "#0a0a0b",
          panel: "#111113",
          surface: "#18181b",
          border: "#27272a",
          muted: "#71717a",
          primary: "#22d3ee",
          accent: "#a78bfa",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 6vw + 1rem, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2rem, 4vw + 0.5rem, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.5rem, 2vw + 0.5rem, 2.25rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(34, 211, 238, 0.2)",
        "glow-lg": "0 0 80px -20px rgba(34, 211, 238, 0.15)",
        inner: "inset 0 1px 0 0 rgba(255,255,255,0.03)",
      },
    },
  },
  plugins: [],
};
export default config;
