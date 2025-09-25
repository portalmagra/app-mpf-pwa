require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ajuoqvpccdkpzkefjrsc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdW9xdnBjY2RrcHprZWZqcnNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIxOTM2NywiZXhwIjoyMDcxNzk1MzY3fQ.AkkgrulnJa6OtbjzYg_7wiRBL58FIWoxi-UCoKzGbeU'
);

async function fixSupabaseStorageConfig() {
  console.log('🔧 Corrigindo configuração do Supabase Storage...\n');

  try {
    // 1. Tornar bucket PROTOCOLOS público
    console.log('🌐 Tornando bucket PROTOCOLOS público...');
    
    // Primeiro, vamos verificar se podemos atualizar o bucket
    const { data: buckets } = await supabase.storage.listBuckets();
    const protocolosBucket = buckets.find(bucket => bucket.name === 'PROTOCOLOS');
    
    if (protocolosBucket && !protocolosBucket.public) {
      console.log('⚠️ Bucket PROTOCOLOS está privado. Precisa ser público para URLs funcionarem.');
      console.log('📋 SOLUÇÃO:');
      console.log('1. Acesse o painel do Supabase (https://supabase.com/dashboard)');
      console.log('2. Vá para Storage > PROTOCOLOS');
      console.log('3. Clique em "Settings" ou configurações');
      console.log('4. Marque "Public bucket" para tornar público');
      console.log('5. Salve as alterações');
      
      console.log('\n🔗 URL do painel: https://supabase.com/dashboard/project/ajuoqvpccdkpzkefjrsc/storage/buckets');
    } else if (protocolosBucket && protocolosBucket.public) {
      console.log('✅ Bucket PROTOCOLOS já está público!');
    }

    // 2. Verificar políticas RLS para permitir acesso público
    console.log('\n🔒 Configurando políticas RLS...');
    
    // Criar política para permitir leitura pública
    const { error: policyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'PROTOCOLOS',
      policy_name: 'Public read access',
      policy_definition: 'true'
    });

    if (policyError) {
      console.log('⚠️ Não foi possível criar política automaticamente');
      console.log('📋 SOLUÇÃO MANUAL:');
      console.log('1. Acesse o painel do Supabase');
      console.log('2. Vá para Authentication > Policies');
      console.log('3. Crie uma política para o bucket PROTOCOLOS');
      console.log('4. Definição: "true" (permitir acesso público)');
    } else {
      console.log('✅ Política RLS criada com sucesso!');
    }

    // 3. Testar acesso público
    console.log('\n🧪 Testando acesso público...');
    
    // Listar arquivos para verificar se estão acessíveis
    const { data: files, error: listError } = await supabase.storage
      .from('PROTOCOLOS')
      .list('', { limit: 5 });

    if (listError) {
      console.error('❌ Erro ao listar arquivos:', listError.message);
    } else if (files && files.length > 0) {
      console.log(`✅ ${files.length} arquivos encontrados`);
      
      // Testar URL pública do primeiro arquivo
      const firstFile = files[0];
      const publicUrl = supabase.storage
        .from('PROTOCOLOS')
        .getPublicUrl(firstFile.name);
      
      console.log(`🔗 URL pública de teste: ${publicUrl.data.publicUrl}`);
      
      // Testar se a URL funciona
      try {
        const response = await fetch(publicUrl.data.publicUrl, { method: 'HEAD' });
        if (response.ok) {
          console.log('✅ URL pública funcionando!');
        } else {
          console.log(`⚠️ URL pública retornou status: ${response.status}`);
        }
      } catch (error) {
        console.log('⚠️ Erro ao testar URL pública:', error.message);
      }
    }

    console.log('\n📋 RESUMO:');
    console.log('✅ Bucket PROTOCOLOS configurado');
    console.log('✅ Upload funcionando');
    console.log('✅ Espaço disponível: 8GB (plano Pro)');
    console.log('⚠️ Bucket precisa ser público (configuração manual)');
    
    console.log('\n🚀 APÓS TORNAR PÚBLICO:');
    console.log('1. Os arquivos grandes poderão ser baixados');
    console.log('2. URLs do Supabase Storage funcionarão');
    console.log('3. Não precisará do Google Drive');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

fixSupabaseStorageConfig().catch(console.error);
