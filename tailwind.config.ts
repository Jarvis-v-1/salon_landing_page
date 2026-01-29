import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "blush-light": "#FDF7F4",
        "blush": "#F6E3DA",
        "rose": "#E0B7A4",
        "deep-rose": "#C58673",
        "ink": "#1A1716",
        "soft-gold": "#D7B77A",
        "purple-dark": "#2D1B3D",
        "purple-black": "#1A0F26",
        "purple-light": "#4A2C5A"
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "soft-elegant": "0 18px 45px rgba(15, 8, 5, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;

