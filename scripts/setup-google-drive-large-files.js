require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ajuoqvpccdkpzkefjrsc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdW9xdnBjY2RrcHprZWZqcnNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIxOTM2NywiZXhwIjoyMDcxNzk1MzY3fQ.AkkgrulnJa6OtbjzYg_7wiRBL58FIWoxi-UCoKzGbeU'
);

// Arquivos que precisam ser movidos para Google Drive devido ao limite de 50MB
const filesToMoveToDrive = [
  {
    id: 'intestino-livre',
    name: 'Protocolo Intestino Livre',
    fileName: 'PROTOCOLO-INTESTINO-LIVRE.pdf',
    // URL do Google Drive (você precisa fornecer)
    driveUrl: 'https://drive.google.com/file/d/SEU_ID_DO_DRIVE_AQUI/view?usp=sharing'
  },
  {
    id: 'pacote-completo',
    name: 'Pacote Completo - Todos os Protocolos',
    fileName: 'PACOTE-COMPLETO-TODOS-PROTOCOLOS.pdf',
    // URL do Google Drive (você precisa fornecer)
    driveUrl: 'https://drive.google.com/file/d/SEU_ID_DO_DRIVE_AQUI/view?usp=sharing'
  }
];

async function updateProtocolUrls() {
  console.log('🔄 Atualizando URLs para usar Google Drive...\n');

  for (const file of filesToMoveToDrive) {
    try {
      console.log(`📋 Processando: ${file.name}`);
      
      // Converter URL do Google Drive para download direto
      const directDownloadUrl = convertDriveUrlToDirect(file.driveUrl);
      
      if (!directDownloadUrl) {
        console.log(`❌ URL do Google Drive inválida para: ${file.name}`);
        continue;
      }

      console.log(`✅ URL convertida: ${directDownloadUrl}`);
      
      // Aqui você pode atualizar o endpoint de download para usar esta URL
      console.log(`📝 Para ${file.id}, usar URL: ${directDownloadUrl}`);
      
    } catch (error) {
      console.error(`❌ Erro ao processar ${file.name}:`, error.message);
    }
  }

  console.log('\n📋 INSTRUÇÕES:');
  console.log('1. Faça upload dos arquivos grandes para o Google Drive');
  console.log('2. Configure as permissões como "Qualquer pessoa com o link pode ver"');
  console.log('3. Copie o link de compartilhamento');
  console.log('4. Execute este script novamente com as URLs corretas');
  console.log('5. O sistema irá usar Google Drive para arquivos > 50MB');
}

function convertDriveUrlToDirect(shareUrl) {
  // Extrair ID do arquivo do Google Drive
  const match = shareUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  
  if (!match) {
    return null;
  }
  
  const fileId = match[1];
  
  // Converter para URL de download direto
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// Função para testar se a URL funciona
async function testDriveUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

updateProtocolUrls().catch(console.error);
