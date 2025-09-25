require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis do Supabase não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para limpar produtos inválidos
async function cleanInvalidProducts() {
  console.log('🧹 Iniciando limpeza de produtos inválidos...\n');
  
  try {
    // Buscar todos os produtos
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('*');
    
    if (fetchError) {
      console.error('❌ Erro ao buscar produtos:', fetchError);
      return;
    }
    
    console.log(`📦 Total de produtos encontrados: ${products.length}`);
    
    // Identificar produtos inválidos
    const invalidProducts = products.filter(product => {
      // Produtos com URLs que não são da Amazon real
      if (product.amazon_url && !product.amazon_url.includes('amazon.com')) {
        return true;
      }
      
      // Produtos com nomes que são apenas códigos ASIN
      if (product.name && product.name.startsWith('Produto B')) {
        return true;
      }
      
      // Produtos sem informações básicas
      if (!product.name || product.name.trim() === '') {
        return true;
      }
      
      return false;
    });
    
    console.log(`❌ Produtos inválidos identificados: ${invalidProducts.length}`);
    
    if (invalidProducts.length === 0) {
      console.log('✅ Nenhum produto inválido encontrado!');
      return;
    }
    
    // Confirmar limpeza
    console.log('\n⚠️  PRODUTOS QUE SERÃO REMOVIDOS:');
    console.log('='.repeat(50));
    
    invalidProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Categoria: ${product.category_id}`);
      console.log(`   URL: ${product.amazon_url || 'N/A'}`);
      console.log('');
    });
    
    // Executar remoção
    console.log('🗑️  Removendo produtos inválidos...');
    
    const productIds = invalidProducts.map(p => p.id);
    
    // Remover em lotes para evitar timeout
    const batchSize = 50;
    let removedCount = 0;
    
    for (let i = 0; i < productIds.length; i += batchSize) {
      const batch = productIds.slice(i, i + batchSize);
      
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .in('id', batch);
      
      if (deleteError) {
        console.error(`❌ Erro ao remover lote ${Math.floor(i/batchSize) + 1}:`, deleteError);
      } else {
        removedCount += batch.length;
        console.log(`✅ Lote ${Math.floor(i/batchSize) + 1} removido: ${batch.length} produtos`);
      }
      
      // Pequena pausa entre lotes
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Verificar produtos restantes
    const { data: remainingProducts, error: remainingError } = await supabase
      .from('products')
      .select('*');
    
    if (remainingError) {
      console.error('❌ Erro ao verificar produtos restantes:', remainingError);
    } else {
      console.log(`\n📊 RESULTADO DA LIMPEZA:`);
      console.log('='.repeat(50));
      console.log(`Produtos removidos: ${removedCount}`);
      console.log(`Produtos restantes: ${remainingProducts.length}`);
      console.log(`Total original: ${products.length}`);
      
      const cleanupPercentage = ((removedCount / products.length) * 100).toFixed(1);
      console.log(`Taxa de limpeza: ${cleanupPercentage}%`);
      
      if (remainingProducts.length > 0) {
        console.log('\n✅ PRODUTOS RESTANTES:');
        remainingProducts.forEach((product, index) => {
          console.log(`${index + 1}. ${product.name}`);
          console.log(`   Categoria: ${product.category_id}`);
          console.log(`   URL: ${product.amazon_url || 'N/A'}`);
        });
      } else {
        console.log('\n🎉 Todos os produtos inválidos foram removidos!');
        console.log('💡 Agora você pode adicionar produtos válidos e funcionais.');
      }
    }
    
    // Salvar relatório de limpeza
    const fs = require('fs');
    const cleanupReport = {
      timestamp: new Date().toISOString(),
      originalCount: products.length,
      removedCount: removedCount,
      remainingCount: remainingProducts?.length || 0,
      removedProducts: invalidProducts.map(p => ({
        id: p.id,
        name: p.name,
        category_id: p.category_id,
        amazon_url: p.amazon_url
      })),
      remainingProducts: remainingProducts?.map(p => ({
        id: p.id,
        name: p.name,
        category_id: p.category_id,
        amazon_url: p.amazon_url
      })) || []
    };
    
    const reportPath = './product-cleanup-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(cleanupReport, null, 2));
    console.log(`\n📄 Relatório de limpeza salvo em: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
  }
}

// Executar limpeza
cleanInvalidProducts();
