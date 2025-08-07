module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        indigo: require("tailwindcss/colors").indigo,
        pink: require("tailwindcss/colors").pink,
        purple: require("tailwindcss/colors").purple,
      },
    },
  },
  plugins: [],
}
