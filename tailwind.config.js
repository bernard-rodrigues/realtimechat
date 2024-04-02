/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx", "./index.html"],
  theme: {
    screens: {
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: "#caff42",
        secondary: "#ebf7f8",
        texture1: "#d0e0eb",
        texture2: "#88abc2",
        texture3: "#49708a"
      }
    },
  },
  plugins: [],
}

