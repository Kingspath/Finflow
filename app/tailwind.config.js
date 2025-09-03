/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "finflow-primary": "#00695C",   // Teal
        "finflow-secondary": "#FFB300", // Amber
        "finflow-dark": "#212121",      // Dark Grey
        "finflow-light": "#F5F5F5",     // Light Grey
      },
    },
  },
  plugins: [],
};
