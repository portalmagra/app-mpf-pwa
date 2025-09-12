/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
        colors: {
          brand: {
            green: '#10b981',
            greenDark: '#059669',
            greenSoft: '#f0fdf4',
            blue: '#3b82f6',
            blueDark: '#1d4ed8',
            blueSoft: '#eff6ff',
            blueLight: '#60a5fa',
            purple: '#7c3aed',
            purpleDark: '#6d28d9',
            amber: '#f59e0b',
            amberDark: '#d97706',
            amberSoft: '#fef3c7',
            cream: '#f8fafc',
            text: '#1f2937',
            text2: '#6b7280',
            border: '#e5e7eb',
            success: '#10b981',
          },
        },
      borderRadius: { 
        xl2: '1.25rem' 
      },
      boxShadow: { 
        soft: '0 8px 24px rgba(0,0,0,0.06)' 
      },
    },
  },
  plugins: [],
}
