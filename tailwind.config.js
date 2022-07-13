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
          neutral: "#A3A3A3",
          "neutral-content": "#F5F5F5",
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
