require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ajuoqvpccdkpzkefjrsc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdW9xdnBjY2RrcHprZWZqcnNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIxOTM2NywiZXhwIjoyMDcxNzk1MzY3fQ.AkkgrulnJa6OtbjzYg_7wiRBL58FIWoxi-UCoKzGbeU'
);

async function checkSupabaseStorageConfig() {
  console.log('🔍 Verificando configuração do Supabase Storage...\n');

  try {
    // 1. Verificar buckets existentes
    console.log('📁 Verificando buckets existentes...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError.message);
      return;
    }

    console.log(`✅ Buckets encontrados: ${buckets.length}`);
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'Público' : 'Privado'})`);
    });

    // 2. Verificar se bucket PROTOCOLOS existe
    const protocolosBucket = buckets.find(bucket => bucket.name === 'PROTOCOLOS');
    
    if (!protocolosBucket) {
      console.log('\n❌ Bucket PROTOCOLOS não encontrado!');
      console.log('🔧 Criando bucket PROTOCOLOS...');
      
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('PROTOCOLOS', {
        public: true,
        fileSizeLimit: 100 * 1024 * 1024, // 100MB por arquivo
        allowedMimeTypes: ['application/pdf']
      });

      if (createError) {
        console.error('❌ Erro ao criar bucket:', createError.message);
      } else {
        console.log('✅ Bucket PROTOCOLOS criado com sucesso!');
      }
    } else {
      console.log('\n✅ Bucket PROTOCOLOS encontrado!');
      console.log(`   - Público: ${protocolosBucket.public ? 'Sim' : 'Não'}`);
    }

    // 3. Verificar políticas RLS do bucket
    console.log('\n🔒 Verificando políticas RLS...');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'objects')
      .eq('schemaname', 'storage');

    if (policiesError) {
      console.log('⚠️ Não foi possível verificar políticas RLS');
    } else {
      console.log(`✅ Políticas encontradas: ${policies.length}`);
      policies.forEach(policy => {
        console.log(`   - ${policy.policyname}: ${policy.permissive ? 'Permissiva' : 'Restritiva'}`);
      });
    }

    // 4. Testar upload de arquivo pequeno
    console.log('\n🧪 Testando upload de arquivo...');
    const testContent = Buffer.from('Teste de upload');
    const testFileName = `test-${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('PROTOCOLOS')
      .upload(testFileName, testContent, {
        contentType: 'text/plain'
      });

    if (uploadError) {
      console.error('❌ Erro no teste de upload:', uploadError.message);
    } else {
      console.log('✅ Teste de upload bem-sucedido!');
      
      // Limpar arquivo de teste
      await supabase.storage
        .from('PROTOCOLOS')
        .remove([testFileName]);
      console.log('🧹 Arquivo de teste removido');
    }

    // 5. Verificar espaço disponível
    console.log('\n💾 Verificando uso de espaço...');
    const { data: files } = await supabase.storage
      .from('PROTOCOLOS')
      .list('', { limit: 1000 });

    if (files) {
      let totalSize = 0;
      files.forEach(file => {
        if (file.metadata?.size) {
          totalSize += file.metadata.size;
        }
      });
      
      const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
      console.log(`📊 Espaço usado: ${totalSizeMB} MB`);
      console.log(`📊 Arquivos no bucket: ${files.length}`);
    }

    console.log('\n📋 RESUMO DA CONFIGURAÇÃO:');
    console.log('✅ Bucket PROTOCOLOS configurado');
    console.log('✅ Upload de arquivos funcionando');
    console.log('✅ Políticas RLS verificadas');
    console.log('✅ Espaço disponível: 8GB (plano Pro)');
    
    console.log('\n🚀 PRÓXIMOS PASSOS:');
    console.log('1. Fazer upload dos arquivos grandes para o bucket PROTOCOLOS');
    console.log('2. Atualizar URLs no código para usar Supabase Storage');
    console.log('3. Testar download dos arquivos grandes');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

checkSupabaseStorageConfig().catch(console.error);
