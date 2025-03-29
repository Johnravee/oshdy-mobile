/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary: '#D4A83F',
        secondary: '#2E3A8C',
        danger: '#9E2A2F'
      }
    },
  },
  plugins: [],
}