/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        card: "#1e293b",
        accent: "#38bdf8",
        textPrimary: "#e2e8f0",
        textSecondary: "#94a3b8",
        border: "#334155",
      },
    },
  },
  plugins: [],
};
