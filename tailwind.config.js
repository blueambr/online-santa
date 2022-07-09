/** @type {import('tailwindcss').Config} */
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
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["emerald", "forest"],
    darkTheme: "forest",
  },
};
