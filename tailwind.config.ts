import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0F2A47", 800: "#15355A", 900: "#0A1F36" },
        brand: { DEFAULT: "#E43820", dark: "#C92F18", soft: "#FCE4D6" },
        cream: { DEFAULT: "#FFF7EA", 100: "#FFFBF4", 200: "#FBEBD3" },
        beige: "#F6E4C8",
        ink: { DEFAULT: "#0F2A47", muted: "#5B6B7F" },
        line: "#F0DFC6",
      },
      fontFamily: {
        sans: ["var(--font-cairo-latin)", "var(--font-cairo-arabic)", "system-ui", "sans-serif"],
        alexandria: ["var(--font-alexandria)", "var(--font-cairo-arabic)", "system-ui", "sans-serif"],
      },
      borderRadius: { card: "1.25rem", xl2: "1.75rem" },
      boxShadow: {
        card: "0 8px 24px -12px rgba(15,42,71,.18)",
        pop: "0 24px 60px -24px rgba(15,42,71,.35)",
        cta: "0 10px 24px -8px rgba(228,56,32,.55)",
      },
    },
  },
  plugins: [],
};
export default config;
