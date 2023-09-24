/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: "Poppins, sans-serif",
      },
      colors: {
        primary: {
          1: "#FF6D35",
        },
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin")],
}
