/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Pi Pwòp palette
        "pp-navy": "#10243D",
        "pp-deep": "#143861",
        "pp-blue": "#2F80ED",
        "pp-sky": "#8CC4FF",
        "pp-gray": "#F3F5F8"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "soft-card": "0 18px 45px rgba(16,36,61,0.08)"
      }
    }
  },
  plugins: []
};