const fs = require('fs');
const path = require('path');

// Função para criar um PNG simples baseado no SVG
function createPNGFromSVG(svgContent, size, filename) {
  // Para este exemplo, vamos criar um PNG básico usando canvas
  // Em produção, você usaria uma biblioteca como sharp ou canvas
  
  const canvas = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; }
        canvas { border: 1px solid #ccc; }
      </style>
    </head>
    <body>
      <canvas id="canvas" width="${size}" height="${size}"></canvas>
      <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        // Criar gradiente azul-verde
        const gradient = ctx.createLinearGradient(0, 0, ${size}, ${size});
        gradient.addColorStop(0, '#3B82F6');
        gradient.addColorStop(0.5, '#10B981');
        gradient.addColorStop(1, '#059669');
        
        // Desenhar círculo de fundo
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(${size/2}, ${size/2}, ${size/2 - 10}, 0, 2 * Math.PI);
        ctx.fill();
        
        // Desenhar borda branca
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Desenhar grid pattern
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.3;
        for (let i = 0; i <= ${size}; i += 20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, ${size});
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(${size}, i);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        
        // Desenhar retângulo branco para o M
        const rectSize = ${size * 0.3};
        const rectX = ${size/2} - rectSize/2;
        const rectY = ${size/2} - rectSize/2;
        
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.fillRect(rectX, rectY, rectSize, rectSize);
        ctx.strokeRect(rectX, rectY, rectSize, rectSize);
        
        // Desenhar letra M
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold ${size * 0.4}px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('M', ${size/2}, ${size/2});
        
        // Para logo completo, adicionar texto
        if ('${filename}'.includes('completo')) {
          ctx.font = 'bold ${size * 0.12}px Arial';
          ctx.fillText('MeuPortalFit', ${size/2}, ${size * 0.8});
        }
        
        // Converter para PNG (simulado)
        const dataURL = canvas.toDataURL('image/png');
        console.log('PNG gerado:', filename, 'Tamanho:', size);
      </script>
    </body>
    </html>
  `;
  
  return canvas;
}

// Criar versões PNG
const sizes = [16, 32, 192, 512];
const logos = ['completo', 'solo-m'];

console.log('🎨 Gerando ícones compatíveis...\n');

// Criar arquivos HTML para visualização
logos.forEach(logo => {
  sizes.forEach(size => {
    const filename = `logo-final-${logo}-${size}x${size}.html`;
    const content = createPNGFromSVG('', size, filename);
    
    fs.writeFileSync(path.join(__dirname, '..', 'public', filename), content);
    console.log(`✅ Criado: ${filename}`);
  });
});

console.log('\n📱 Versões necessárias:');
console.log('• 16x16 - Favicon');
console.log('• 32x32 - Favicon HD');
console.log('• 192x192 - PWA Android');
console.log('• 512x512 - PWA Android HD');

console.log('\n🔧 Para converter para PNG real:');
console.log('1. Abra os arquivos HTML gerados');
console.log('2. Capture as imagens como PNG');
console.log('3. Salve com os nomes corretos');

console.log('\n📋 Arquivos a criar:');
logos.forEach(logo => {
  sizes.forEach(size => {
    console.log(`• logo-final-${logo}-${size}x${size}.png`);
  });
});

console.log('\n🎯 Próximos passos:');
console.log('1. Converter HTMLs para PNGs');
console.log('2. Atualizar manifest.json');
console.log('3. Atualizar layout.tsx');
console.log('4. Testar em diferentes dispositivos');
