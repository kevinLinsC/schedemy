/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      colors: {
        ink: {
          950: "#0c1a30",
          900: "#12233f",
          800: "#1c3a63",
          700: "#254b7d",
          600: "#2c5f92",
          100: "#e8eff8",
          50: "#f5f8fc",
        },
        clay: {
          600: "#b45309",
          500: "#c9701f",
          100: "#fdf3e3",
        },
        sage: {
          700: "#1c7d4d",
          100: "#e9f7ef",
        },
        brick: {
          700: "#a13d3d",
          100: "#fbeaea",
        },
        parchment: "#faf7f1",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(12,26,48,0.06), 0 8px 24px -8px rgba(12,26,48,0.12)",
        lift: "0 4px 10px rgba(12,26,48,0.08), 0 16px 40px -12px rgba(12,26,48,0.18)",
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(12,26,48,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
}
