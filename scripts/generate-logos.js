const fs = require('fs');
const path = require('path');

// Função para converter SVG para PNG usando canvas (Node.js)
function generateLogoVariants() {
  const logos = [
    {
      name: 'portal-fit-logo-3a',
      description: 'Logo brasileiro completo - Verde escuro + Amarelo clássico',
      sizes: [192, 512, 1024]
    },
    {
      name: 'portal-fit-logo-2a', 
      description: 'Logo portal círculos - Verde escuro + Amarelo clássico',
      sizes: [192, 512, 1024]
    },
    {
      name: 'portal-fit-logo-simple',
      description: 'Logo simplificado para uso interno',
      sizes: [192, 512]
    }
  ];

  console.log('🎨 Logos disponíveis para padronização da marca:');
  console.log('================================================');
  
  logos.forEach(logo => {
    console.log(`\n📱 ${logo.name}`);
    console.log(`   Descrição: ${logo.description}`);
    console.log(`   Tamanhos: ${logo.sizes.join('x')}px`);
    console.log(`   Arquivo: /icons/${logo.name}.svg`);
    
    logo.sizes.forEach(size => {
      console.log(`   - ${size}x${size}: /icons/${logo.name}-${size}.svg`);
    });
  });

  console.log('\n🚀 Para usar em outros projetos:');
  console.log('1. Copie os arquivos SVG da pasta /public/icons/');
  console.log('2. Use o logo-3a para materiais externos (identidade brasileira forte)');
  console.log('3. Use o logo-simple para elementos internos (minimalista)');
  console.log('4. Cores principais: Verde #059669, Amarelo #FFDF00');
}

generateLogoVariants();
