/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'finflow-light': '#f9fafb',      // Background
        'finflow-dark': '#1f2937',       // Text
        'finflow-primary': '#2563eb',    // Blue (main brand)
        'finflow-primary-dark': '#1d4ed8',
        'finflow-secondary': '#10b981',  // Green (accents)
        'finflow-accent': '#f59e0b',     // Orange (alerts/highlights)
        'finflow-danger': '#ef4444',     // Red (errors)
        'finflow-gray': '#9ca3af',       // Muted text
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'finflow-card': '0 4px 10px rgba(0,0,0,0.05)',
        'finflow-hover': '0 8px 20px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'finflow': '0.5rem',
      },
      backgroundImage: {
        'finflow-gradient': 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
      },
    },
  },
  plugins: [],
}
