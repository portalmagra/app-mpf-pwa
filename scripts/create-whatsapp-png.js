/**
 * Script para criar imagem PNG otimizada para WhatsApp
 * WhatsApp não suporta SVG, precisa ser PNG/JPG
 */

const fs = require('fs');
const path = require('path');

// Criar uma imagem simples em HTML que pode ser convertida para PNG
const createWhatsAppImageHTML = () => {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 400px;
            height: 300px;
            background: linear-gradient(135deg, #3B82F6 0%, #10B981 50%, #059669 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            color: white;
            border-radius: 20px;
            overflow: hidden;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .logo-text {
            font-size: 32px;
            font-weight: bold;
            color: #059669;
        }
        
        .title {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 8px;
        }
        
        .subtitle {
            font-size: 14px;
            opacity: 0.9;
            text-align: center;
            margin-bottom: 20px;
        }
        
        .features {
            font-size: 12px;
            opacity: 0.8;
            text-align: center;
            margin-bottom: 15px;
        }
        
        .whatsapp {
            font-size: 12px;
            opacity: 0.8;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="logo">
        <div class="logo-text">M</div>
    </div>
    
    <div class="title">MeuPortalFit</div>
    <div class="subtitle">Brasileiros nos EUA</div>
    
    <div class="features">🇧🇷 Wellness • 📚 eBooks • 🍽️ Receitas • 👩‍⚕️ Coach</div>
    
    <div class="whatsapp">💬 WhatsApp: (786) 253-5032</div>
</body>
</html>`;

  const outputPath = path.join(__dirname, '../public/whatsapp-preview.html');
  fs.writeFileSync(outputPath, htmlContent);
  
  console.log('✅ Imagem HTML criada:', outputPath);
  console.log('📱 Para converter para PNG:');
  console.log('1. Abra o arquivo HTML no navegador');
  console.log('2. Tire um screenshot de 400x300px');
  console.log('3. Salve como PNG');
  console.log('4. Otimize para < 300KB');
  console.log('5. Renomeie para: whatsapp-preview.png');
  console.log('6. Atualize as meta tags para usar a URL PNG');
};

createWhatsAppImageHTML();
