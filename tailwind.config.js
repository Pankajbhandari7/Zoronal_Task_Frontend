/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6', // purple-500 equivalent
        'primary-hover': '#7c3aed', // purple-600 equivalent
        'gray-dark': '#333333',
        'gray-light': '#f9fafb',
        'border-color': '#e5e7eb',
        'text-main': '#111827',
        'text-muted': '#6b7280',
        'star-color': '#fbbf24',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
