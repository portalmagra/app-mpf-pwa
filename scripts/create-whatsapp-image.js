/**
 * Script para criar imagem otimizada para WhatsApp
 * WhatsApp recomenda imagens de pelo menos 300x200px e máximo 300KB
 */

const fs = require('fs');
const path = require('path');

// Criar uma imagem simples em SVG que será convertida para PNG
const createWhatsAppImage = () => {
  const svgContent = `
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#10B981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="300" fill="url(#bgGradient)" rx="20"/>
  
  <!-- Logo -->
  <circle cx="200" cy="120" r="40" fill="white" opacity="0.9"/>
  <text x="200" y="130" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#059669">M</text>
  
  <!-- Texto principal -->
  <text x="200" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white">MeuPortalFit</text>
  <text x="200" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="white" opacity="0.9">Brasileiros nos EUA</text>
  
  <!-- Subtítulo -->
  <text x="200" y="230" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="white" opacity="0.8">🇧🇷 Wellness • 📚 eBooks • 🍽️ Receitas • 👩‍⚕️ Coach</text>
  
  <!-- WhatsApp -->
  <text x="200" y="260" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="white" opacity="0.8">💬 WhatsApp: (786) 253-5032</text>
</svg>`;

  const outputPath = path.join(__dirname, '../public/whatsapp-preview.svg');
  fs.writeFileSync(outputPath, svgContent);
  
  console.log('✅ Imagem SVG criada:', outputPath);
  console.log('📱 Para usar no WhatsApp:');
  console.log('1. Converta para PNG (300x200px)');
  console.log('2. Otimize para < 300KB');
  console.log('3. Use URL absoluta: https://app.meuportalfit.com/whatsapp-preview.png');
};

createWhatsAppImage();
