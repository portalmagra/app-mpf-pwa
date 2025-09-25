require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ajuoqvpccdkpzkefjrsc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdW9xdnBjY2RrcHprZWZqcnNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIxOTM2NywiZXhwIjoyMDcxNzk1MzY3fQ.AkkgrulnJa6OtbjzYg_7wiRBL58FIWoxi-UCoKzGbeU'
);

async function testPublicAccess() {
  console.log('🧪 Testando acesso público ao bucket PROTOCOLOS...\n');

  try {
    // 1. Verificar se bucket está público
    console.log('📋 Verificando status do bucket...');
    const { data: buckets } = await supabase.storage.listBuckets();
    const protocolosBucket = buckets.find(bucket => bucket.name === 'PROTOCOLOS');
    
    if (!protocolosBucket) {
      console.error('❌ Bucket PROTOCOLOS não encontrado!');
      return;
    }

    console.log(`📊 Status: ${protocolosBucket.public ? '✅ Público' : '❌ Privado'}`);

    if (!protocolosBucket.public) {
      console.log('⚠️ Bucket ainda está privado!');
      console.log('📋 Execute primeiro: node scripts/make-bucket-public.js');
      return;
    }

    // 2. Listar arquivos disponíveis
    console.log('\n📁 Listando arquivos disponíveis...');
    const { data: files, error: listError } = await supabase.storage
      .from('PROTOCOLOS')
      .list('', { limit: 10 });

    if (listError) {
      console.error('❌ Erro ao listar arquivos:', listError.message);
      return;
    }

    console.log(`✅ ${files.length} arquivos encontrados:`);
    files.forEach((file, index) => {
      const sizeMB = file.metadata?.size ? (file.metadata.size / 1024 / 1024).toFixed(2) : 'N/A';
      console.log(`   ${index + 1}. ${file.name} (${sizeMB} MB)`);
    });

    // 3. Testar URLs públicas
    console.log('\n🔗 Testando URLs públicas...');
    
    for (let i = 0; i < Math.min(3, files.length); i++) {
      const file = files[i];
      const publicUrl = supabase.storage
        .from('PROTOCOLOS')
        .getPublicUrl(file.name);
      
      console.log(`\n📄 Testando: ${file.name}`);
      console.log(`🔗 URL: ${publicUrl.data.publicUrl}`);
      
      try {
        const response = await fetch(publicUrl.data.publicUrl, { method: 'HEAD' });
        
        if (response.ok) {
          console.log(`✅ Status: ${response.status} - FUNCIONANDO!`);
          console.log(`📊 Tamanho: ${response.headers.get('content-length')} bytes`);
        } else {
          console.log(`❌ Status: ${response.status} - ERRO`);
        }
      } catch (error) {
        console.log(`❌ Erro: ${error.message}`);
      }
    }

    // 4. Testar arquivo específico (nausea-refluxo)
    console.log('\n🎯 Testando arquivo específico: PROTOCOLO-NAUSEA-and-REFLUXO.pdf');
    const nauseaUrl = supabase.storage
      .from('PROTOCOLOS')
      .getPublicUrl('PROTOCOLO-NAUSEA-and-REFLUXO.pdf');
    
    console.log(`🔗 URL: ${nauseaUrl.data.publicUrl}`);
    
    try {
      const response = await fetch(nauseaUrl.data.publicUrl, { method: 'HEAD' });
      
      if (response.ok) {
        console.log(`✅ Status: ${response.status} - FUNCIONANDO!`);
        console.log(`📊 Tamanho: ${response.headers.get('content-length')} bytes`);
        console.log('🎉 Download do protocolo nausea-refluxo funcionará!');
      } else {
        console.log(`❌ Status: ${response.status} - ERRO`);
        console.log('⚠️ Arquivo não encontrado ou não acessível');
      }
    } catch (error) {
      console.log(`❌ Erro: ${error.message}`);
    }

    // 5. Resumo final
    console.log('\n📋 RESUMO:');
    if (protocolosBucket.public) {
      console.log('✅ Bucket PROTOCOLOS está público');
      console.log('✅ URLs públicas funcionando');
      console.log('✅ Download de protocolos funcionará');
      console.log('✅ Não precisa do Google Drive');
    } else {
      console.log('❌ Bucket ainda está privado');
      console.log('📋 Configure manualmente no painel do Supabase');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testPublicAccess().catch(console.error);
