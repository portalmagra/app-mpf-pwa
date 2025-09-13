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
            // Verde principal - cor vibrante da imagem
            green: '#438951',
            greenDark: '#2d5a35',
            greenLight: '#6B8E6B',
            greenSoft: '#E8F5E8',
            
            // Tons neutros da imagem
            neutral: '#F5F3F0',
            neutralDark: '#E8E5E0',
            neutralLight: '#F8F9FA',
            
            // Cinzas suaves da imagem
            gray: '#6B8E6B',
            grayLight: '#9CA3AF',
            grayDark: '#495057',
            graySoft: '#F8F9FA',
            
            // Cores neutras para textos
            text: '#212529',
            text2: '#6B8E6B',
            textLight: '#9CA3AF',
            border: '#E8F5E8',
            borderLight: '#F5F3F0',
            
            // Cores de status harmoniosas
            success: '#438951',
            warning: '#6B8E6B',
            error: '#dc3545',
            info: '#6B8E6B',
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
