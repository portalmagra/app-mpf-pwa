const fs = require('fs');
const path = require('path');

// Criar um PNG simples usando base64 (ícone verde com "MPF")
const createSimplePNG = (size) => {
  // Este é um PNG simples de 1x1 pixel verde
  // Em produção, você deve usar um editor de imagem para criar ícones adequados
  const base64PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  
  return Buffer.from(base64PNG, 'base64');
};

// Criar diretório public se não existir
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Criar ícones PNG básicos
const sizes = [
  { size: 192, filename: 'icon-192.png' },
  { size: 512, filename: 'icon-512.png' },
  { size: 180, filename: 'apple-touch-icon.png' }
];

sizes.forEach(({ size, filename }) => {
  const pngData = createSimplePNG(size);
  const filePath = path.join(publicDir, filename);
  
  fs.writeFileSync(filePath, pngData);
  console.log(`✅ Criado ${filename} (${size}x${size})`);
});

console.log('\n📝 NOTA: Estes são ícones PNG básicos.');
console.log('Para ícones profissionais, substitua os arquivos por versões criadas em:');
console.log('- GIMP/Photoshop');
console.log('- Figma');
console.log('- Canva');
console.log('- Ou qualquer editor de imagem');
console.log('\n🎯 Os ícones devem ter:');
console.log('- Fundo verde (#22c55e)');
console.log('- Ícone de coração ou símbolo do MeuPortalFit');
console.log('- Texto "MPF"');
console.log('- Bordas arredondadas');
