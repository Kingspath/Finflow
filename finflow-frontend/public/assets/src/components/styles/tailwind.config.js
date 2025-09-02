/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finflow: {
          primary: "#00695C",   // teal
          secondary: "#FFB300", // amber
          dark: "#212121",
          light: "#F5F5F5",
        },
      },
    },
  },
  plugins: [],
};
