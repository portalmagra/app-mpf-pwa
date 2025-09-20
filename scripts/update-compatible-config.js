const fs = require('fs');
const path = require('path');

// Função para atualizar manifest.json com versões PNG
function updateManifest() {
  const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Atualizar ícones para usar PNGs
  manifest.icons = [
    {
      "src": "/logo-final-completo-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/logo-final-completo-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/logo-final-solo-m-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/logo-final-solo-m-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    },
    // Manter SVG como fallback
    {
      "src": "/logo-final-completo.svg",
      "sizes": "400x400",
      "type": "image/svg+xml",
      "purpose": "any"
    },
    {
      "src": "/logo-final-solo-m.svg",
      "sizes": "400x400",
      "type": "image/svg+xml",
      "purpose": "maskable"
    }
  ];
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✅ Manifest.json atualizado com versões PNG');
}

// Função para atualizar layout.tsx com versões PNG
function updateLayout() {
  const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.tsx');
  let layout = fs.readFileSync(layoutPath, 'utf8');
  
  // Atualizar ícones no metadata
  layout = layout.replace(
    /icons: \{[^}]*\}/s,
    `icons: {
    icon: [
      { url: "/logo-final-completo-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-final-completo-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/logo-final-completo.svg", sizes: "400x400", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/logo-final-solo-m-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-final-solo-m.svg", sizes: "400x400", type: "image/svg+xml" }
    ]
  }`
  );
  
  // Atualizar OpenGraph images
  layout = layout.replace(
    /url: "\/logo-final-completo\.svg"/g,
    'url: "/logo-final-completo-512x512.png"'
  );
  
  // Atualizar Twitter images
  layout = layout.replace(
    /images: \["\/logo-final-completo\.svg"\]/g,
    'images: ["/logo-final-completo-512x512.png"]'
  );
  
  // Atualizar apple-touch-icon
  layout = layout.replace(
    /href="\/logo-final-solo-m\.svg"/g,
    'href="/logo-final-solo-m-192x192.png"'
  );
  
  // Atualizar favicon links
  layout = layout.replace(
    /href="\/logo-final-completo\.svg"/g,
    'href="/logo-final-completo-32x32.png"'
  );
  
  layout = layout.replace(
    /href="\/logo-final-solo-m\.svg"/g,
    'href="/logo-final-solo-m-32x32.png"'
  );
  
  fs.writeFileSync(layoutPath, layout);
  console.log('✅ Layout.tsx atualizado com versões PNG');
}

// Função para criar favicon.ico
function createFaviconInfo() {
  const faviconInfo = `
# Favicon.ico necessário

Para criar o favicon.ico, você precisa:

1. Usar o arquivo logo-final-solo-m-32x32.png
2. Converter para ICO usando:
   - Online: https://favicon.io/favicon-converter/
   - Ou usar ImageMagick: convert logo-final-solo-m-32x32.png favicon.ico

3. Salvar como favicon.ico na pasta public/

Arquivo necessário: favicon.ico (16x16, 32x32, 48x48)
  `;
  
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'FAVICON_INFO.txt'), faviconInfo);
  console.log('✅ Informações do favicon criadas');
}

// Função principal
function updateAllConfigs() {
  console.log('🔧 Atualizando configurações para máxima compatibilidade...\n');
  
  try {
    updateManifest();
    updateLayout();
    createFaviconInfo();
    
    console.log('\n✅ Configurações atualizadas!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Baixar os PNGs dos arquivos HTML gerados');
    console.log('2. Salvar na pasta public/');
    console.log('3. Criar favicon.ico');
    console.log('4. Testar em diferentes dispositivos');
    
    console.log('\n🎯 Compatibilidade garantida para:');
    console.log('• Android (PWA)');
    console.log('• iOS (PWA)');
    console.log('• Chrome/Edge (Favicon)');
    console.log('• Firefox (Favicon)');
    console.log('• Safari (Apple Touch Icon)');
    console.log('• Redes Sociais (OpenGraph)');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar configurações:', error);
  }
}

// Executar
updateAllConfigs();
