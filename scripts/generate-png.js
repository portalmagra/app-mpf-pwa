const puppeteer = require('puppeteer');
const path = require('path');

async function createWhatsAppPNG() {
  console.log('🚀 Iniciando criação da imagem PNG...');
  
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Configurar viewport para 400x300px
    await page.setViewport({
      width: 400,
      height: 300,
      deviceScaleFactor: 2 // Para melhor qualidade
    });
    
    // Carregar o arquivo HTML local
    const htmlPath = path.join(__dirname, '../public/whatsapp-preview.html');
    const fileUrl = `file://${htmlPath}`;
    
    console.log('📄 Carregando HTML:', fileUrl);
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    
    // Aguardar um pouco para garantir que tudo carregou
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Tirar screenshot
    const outputPath = path.join(__dirname, '../public/whatsapp-preview.png');
    console.log('📸 Tirando screenshot...');
    
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false,
      omitBackground: false
    });
    
    await browser.close();
    
    console.log('✅ PNG criado com sucesso!');
    console.log('📁 Arquivo:', outputPath);
    console.log('🌐 URL: https://app.meuportalfit.com/whatsapp-preview.png');
    
    // Verificar tamanho do arquivo
    const fs = require('fs');
    const stats = fs.statSync(outputPath);
    const fileSizeInKB = Math.round(stats.size / 1024);
    
    console.log(`📊 Tamanho: ${fileSizeInKB}KB`);
    
    if (fileSizeInKB > 300) {
      console.log('⚠️  Arquivo maior que 300KB. Pode precisar otimizar.');
    } else {
      console.log('✅ Tamanho OK para WhatsApp!');
    }
    
  } catch (error) {
    console.error('❌ Erro ao criar PNG:', error);
  }
}

createWhatsAppPNG();
