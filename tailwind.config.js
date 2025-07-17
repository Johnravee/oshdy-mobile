/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}",'./components/**/*.{js,jsx,ts,tsx}'],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary: '#F3C663',
        background: '#ffffff',
        secondary: '#2E3A8C',
        danger: '#9E2A2F',
        dark: '#333333'
      },
    },
  },
  plugins: [],
}