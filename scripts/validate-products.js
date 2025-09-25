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

// Função para validar URL da Amazon
async function validateAmazonUrl(url) {
  if (!url) return { isValid: false, error: 'URL não fornecida' };
  
  try {
    // Verificar se é uma URL válida
    const urlObj = new URL(url);
    
    if (!urlObj.hostname.includes('amazon')) {
      return { isValid: false, error: 'Não é uma URL da Amazon' };
    }
    
    // Fazer uma requisição HEAD para verificar se a página existe
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.status === 404) {
      return { isValid: false, error: 'Produto não encontrado (404)' };
    }
    
    if (response.status === 403) {
      return { isValid: false, error: 'Acesso negado (403)' };
    }
    
    if (response.status >= 400) {
      return { isValid: false, error: `Erro HTTP ${response.status}` };
    }
    
    return { isValid: true, status: response.status };
    
  } catch (error) {
    return { isValid: false, error: error.message };
  }
}

// Função para validar imagem
async function validateImageUrl(imageUrl) {
  if (!imageUrl) return { isValid: false, error: 'URL da imagem não fornecida' };
  
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    
    if (response.status === 404) {
      return { isValid: false, error: 'Imagem não encontrada (404)' };
    }
    
    if (response.status >= 400) {
      return { isValid: false, error: `Erro HTTP ${response.status}` };
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      return { isValid: false, error: 'Não é uma imagem válida' };
    }
    
    return { isValid: true, contentType };
    
  } catch (error) {
    return { isValid: false, error: error.message };
  }
}

// Função principal de validação
async function validateProducts() {
  console.log('🔍 Iniciando validação de produtos...\n');
  
  try {
    // Buscar todos os produtos
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      return;
    }
    
    console.log(`📦 Total de produtos encontrados: ${products.length}\n`);
    
    const validationResults = {
      total: products.length,
      valid: 0,
      invalid: 0,
      noUrl: 0,
      noImage: 0,
      brokenUrl: 0,
      brokenImage: 0,
      details: []
    };
    
    // Validar cada produto
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`🔍 Validando produto ${i + 1}/${products.length}: ${product.name}`);
      
      const productResult = {
        id: product.id,
        name: product.name,
        category_id: product.category_id,
        amazon_url: product.amazon_url,
        image_url: product.image_url,
        current_price: product.current_price,
        issues: [],
        status: 'valid'
      };
      
      // Validar URL da Amazon
      if (!product.amazon_url) {
        productResult.issues.push('Sem URL da Amazon');
        productResult.status = 'invalid';
        validationResults.noUrl++;
      } else {
        const urlValidation = await validateAmazonUrl(product.amazon_url);
        if (!urlValidation.isValid) {
          productResult.issues.push(`URL Amazon: ${urlValidation.error}`);
          productResult.status = 'invalid';
          validationResults.brokenUrl++;
        }
      }
      
      // Validar imagem
      if (!product.image_url) {
        productResult.issues.push('Sem URL da imagem');
        productResult.status = 'invalid';
        validationResults.noImage++;
      } else {
        const imageValidation = await validateImageUrl(product.image_url);
        if (!imageValidation.isValid) {
          productResult.issues.push(`Imagem: ${imageValidation.error}`);
          productResult.status = 'invalid';
          validationResults.brokenImage++;
        }
      }
      
      // Verificar outros campos obrigatórios
      if (!product.name || product.name.trim() === '') {
        productResult.issues.push('Nome vazio');
        productResult.status = 'invalid';
      }
      
      if (!product.category_id) {
        productResult.issues.push('Sem categoria');
        productResult.status = 'invalid';
      }
      
      // Contar resultados
      if (productResult.status === 'valid') {
        validationResults.valid++;
      } else {
        validationResults.invalid++;
      }
      
      validationResults.details.push(productResult);
      
      // Pequena pausa para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Exibir relatório
    console.log('\n📊 RELATÓRIO DE VALIDAÇÃO:');
    console.log('='.repeat(50));
    console.log(`Total de produtos: ${validationResults.total}`);
    console.log(`✅ Produtos válidos: ${validationResults.valid}`);
    console.log(`❌ Produtos inválidos: ${validationResults.invalid}`);
    console.log(`🔗 Sem URL Amazon: ${validationResults.noUrl}`);
    console.log(`🖼️ Sem imagem: ${validationResults.noImage}`);
    console.log(`💔 URLs quebradas: ${validationResults.brokenUrl}`);
    console.log(`🖼️ Imagens quebradas: ${validationResults.brokenImage}`);
    
    // Exibir produtos com problemas
    console.log('\n❌ PRODUTOS COM PROBLEMAS:');
    console.log('='.repeat(50));
    
    const problematicProducts = validationResults.details.filter(p => p.status === 'invalid');
    
    problematicProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Categoria: ${product.category_id}`);
      console.log(`   URL Amazon: ${product.amazon_url || 'N/A'}`);
      console.log(`   Imagem: ${product.image_url || 'N/A'}`);
      console.log(`   Problemas: ${product.issues.join(', ')}`);
    });
    
    // Salvar relatório em arquivo
    const fs = require('fs');
    const reportPath = './product-validation-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(validationResults, null, 2));
    console.log(`\n📄 Relatório salvo em: ${reportPath}`);
    
    // Sugestões de ação
    console.log('\n💡 SUGESTÕES DE AÇÃO:');
    console.log('='.repeat(50));
    
    if (validationResults.brokenUrl > 0) {
      console.log(`• ${validationResults.brokenUrl} produtos com URLs quebradas - considere removê-los ou atualizar`);
    }
    
    if (validationResults.brokenImage > 0) {
      console.log(`• ${validationResults.brokenImage} produtos com imagens quebradas - atualize as URLs das imagens`);
    }
    
    if (validationResults.noUrl > 0) {
      console.log(`• ${validationResults.noUrl} produtos sem URL Amazon - adicione URLs válidas ou remova`);
    }
    
    if (validationResults.noImage > 0) {
      console.log(`• ${validationResults.noImage} produtos sem imagem - adicione URLs de imagens válidas`);
    }
    
    const validPercentage = ((validationResults.valid / validationResults.total) * 100).toFixed(1);
    console.log(`\n📈 Taxa de produtos válidos: ${validPercentage}%`);
    
    if (validPercentage < 50) {
      console.log('⚠️ ATENÇÃO: Menos de 50% dos produtos estão válidos!');
      console.log('💡 Recomendação: Limpeza massiva dos produtos inválidos');
    } else if (validPercentage < 80) {
      console.log('⚠️ ATENÇÃO: Menos de 80% dos produtos estão válidos!');
      console.log('💡 Recomendação: Revisão e correção dos produtos problemáticos');
    } else {
      console.log('✅ Boa qualidade geral dos produtos!');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a validação:', error);
  }
}

// Executar validação
validateProducts();
