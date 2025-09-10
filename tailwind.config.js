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
          green: '#1B6B57',
          greenDark: '#155E4D',
          greenSoft: '#EAF5EF',
          amber: '#F59E0B',
          amberSoft: '#FEF3C7',
          cream: '#FBF7F1',
          text: '#1F2937',
          text2: '#6B7280',
          border: '#E5E7EB',
          success: '#16A34A',
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
