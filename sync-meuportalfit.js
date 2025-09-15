#!/usr/bin/env node

/**
 * Script para sincronizar produtos do MeuPortalFit original com o PWA
 * Este script busca os produtos do Supabase e os sincroniza com o PWA
 */

const fs = require('fs');
const path = require('path');

// Configuração do Supabase (mesma do MeuPortalFit original)
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Função para buscar produtos do Supabase
async function fetchProductsFromSupabase() {
  try {
    console.log('🔄 Buscando produtos do Supabase...');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();
    console.log(`✅ ${products.length} produtos encontrados no Supabase`);
    
    return products;
  } catch (error) {
    console.error('❌ Erro ao buscar produtos do Supabase:', error.message);
    return [];
  }
}

// Função para buscar categorias do Supabase
async function fetchCategoriesFromSupabase() {
  try {
    console.log('🔄 Buscando categorias do Supabase...');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const categories = await response.json();
    console.log(`✅ ${categories.length} categorias encontradas no Supabase`);
    
    return categories;
  } catch (error) {
    console.error('❌ Erro ao buscar categorias do Supabase:', error.message);
    return [];
  }
}

// Função para mapear produtos do formato MeuPortalFit para PWA
function mapProductsToPWA(products) {
  return products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    category_id: product.category_id,
    amazon_url: product.amazon_url,
    current_price: product.current_price,
    original_price: product.original_price,
    rating: product.rating,
    review_count: product.review_count,
    image_url: product.image_url,
    benefits: product.benefits || [],
    features: product.features || [],
    product_url: product.product_url,
    created_at: product.created_at,
    slug: product.slug,
    is_mentoria: product.is_mentoria || false
  }));
}

// Função para mapear categorias do formato MeuPortalFit para PWA
function mapCategoriesToPWA(categories) {
  return categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    color: category.color,
    icon: category.icon,
    created_at: category.created_at
  }));
}

// Função principal de sincronização
async function syncMeuPortalFit() {
  console.log('🚀 Iniciando sincronização do MeuPortalFit...');
  
  try {
    // Buscar dados do Supabase
    const [products, categories] = await Promise.all([
      fetchProductsFromSupabase(),
      fetchCategoriesFromSupabase()
    ]);

    if (products.length === 0 && categories.length === 0) {
      console.log('⚠️ Nenhum dado encontrado no Supabase. Verifique as credenciais.');
      return;
    }

    // Mapear dados para o formato do PWA
    const mappedProducts = mapProductsToPWA(products);
    const mappedCategories = mapCategoriesToPWA(categories);

    // Salvar dados em arquivos JSON para importação
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Salvar produtos
    const productsFile = path.join(dataDir, 'products.json');
    fs.writeFileSync(productsFile, JSON.stringify(mappedProducts, null, 2));
    console.log(`💾 Produtos salvos em: ${productsFile}`);

    // Salvar categorias
    const categoriesFile = path.join(dataDir, 'categories.json');
    fs.writeFileSync(categoriesFile, JSON.stringify(mappedCategories, null, 2));
    console.log(`💾 Categorias salvas em: ${categoriesFile}`);

    // Estatísticas
    const mercadoProducts = mappedProducts.filter(p => p.is_mentoria);
    console.log('\n📊 Estatísticas da sincronização:');
    console.log(`   • Total de produtos: ${mappedProducts.length}`);
    console.log(`   • Total de categorias: ${mappedCategories.length}`);
    console.log(`   • Produtos no mercado: ${mercadoProducts.length}`);
    
    if (mercadoProducts.length > 0) {
      console.log('\n🛒 Produtos no mercado:');
      mercadoProducts.forEach(product => {
        console.log(`   • ${product.name}`);
      });
    }

    console.log('\n✅ Sincronização concluída com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Verifique os arquivos em /data/');
    console.log('   2. Importe os dados no PWA através da área administrativa');
    console.log('   3. Configure os produtos do mercado conforme necessário');

  } catch (error) {
    console.error('❌ Erro durante a sincronização:', error);
  }
}

// Executar sincronização se o script for chamado diretamente
if (require.main === module) {
  syncMeuPortalFit();
}

module.exports = { syncMeuPortalFit, fetchProductsFromSupabase, fetchCategoriesFromSupabase };
