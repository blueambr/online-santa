/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Rubik", ...defaultTheme.fontFamily.sans],
        serif: ["Comfortaa", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    base: false,
    themes: [
      {
        main: {
          primary: "#FACC15",
          "primary-content": "#171717",
          neutral: "#64748B",
          "neutral-content": "#F1F5F9",
          "base-100": "#0F172A",
          "base-200": "#111827",
          "base-300": "#18181B",
          "base-content": "#F3F4F6",
          info: "#38BDF8",
          success: "#4ADE80",
          warning: "#FB923C",
          error: "#F87171",
        },
      },
    ],
  },
};
