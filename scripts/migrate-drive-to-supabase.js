require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

const supabase = createClient(
  'https://ajuoqvpccdkpzkefjrsc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdW9xdnBjY2RrcHprZWZqcnNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIxOTM2NywiZXhwIjoyMDcxNzk1MzY3fQ.AkkgrulnJa6OtbjzYg_7wiRBL58FIWoxi-UCoKzGbeU'
);

async function migrateDriveToSupabase() {
  console.log('🔄 Migrando PDFs do Google Drive para Supabase Storage...\n');
  
  try {
    // Buscar eBooks que ainda estão no Google Drive
    const { data: ebooks, error } = await supabase
      .from('ebooks')
      .select('*')
      .eq('status', 'active')
      .like('pdf_link', '%drive.google.com%');
    
    if (error) throw error;
    
    console.log(`📚 Encontrados ${ebooks.length} eBooks no Google Drive para migrar`);
    
    for (const ebook of ebooks) {
      console.log(`\n🔍 Processando: ${ebook.title}`);
      
      try {
        // Converter link do Google Drive para link direto de download
        const driveId = extractDriveId(ebook.pdf_link);
        if (!driveId) {
          console.log(`❌ Não foi possível extrair ID do Google Drive: ${ebook.pdf_link}`);
          continue;
        }
        
        const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
        
        // Fazer download do arquivo
        console.log(`📥 Fazendo download de: ${ebook.title}`);
        const buffer = await downloadFile(directDownloadUrl);
        
        if (!buffer) {
          console.log(`❌ Erro ao fazer download do arquivo`);
          continue;
        }
        
        // Criar nome do arquivo
        const fileName = `${ebook.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        
        // Upload para Supabase Storage
        console.log(`📤 Fazendo upload para Supabase Storage: ${fileName}`);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('ebooks')
          .upload(fileName, buffer, {
            contentType: 'application/pdf',
            upsert: true
          });
        
        if (uploadError) {
          console.log(`❌ Erro no upload: ${uploadError.message}`);
          continue;
        }
        
        // Gerar URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('ebooks')
          .getPublicUrl(fileName);
        
        // Atualizar registro no banco
        const { error: updateError } = await supabase
          .from('ebooks')
          .update({ 
            pdf_link: publicUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', ebook.id);
        
        if (updateError) {
          console.log(`❌ Erro ao atualizar registro: ${updateError.message}`);
          continue;
        }
        
        console.log(`✅ ${ebook.title}: Migrado com sucesso!`);
        console.log(`   📁 Nova URL: ${publicUrl}`);
        
      } catch (error) {
        console.log(`❌ Erro ao processar ${ebook.title}: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Migração concluída!');
    
    // Verificar resultado final
    const { data: finalEbooks, error: finalError } = await supabase
      .from('ebooks')
      .select('*')
      .eq('status', 'active');
    
    if (finalError) throw finalError;
    
    console.log('\n📋 Status final dos eBooks:');
    finalEbooks.forEach(ebook => {
      const isSupabaseLink = ebook.pdf_link.includes('supabase.co');
      console.log(`${isSupabaseLink ? '📁' : '🔗'} ${ebook.title}: ${isSupabaseLink ? 'Supabase Storage' : 'Google Drive'}`);
    });
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

function extractDriveId(url) {
  // Extrair ID do Google Drive de diferentes formatos de URL
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

migrateDriveToSupabase().catch(console.error);
