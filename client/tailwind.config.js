/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0E12',
        surface: '#1E1F24',
        primary: '#6366F1', // Indigo
        accent: '#F43F5E', // Rose
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
