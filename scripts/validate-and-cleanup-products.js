require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function validateAndCleanupProducts() {
  console.log('🔍 Iniciando validação e limpeza de produtos...');

  // 1. Buscar todos os produtos
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('❌ Erro ao buscar produtos:', error);
    return;
  }

  console.log(`📦 Total de produtos encontrados: ${products.length}`);

  const invalidProducts = [];
  const validProducts = [];

  // 2. Validar cada produto
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`🔍 Validando produto ${i + 1}/${products.length}: ${product.name}`);

    let isValid = true;
    const problems = [];

    // Validar URL da Amazon
    if (!product.amazon_url) {
      problems.push('Sem URL Amazon');
      isValid = false;
    } else {
      // Verificar se é uma URL válida da Amazon
      const isAmazonUrl = product.amazon_url.includes('amazon.com') || 
                         product.amazon_url.includes('amzn.to') ||
                         product.amazon_url.includes('amazon.com.br');
      
      if (!isAmazonUrl) {
        problems.push('URL não é da Amazon');
        isValid = false;
      } else {
        // Tentar verificar se a URL está acessível
        try {
          const response = await fetch(product.amazon_url, { 
            method: 'HEAD',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          if (!response.ok) {
            problems.push(`URL retorna erro ${response.status}`);
            isValid = false;
          }
        } catch (error) {
          problems.push('URL não acessível');
          isValid = false;
        }
      }
    }

    // Validar URL da imagem
    if (!product.image_url) {
      problems.push('Sem imagem');
      isValid = false;
    } else {
      try {
        const response = await fetch(product.image_url, { method: 'HEAD' });
        if (!response.ok) {
          problems.push(`Imagem retorna erro ${response.status}`);
          isValid = false;
        }
      } catch (error) {
        problems.push('Imagem não acessível');
        isValid = false;
      }
    }

    // Validar campos obrigatórios
    if (!product.name || product.name.trim() === '') {
      problems.push('Nome vazio');
      isValid = false;
    }

    if (!product.category_id) {
      problems.push('Sem categoria');
      isValid = false;
    }

    if (isValid) {
      validProducts.push(product);
    } else {
      invalidProducts.push({
        ...product,
        problems: problems.join(', ')
      });
    }

    // Pequena pausa para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n📊 RESULTADO DA VALIDAÇÃO:');
  console.log('==================================================');
  console.log(`✅ Produtos válidos: ${validProducts.length}`);
  console.log(`❌ Produtos inválidos: ${invalidProducts.length}`);
  console.log(`📈 Taxa de validade: ${((validProducts.length / products.length) * 100).toFixed(1)}%`);

  if (invalidProducts.length > 0) {
    console.log('\n❌ PRODUTOS INVÁLIDOS QUE SERÃO REMOVIDOS:');
    console.log('==================================================');
    invalidProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Categoria: ${product.category_id}`);
      console.log(`   URL Amazon: ${product.amazon_url}`);
      console.log(`   Problemas: ${product.problems}`);
      console.log('');
    });

    // 3. Remover produtos inválidos
    console.log('🗑️ Removendo produtos inválidos...');
    const invalidIds = invalidProducts.map(p => p.id);
    
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .in('id', invalidIds);

    if (deleteError) {
      console.error('❌ Erro ao remover produtos inválidos:', deleteError);
    } else {
      console.log(`✅ ${invalidProducts.length} produtos inválidos removidos com sucesso!`);
    }
  }

  console.log('\n🎉 Limpeza concluída!');
  console.log(`📦 Produtos válidos restantes: ${validProducts.length}`);
  
  return {
    totalProducts: products.length,
    validProducts: validProducts.length,
    invalidProducts: invalidProducts.length,
    removedProducts: invalidProducts.length
  };
}

// Executar a validação e limpeza
validateAndCleanupProducts().catch(console.error);
