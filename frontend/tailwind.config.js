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
          100: "#e8eff8",
          50: "#f5f8fc",
        },
        // Azul da logo do Schedemy — cor de destaque do sistema.
        brand: {
          950: "#0d1e31",
          900: "#142e49",
          800: "#173657",
          700: "#1a416c",
          600: "#1f5086",
          500: "#2f6aa8",
          400: "#5793c8",
          300: "#8db8de",
          200: "#bcd5ed",
          100: "#dbe9f6",
          50: "#f0f6fb",
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
