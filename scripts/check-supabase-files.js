require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ajuoqvpccdkpzkefjrsc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdW9xdnBjY2RrcHprZWZqcnNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIxOTM2NywiZXhwIjoyMDcxNzk1MzY3fQ.AkkgrulnJa6OtbjzYg_7wiRBL58FIWoxi-UCoKzGbeU'
);

// Lista de arquivos PDF esperados
const expectedFiles = [
  'PROTOCOLO SUPORTE COM AS CANETAS EMAGRECEDORAS.pdf',
  'PROTOCOLO-PRE-CANETA.pdf',
  'PROTOCOLO-POS-CANETA-MANUTENCAO.pdf',
  'PROTOCOLO-PROTEINA-and-MASSA-MAGRA.pdf',
  'PROTOCOLO-INTESTINO-LIVRE.pdf',
  'PROTOCOLO-NAUSEA-and-REFLUXO.pdf',
  'PROTOCOLO-ENERGIA-E-IMUNIDADE.pdf',
  'PROTOCOLO-IMUNIDADE-AVANCADA.pdf',
  'PROTOCOLO-DETOX-LEVE.pdf',
  'PROTOCOLO-ANTI-INFLAMATORIO.pdf',
  'PROTOCOLO-MULHERES-40.pdf',
  'PROTOCOLO-PELE-CABELO-and-UNHAS.pdf',
  'PROTOCOLO-SONO-and-ANSIEDADE (2).pdf',
  'PROTOCOLO-FITNESS-and-PERFORMANCE.pdf',
  'PROTOCOLO ALTERNATIVA SEM CANETA.pdf',
  'PACOTE-COMPLETO-TODOS-PROTOCOLOS.pdf'
];

async function checkSupabaseFiles() {
  console.log('🔍 Verificando arquivos PDF no Supabase Storage...\n');

  try {
    // Listar todos os arquivos no bucket PROTOCOLOS
    const { data: files, error } = await supabase.storage
      .from('PROTOCOLOS')
      .list('', {
        limit: 100,
        offset: 0
      });

    if (error) {
      console.error('❌ Erro ao listar arquivos:', error.message);
      return;
    }

    console.log(`📁 Total de arquivos encontrados: ${files.length}\n`);

    // Verificar cada arquivo esperado
    const foundFiles = [];
    const missingFiles = [];

    for (const expectedFile of expectedFiles) {
      const found = files.find(file => file.name === expectedFile);
      
      if (found) {
        foundFiles.push(expectedFile);
        console.log(`✅ ${expectedFile} - ${(found.metadata?.size / 1024 / 1024).toFixed(2)} MB`);
      } else {
        missingFiles.push(expectedFile);
        console.log(`❌ ${expectedFile} - ARQUIVO NÃO ENCONTRADO`);
      }
    }

    console.log('\n📊 RESUMO:');
    console.log(`✅ Arquivos encontrados: ${foundFiles.length}`);
    console.log(`❌ Arquivos faltando: ${missingFiles.length}`);

    if (missingFiles.length > 0) {
      console.log('\n🚨 ARQUIVOS FALTANDO:');
      missingFiles.forEach(file => console.log(`   - ${file}`));
    }

    // Verificar arquivos extras
    const extraFiles = files.filter(file => 
      !expectedFiles.includes(file.name) && 
      file.name.endsWith('.pdf')
    );

    if (extraFiles.length > 0) {
      console.log('\n📋 ARQUIVOS EXTRAS ENCONTRADOS:');
      extraFiles.forEach(file => console.log(`   - ${file.name}`));
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

checkSupabaseFiles().catch(console.error);
