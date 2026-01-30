import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Primary maroon/burgundy palette
        "maroon": {
          50: "#fdf2f4",
          100: "#fce7eb",
          200: "#f9d0d9",
          300: "#f4a8b8",
          400: "#ec7691",
          500: "#e04a6d",
          600: "#cc2952",
          700: "#ab1d42",
          800: "#8f1b3c",
          900: "#7a1a38",
          950: "#44091a",
          DEFAULT: "#6B1C23", // Deep maroon
          dark: "#4A1118",
          darker: "#2D0A0E",
        },
        // Gold accents
        "gold": {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#D4AF37", // Classic gold
          600: "#C5A028",
          700: "#A37E16",
          800: "#854D0E",
          900: "#713F12",
          DEFAULT: "#D4AF37",
          light: "#E8C65A",
          dark: "#B8962F",
        },
        // Cream/off-white backgrounds
        "cream": {
          50: "#FFFDF8",
          100: "#FFF9E8",
          200: "#FFF3D1",
          300: "#FFEAB0",
          DEFAULT: "#FDF5E6",
          dark: "#F5ECD9",
        },
        // Legacy colors for compatibility
        "soft-gold": "#D4AF37",
        "ink": "#1A1716",
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

