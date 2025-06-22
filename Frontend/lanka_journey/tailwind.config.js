/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [ "./app/**/*.{js,jsx,ts,tsx}","./App.tsx", "./components/**/*.{js,jsx,ts,tsx}",],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00296b',   // Deep navy blue
          100: '#8aa3d4',       // Light muted blue (for hover/backgrounds)
          200: '#4a6ea8',       // Mid-tone blue (for cards/borders)
          300: '#003a8c',       // Slightly lighter than main (for accents)
        },
        secondary: {
          DEFAULT: '#ffc600',
          100: '#fff1b3',  // Light pastel yellow
          200: '#ffe066',  // Softer bright yellow
          300: '#ffd000',  // Slightly deeper than main
        },
        accent: '#fffae4',
        background: '#eeeeee',
        muted: '#a8a8a8',
      },
    },
  },
  plugins: [],
}