import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
        colors: {
          // New Premium System
          "royal-red": {
            DEFAULT: "#C62828", // Primary CTA
            hover: "#B71C1C",
          },
          "royal-blue": {
            DEFAULT: "#1E3A8A", // Headings/Trust
            dark: "#172554",
          },
          "cool-white": "#EEF3F8", // Hero/Major sections
          "warm-white": "#F4F3EF", // Services/Content
          "soft-grey": "#D1D5DB", // Borders/Cards
          
          // Legacy/Compatibility (Retaining but remapping where possible or minimizing)
          "maroon": {
            DEFAULT: "#C62828", // Remapped to Royal Red for safety
            900: "#2B2B2B", // Remapped to Primary Text
            700: "#1E3A8A", // Remapped to Royal Blue
          },
          "gold": {
            DEFAULT: "#C9A24D", // Soft Gold
            light: "#D4B46E",
            dark: "#A68535",
          },
          "cream": "#F4F3EF", // Remapped to Warm White
        },
      fontFamily: {
        display: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Poppins", "system-ui", "sans-serif"],
        script: ["Great Vibes", "cursive"],
      },
      boxShadow: {
        "elegant": "0 4px 20px rgba(107, 28, 35, 0.15)",
        "elegant-lg": "0 10px 40px rgba(107, 28, 35, 0.2)",
        "gold": "0 4px 20px rgba(212, 175, 55, 0.3)",
        "soft": "0 2px 15px rgba(0, 0, 0, 0.08)",
      },
      backgroundImage: {
        "maroon-gradient": "linear-gradient(135deg, #6B1C23 0%, #4A1118 50%, #2D0A0E 100%)",
        "gold-gradient": "linear-gradient(135deg, #E8C65A 0%, #D4AF37 50%, #B8962F 100%)",
        "cream-gradient": "linear-gradient(180deg, #FDF5E6 0%, #FFF9E8 100%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    }
  },
  plugins: []
};

export default config;

