require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function restoreOriginalProducts() {
  console.log('🔄 Iniciando restauração dos produtos originais...');

  try {
    // Ler o relatório de limpeza
    const cleanupReport = JSON.parse(fs.readFileSync('./product-cleanup-report.json', 'utf8'));
    
    console.log(`📊 Produtos originais encontrados: ${cleanupReport.removedProducts.length}`);
    console.log(`📊 Produtos removidos: ${cleanupReport.removedCount}`);
    console.log(`📊 Produtos que permaneceram: ${cleanupReport.remainingCount}`);

    let restoredCount = 0;
    let errorCount = 0;

    // Restaurar cada produto removido
    for (let i = 0; i < cleanupReport.removedProducts.length; i++) {
      const product = cleanupReport.removedProducts[i];
      
      try {
        // Gerar dados do produto para inserção
        const productData = {
          id: product.id,
          name: product.name,
          description: `Produto restaurado: ${product.name}`,
          category_id: product.category_id,
          slug: product.name.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') + `-${Date.now()}`,
          amazon_url: product.amazon_url,
          current_price: '0.00', // Preço padrão
          image_url: '', // Sem imagem por enquanto
          benefits: ['Produto restaurado'],
          features: ['Restaurado do backup'],
          is_mentoria: false,
          is_curated: false, // Marcar como não curado para diferenciar
          quiz_keywords: [],
          priority_score: 50,
          created_at: new Date().toISOString()
        };

        console.log(`  🔄 Restaurando: ${product.name}`);

        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();

        if (error) {
          console.error(`    ❌ Erro ao restaurar ${product.name}:`, error.message);
          errorCount++;
        } else {
          console.log(`    ✅ Restaurado com sucesso: ${product.name}`);
          restoredCount++;
        }

        // Pequena pausa para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`    ❌ Erro inesperado ao restaurar ${product.name}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 RESULTADO DA RESTAURAÇÃO:');
    console.log('==================================================');
    console.log(`✅ Produtos restaurados: ${restoredCount}`);
    console.log(`❌ Erros encontrados: ${errorCount}`);
    console.log(`📈 Taxa de sucesso: ${((restoredCount / (restoredCount + errorCount)) * 100).toFixed(1)}%`);

    if (restoredCount > 0) {
      console.log('\n🎉 Produtos originais restaurados com sucesso!');
      console.log('💡 Agora você tem seus produtos originais + os novos produtos curados!');
    }

  } catch (error) {
    console.error('❌ Erro ao ler relatório de limpeza:', error);
  }
}

// Executar a restauração
restoreOriginalProducts().catch(console.error);
