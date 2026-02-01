/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1F4A3D',
        secondary: '#2D6A52',
        accent: '#E8B887',
        light: '#F5F5F5',
        dark: '#1A1A1A',
      }
    },
  },
  plugins: [],
}
