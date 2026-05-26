import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1E40AF",
          hover: "#1D4ED8",
        },
        accent: {
          DEFAULT: "#D97706",
        },
      },
    },
  },
  plugins: [],
};

export default config;
