require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ajuoqvpccdkpzkefjrsc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdW9xdnBjY2RrcHprZWZqcnNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIxOTM2NywiZXhwIjoyMDcxNzk1MzY3fQ.AkkgrulnJa6OtbjzYg_7wiRBL58FIWoxi-UCoKzGbeU'
);

async function makeBucketPublic() {
  console.log('🔧 Tornando bucket PROTOCOLOS público...\n');

  try {
    // 1. Verificar status atual do bucket
    console.log('📋 Verificando status atual...');
    const { data: buckets } = await supabase.storage.listBuckets();
    const protocolosBucket = buckets.find(bucket => bucket.name === 'PROTOCOLOS');
    
    if (!protocolosBucket) {
      console.error('❌ Bucket PROTOCOLOS não encontrado!');
      return;
    }

    console.log(`📊 Status atual: ${protocolosBucket.public ? 'Público' : 'Privado'}`);

    if (protocolosBucket.public) {
      console.log('✅ Bucket já está público!');
      return;
    }

    // 2. Tentar tornar público via API (pode não funcionar com todas as versões)
    console.log('🔧 Tentando tornar público via API...');
    
    // Nota: A API do Supabase pode não permitir alterar bucket de privado para público
    // Vamos tentar, mas provavelmente precisará ser feito manualmente
    
    try {
      // Esta operação pode não estar disponível na API atual
      const { error } = await supabase.storage.updateBucket('PROTOCOLOS', {
        public: true
      });

      if (error) {
        console.log('⚠️ Não foi possível alterar via API:', error.message);
        console.log('📋 SOLUÇÃO MANUAL NECESSÁRIA:');
        console.log('');
        console.log('🔗 Acesse: https://supabase.com/dashboard/project/ajuoqvpccdkpzkefjrsc/storage/buckets');
        console.log('');
        console.log('📝 PASSOS:');
        console.log('1. Clique no bucket "PROTOCOLOS"');
        console.log('2. Clique em "Settings" (Configurações)');
        console.log('3. Marque "Public bucket"');
        console.log('4. Clique em "Save" (Salvar)');
        console.log('');
        console.log('✅ Após isso, todos os arquivos ficarão públicos!');
      } else {
        console.log('✅ Bucket tornado público com sucesso!');
      }
    } catch (apiError) {
      console.log('⚠️ API não suporta alteração de bucket:', apiError.message);
      console.log('📋 SOLUÇÃO MANUAL NECESSÁRIA:');
      console.log('');
      console.log('🔗 Acesse: https://supabase.com/dashboard/project/ajuoqvpccdkpzkefjrsc/storage/buckets');
      console.log('');
      console.log('📝 PASSOS:');
      console.log('1. Clique no bucket "PROTOCOLOS"');
      console.log('2. Clique em "Settings" (Configurações)');
      console.log('3. Marque "Public bucket"');
      console.log('4. Clique em "Save" (Salvar)');
      console.log('');
      console.log('✅ Após isso, todos os arquivos ficarão públicos!');
    }

    // 3. Verificar se há políticas RLS que precisam ser ajustadas
    console.log('\n🔒 Verificando políticas RLS...');
    
    // Tentar criar política pública se não existir
    const { error: policyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'PROTOCOLOS',
      policy_name: 'Public read access',
      policy_definition: 'true'
    });

    if (policyError) {
      console.log('⚠️ Política RLS precisa ser configurada manualmente');
      console.log('📝 POLÍTICA NECESSÁRIA:');
      console.log('- Tabela: storage.objects');
      console.log('- Operação: SELECT');
      console.log('- Definição: bucket_id = \'PROTOCOLOS\'');
      console.log('- Público: true');
    } else {
      console.log('✅ Política RLS criada automaticamente!');
    }

    // 4. Testar após configuração manual
    console.log('\n🧪 Após tornar público, teste com:');
    console.log('node scripts/test-public-access.js');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

makeBucketPublic().catch(console.error);
