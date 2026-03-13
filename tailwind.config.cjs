/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#080810",
        gold: "#C9973A",
        sand: "#E5D5B8",
        smoke: "rgba(255,255,255,0.08)",
        glass: "rgba(15,15,25,0.6)",
      },
      fontFamily: {
        heading: ["'Tenor Sans'", "serif"],
        body: ["'Jost'", "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 60px rgba(201,151,58,0.24)",
        panel: "0 15px 45px rgba(0,0,0,0.45)",
      },
      backdropBlur: {
        glass: "18px",
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(-4px)" },
          "50%": { transform: "translateY(6px)" },
        },
      },
    },
  },
  plugins: [],
};
