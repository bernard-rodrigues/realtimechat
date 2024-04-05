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
        primary: "#75e8e7",
        secondary: "#F9F7F7",
        texture1: "#DBE2EF",
        texture2: "#3F72AF",
        texture3: "#112D4E"
      }
    },
  },
  plugins: [],
}