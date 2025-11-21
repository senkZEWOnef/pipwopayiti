/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Pi Pwòp palette - Light theme
        "pp-navy": "#10243D",
        "pp-deep": "#143861",
        "pp-blue": "#2F80ED",
        "pp-sky": "#8CC4FF",
        "pp-gray": "#F3F5F8",
        
        // Dark theme palette inspired by NextRBZ
        "dark": {
          "bg": "#000000",
          "surface": "#111111",
          "card": "#1a1a1a",
          "border": "#333333",
          "text": "#ffffff",
          "text-secondary": "#a1a1aa",
          "accent": "#ffffff",
          "accent-blue": "#3b82f6"
        },
        
        // Modern gradient colors
        "gradient": {
          "start": "#6366f1",
          "end": "#8b5cf6"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "soft-card": "0 18px 45px rgba(16,36,61,0.08)",
        "dark-card": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        "glow": "0 0 20px rgba(99, 102, 241, 0.3)"
      },
      backdropBlur: {
        xs: '2px'
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        }
      }
    }
  },
  plugins: []
};