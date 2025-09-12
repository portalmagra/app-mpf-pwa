const fs = require('fs');
const path = require('path');

// SVG base para os ícones
const iconSVG = `<svg width="SIZE" height="SIZE" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="512" rx="80" fill="#22c55e"/>
  
  <!-- Gradient overlay -->
  <rect width="512" height="512" rx="80" fill="url(#gradient)"/>
  
  <!-- Main icon - Heart with Brazil flag colors -->
  <g transform="translate(256, 256)">
    <!-- Heart shape -->
    <path d="M-60,-20 C-60,-50 -30,-70 0,-70 C30,-70 60,-50 60,-20 C60,10 0,50 0,50 C0,50 -60,10 -60,-20 Z" 
          fill="#ffffff" 
          stroke="#1f2937" 
          stroke-width="4"/>
    
    <!-- Brazil flag colors inside heart -->
    <circle cx="-20" cy="-30" r="8" fill="#009639"/>
    <circle cx="20" cy="-30" r="8" fill="#009639"/>
    <circle cx="0" cy="-10" r="8" fill="#009639"/>
    <circle cx="-20" cy="10" r="8" fill="#009639"/>
    <circle cx="20" cy="10" r="8" fill="#009639"/>
    
    <!-- Central diamond -->
    <path d="M-15,-5 L0,-20 L15,-5 L0,10 Z" fill="#ffdf00"/>
  </g>
  
  <!-- Text -->
  <text x="256" y="420" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="#ffffff">MPF</text>
  
  <!-- Gradient definition -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#22c55e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16a34a;stop-opacity:1" />
    </linearGradient>
  </defs>
</svg>`;

// Criar ícones em diferentes tamanhos
const sizes = [
  { size: 192, filename: 'icon-192.png' },
  { size: 512, filename: 'icon-512.png' },
  { size: 180, filename: 'apple-touch-icon.png' }
];

// Criar diretório public se não existir
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Gerar arquivos SVG temporários e instruções
sizes.forEach(({ size, filename }) => {
  const svgContent = iconSVG.replace(/SIZE/g, size);
  const svgPath = path.join(publicDir, filename.replace('.png', '.svg'));
  
  fs.writeFileSync(svgPath, svgContent);
  console.log(`✅ Criado ${filename.replace('.png', '.svg')} (${size}x${size})`);
});

console.log('\n📝 INSTRUÇÕES PARA CONVERTER SVG PARA PNG:');
console.log('1. Use um conversor online como: https://convertio.co/svg-png/');
console.log('2. Ou use o comando: npm install -g svg2png-cli');
console.log('3. Execute: svg2png public/icon-192.svg --output public/icon-192.png');
console.log('4. Execute: svg2png public/icon-512.svg --output public/icon-512.png');
console.log('5. Execute: svg2png public/apple-touch-icon.svg --output public/apple-touch-icon.png');
console.log('\n🎯 Ou use o GIMP/Photoshop para exportar os SVGs como PNG');
