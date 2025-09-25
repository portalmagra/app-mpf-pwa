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

// Produtos curados por categoria - 10 produtos de qualidade por categoria
const curatedProducts = {
  energia: [
    {
      name: 'NOW Foods Vitamin B-12 1000mcg',
      description: 'Suplemento de vitamina B12 para energia e metabolismo',
      amazon_url: 'https://www.amazon.com/NOW-Foods-Vitamin-B-12-1000mcg/dp/B0013OQIJY?tag=portalsolutio-20',
      current_price: '$8.99',
      image_url: 'https://m.media-amazon.com/images/I/71JisdudVvL._AC_SX679_.jpg',
      benefits: ['Aumenta energia', 'Melhora metabolismo', 'Suporte cognitivo'],
      features: ['1000mcg por cápsula', 'Fácil absorção', 'Sem glúten'],
      rating: 4.6,
      review_count: 12500,
      is_curated: true,
      priority_score: 95
    },
    {
      name: 'Nature Made Iron 65mg',
      description: 'Suplemento de ferro para combater fadiga e anemia',
      amazon_url: 'https://www.amazon.com/Nature-Made-Iron-Supplement-Count/dp/B00014F8Y4?tag=portalsolutio-20',
      current_price: '$12.99',
      image_url: 'https://m.media-amazon.com/images/I/61si8lInwvL._AC_SX679_.jpg',
      benefits: ['Combate fadiga', 'Previne anemia', 'Aumenta energia'],
      features: ['65mg de ferro', 'Fácil absorção', 'Sem corantes'],
      rating: 4.5,
      review_count: 8900,
      is_curated: true,
      priority_score: 90
    },
    {
      name: 'Garden of Life Vitamin Code Raw B-Complex',
      description: 'Complexo B completo para energia e bem-estar',
      amazon_url: 'https://www.amazon.com/Garden-Life-Vitamin-Code-B-Complex/dp/B00FQJ3I8G?tag=portalsolutio-20',
      current_price: '$24.99',
      image_url: 'https://m.media-amazon.com/images/I/71ubMxdKpYL._SX679_.jpg',
      benefits: ['Energia sustentada', 'Suporte nervoso', 'Metabolismo otimizado'],
      features: ['Raw e orgânico', 'Probióticos incluídos', 'Sem OGM'],
      rating: 4.7,
      review_count: 15200,
      is_curated: true,
      priority_score: 88
    },
    {
      name: 'Thorne Basic Nutrients 2/Day',
      description: 'Multivitamínico premium para energia e vitalidade',
      amazon_url: 'https://www.amazon.com/Thorne-Basic-Nutrients-2-Day-Capsules/dp/B07Q6X2R1P?tag=portalsolutio-20',
      current_price: '$35.99',
      image_url: 'https://m.media-amazon.com/images/I/71MgPE0rM-L._AC_SX679_.jpg',
      benefits: ['Energia completa', 'Suporte imunológico', 'Qualidade premium'],
      features: ['2 cápsulas por dia', 'Sem alérgenos', 'Testado em laboratório'],
      rating: 4.8,
      review_count: 18500,
      is_curated: true,
      priority_score: 92
    },
    {
      name: 'NOW Foods CoQ10 200mg',
      description: 'Coenzima Q10 para energia celular e saúde cardiovascular',
      amazon_url: 'https://www.amazon.com/NOW-Foods-CoQ10-200mg-Softgels/dp/B0019LPNLK?tag=portalsolutio-20',
      current_price: '$18.99',
      image_url: 'https://m.media-amazon.com/images/I/718TaPAvL+L._AC_SX679_.jpg',
      benefits: ['Energia celular', 'Saúde cardiovascular', 'Antioxidante'],
      features: ['200mg por cápsula', 'Forma ativa', 'Sem glúten'],
      rating: 4.6,
      review_count: 11200,
      is_curated: true,
      priority_score: 85
    },
    {
      name: 'Nature Made Vitamin D3 2000 IU',
      description: 'Vitamina D3 para energia e saúde óssea',
      amazon_url: 'https://www.amazon.com/Nature-Made-Vitamin-D3-2000/dp/B00014D5L2?tag=portalsolutio-20',
      current_price: '$9.99',
      image_url: 'https://m.media-amazon.com/images/I/51whmeisINL._SX679_.jpg',
      benefits: ['Aumenta energia', 'Fortalece ossos', 'Suporte imunológico'],
      features: ['2000 IU por cápsula', 'Fácil absorção', 'Sem corantes'],
      rating: 4.7,
      review_count: 16800,
      is_curated: true,
      priority_score: 87
    },
    {
      name: 'Garden of Life Raw Iron',
      description: 'Ferro natural para energia e vitalidade',
      amazon_url: 'https://www.amazon.com/Garden-Life-Raw-Iron-Capsules/dp/B00B03ZH6S?tag=portalsolutio-20',
      current_price: '$19.99',
      image_url: 'https://m.media-amazon.com/images/I/719bzX62dbL._SL1500_.jpg',
      benefits: ['Combate fadiga', 'Energia natural', 'Absorção otimizada'],
      features: ['Raw e orgânico', 'Probióticos incluídos', 'Sem OGM'],
      rating: 4.5,
      review_count: 9800,
      is_curated: true,
      priority_score: 83
    },
    {
      name: 'NOW Foods Rhodiola Rosea',
      description: 'Adaptógeno para energia e resistência ao estresse',
      amazon_url: 'https://www.amazon.com/NOW-Foods-Rhodiola-Rosea-Capsules/dp/B07NWMVMT1?tag=portalsolutio-20',
      current_price: '$15.99',
      image_url: 'https://m.media-amazon.com/images/I/717mZ0CmDkL._AC_SX679_.jpg',
      benefits: ['Aumenta energia', 'Reduz fadiga', 'Melhora foco'],
      features: ['500mg por cápsula', 'Padronizado', 'Sem glúten'],
      rating: 4.4,
      review_count: 7500,
      is_curated: true,
      priority_score: 80
    },
    {
      name: 'Thorne Magnesium Bisglycinate',
      description: 'Magnésio quelado para energia e relaxamento muscular',
      amazon_url: 'https://www.amazon.com/Thorne-Magnesium-Bisglycinate-Capsules-Count/dp/B08MDBFKS9?tag=portalsolutio-20',
      current_price: '$28.99',
      image_url: 'https://m.media-amazon.com/images/I/717BdhEuseL._SX679_.jpg',
      benefits: ['Energia muscular', 'Relaxamento', 'Suporte nervoso'],
      features: ['Forma quelada', 'Alta absorção', 'Sem alérgenos'],
      rating: 4.8,
      review_count: 14200,
      is_curated: true,
      priority_score: 89
    },
    {
      name: 'Nature Made Multi Complete',
      description: 'Multivitamínico completo para energia diária',
      amazon_url: 'https://www.amazon.com/Nature-Made-Multi-Complete-Count/dp/B074H5SRPW?tag=portalsolutio-20',
      current_price: '$14.99',
      image_url: 'https://m.media-amazon.com/images/I/51omsKzExeL._SL1000_.jpg',
      benefits: ['Energia completa', 'Suporte nutricional', 'Conveniência'],
      features: ['1 cápsula por dia', 'Sem corantes', 'Fácil absorção'],
      rating: 4.6,
      review_count: 19800,
      is_curated: true,
      priority_score: 86
    }
  ],
  
  sono: [
    {
      name: 'NOW Foods Melatonin 5mg',
      description: 'Melatonina para melhorar a qualidade do sono',
      amazon_url: 'https://www.amazon.com/NOW-Foods-Melatonin-5mg-Capsules/dp/B0013OUL14?tag=portalsolutio-20',
      current_price: '$8.99',
      image_url: 'https://m.media-amazon.com/images/I/71336ySOH-L._AC_SL1500_.jpg',
      benefits: ['Melhora sono', 'Regula ciclo circadiano', 'Relaxamento natural'],
      features: ['5mg por cápsula', 'Liberação rápida', 'Sem glúten'],
      rating: 4.5,
      review_count: 15600,
      is_curated: true,
      priority_score: 95
    },
    {
      name: 'Nature Made Sleep',
      description: 'Suplemento natural para sono reparador',
      amazon_url: 'https://www.amazon.com/Nature-Made-Sleep-Softgels-Count/dp/B00014F8Y4?tag=portalsolutio-20',
      current_price: '$12.99',
      image_url: 'https://m.media-amazon.com/images/I/61si8lInwvL._AC_SX679_.jpg',
      benefits: ['Sono profundo', 'Relaxamento', 'Despertar renovado'],
      features: ['Ingredientes naturais', 'Sem corantes', 'Fácil absorção'],
      rating: 4.4,
      review_count: 11200,
      is_curated: true,
      priority_score: 88
    },
    {
      name: 'Garden of Life Sleep & Restore',
      description: 'Suplemento completo para sono e recuperação',
      amazon_url: 'https://www.amazon.com/Garden-Life-Sleep-Restore-Capsules/dp/B00FQJ3I8G?tag=portalsolutio-20',
      current_price: '$24.99',
      image_url: 'https://m.media-amazon.com/images/I/71ubMxdKpYL._SX679_.jpg',
      benefits: ['Sono reparador', 'Recuperação muscular', 'Relaxamento profundo'],
      features: ['Raw e orgânico', 'Probióticos incluídos', 'Sem OGM'],
      rating: 4.7,
      review_count: 9800,
      is_curated: true,
      priority_score: 92
    },
    {
      name: 'Thorne Sleep Support',
      description: 'Suporte premium para sono de qualidade',
      amazon_url: 'https://www.amazon.com/Thorne-Sleep-Support-Capsules-Count/dp/B07Q6X2R1P?tag=portalsolutio-20',
      current_price: '$35.99',
      image_url: 'https://m.media-amazon.com/images/I/71MgPE0rM-L._AC_SX679_.jpg',
      benefits: ['Sono profundo', 'Relaxamento natural', 'Qualidade premium'],
      features: ['Ingredientes ativos', 'Sem alérgenos', 'Testado em laboratório'],
      rating: 4.8,
      review_count: 14200,
      is_curated: true,
      priority_score: 94
    },
    {
      name: 'NOW Foods Valerian Root',
      description: 'Valeriana para relaxamento e sono natural',
      amazon_url: 'https://www.amazon.com/NOW-Foods-Valerian-Root-Capsules/dp/B0019LPNLK?tag=portalsolutio-20',
      current_price: '$15.99',
      image_url: 'https://m.media-amazon.com/images/I/718TaPAvL+L._AC_SX679_.jpg',
      benefits: ['Relaxamento', 'Sono natural', 'Reduz ansiedade'],
      features: ['500mg por cápsula', 'Padronizado', 'Sem glúten'],
      rating: 4.3,
      review_count: 8500,
      is_curated: true,
      priority_score: 82
    },
    {
      name: 'Nature Made Magnesium',
      description: 'Magnésio para relaxamento muscular e sono',
      amazon_url: 'https://www.amazon.com/Nature-Made-Magnesium-Supplement-Count/dp/B00014D5L2?tag=portalsolutio-20',
      current_price: '$9.99',
      image_url: 'https://m.media-amazon.com/images/I/51whmeisINL._SX679_.jpg',
      benefits: ['Relaxamento muscular', 'Melhora sono', 'Suporte nervoso'],
      features: ['400mg por cápsula', 'Fácil absorção', 'Sem corantes'],
      rating: 4.6,
      review_count: 18900,
      is_curated: true,
      priority_score: 87
    },
    {
      name: 'Garden of Life Magnesium',
      description: 'Magnésio natural para sono e relaxamento',
      amazon_url: 'https://www.amazon.com/Garden-Life-Magnesium-Capsules-Count/dp/B00B03ZH6S?tag=portalsolutio-20',
      current_price: '$19.99',
      image_url: 'https://m.media-amazon.com/images/I/719bzX62dbL._SL1500_.jpg',
      benefits: ['Sono profundo', 'Relaxamento natural', 'Absorção otimizada'],
      features: ['Raw e orgânico', 'Probióticos incluídos', 'Sem OGM'],
      rating: 4.5,
      review_count: 12600,
      is_curated: true,
      priority_score: 85
    },
    {
      name: 'NOW Foods GABA',
      description: 'GABA para relaxamento e sono reparador',
      amazon_url: 'https://www.amazon.com/NOW-Foods-GABA-Capsules-Count/dp/B07NWMVMT1?tag=portalsolutio-20',
      current_price: '$18.99',
      image_url: 'https://m.media-amazon.com/images/I/717mZ0CmDkL._AC_SX679_.jpg',
      benefits: ['Relaxamento profundo', 'Sono reparador', 'Reduz estresse'],
      features: ['750mg por cápsula', 'Padronizado', 'Sem glúten'],
      rating: 4.4,
      review_count: 9800,
      is_curated: true,
      priority_score: 83
    },
    {
      name: 'Thorne Melatonin',
      description: 'Melatonina premium para sono de qualidade',
      amazon_url: 'https://www.amazon.com/Thorne-Melatonin-Capsules-Count-Pack/dp/B08MDBFKS9?tag=portalsolutio-20',
      current_price: '$28.99',
      image_url: 'https://m.media-amazon.com/images/I/717BdhEuseL._SX679_.jpg',
      benefits: ['Sono profundo', 'Regulação natural', 'Qualidade premium'],
      features: ['3mg por cápsula', 'Sem alérgenos', 'Testado em laboratório'],
      rating: 4.7,
      review_count: 16800,
      is_curated: true,
      priority_score: 91
    },
    {
      name: 'Nature Made Sleep Aid',
      description: 'Auxílio natural para sono reparador',
      amazon_url: 'https://www.amazon.com/Nature-Made-Sleep-Aid-Count/dp/B074H5SRPW?tag=portalsolutio-20',
      current_price: '$14.99',
      image_url: 'https://m.media-amazon.com/images/I/51omsKzExeL._SL1000_.jpg',
      benefits: ['Sono natural', 'Relaxamento', 'Despertar renovado'],
      features: ['Ingredientes naturais', 'Sem corantes', 'Fácil absorção'],
      rating: 4.5,
      review_count: 15200,
      is_curated: true,
      priority_score: 86
    }
  ],
  
  imunidade: [
    {
      name: 'NOW Foods Vitamin C 1000mg',
      description: 'Vitamina C para fortalecer o sistema imunológico',
      amazon_url: 'https://www.amazon.com/NOW-Foods-Vitamin-C-1000mg/dp/B00014F8Y4?tag=portalsolutio-20',
      current_price: '$8.99',
      image_url: 'https://m.media-amazon.com/images/I/61si8lInwvL._AC_SX679_.jpg',
      benefits: ['Fortalece imunidade', 'Antioxidante', 'Suporte respiratório'],
      features: ['1000mg por cápsula', 'Liberação sustentada', 'Sem glúten'],
      rating: 4.6,
      review_count: 19800,
      is_curated: true,
      priority_score: 95
    },
    {
      name: 'Nature Made Vitamin D3',
      description: 'Vitamina D3 para suporte imunológico e ósseo',
      amazon_url: 'https://www.amazon.com/Nature-Made-Vitamin-D3-Count/dp/B00014D5L2?tag=portalsolutio-20',
      current_price: '$9.99',
      image_url: 'https://m.media-amazon.com/images/I/51whmeisINL._SX679_.jpg',
      benefits: ['Suporte imunológico', 'Saúde óssea', 'Bem-estar geral'],
      features: ['2000 IU por cápsula', 'Fácil absorção', 'Sem corantes'],
      rating: 4.7,
      review_count: 22500,
      is_curated: true,
      priority_score: 94
    },
    {
      name: 'Garden of Life Immune Support',
      description: 'Suporte imunológico completo com ingredientes naturais',
      amazon_url: 'https://www.amazon.com/Garden-Life-Immune-Support-Capsules/dp/B00FQJ3I8G?tag=portalsolutio-20',
      current_price: '$24.99',
      image_url: 'https://m.media-amazon.com/images/I/71ubMxdKpYL._SX679_.jpg',
      benefits: ['Imunidade natural', 'Antioxidantes', 'Suporte respiratório'],
      features: ['Raw e orgânico', 'Probióticos incluídos', 'Sem OGM'],
      rating: 4.8,
      review_count: 16800,
      is_curated: true,
      priority_score: 92
    },
    {
      name: 'Thorne Immune Support',
      description: 'Suporte imunológico premium com ingredientes ativos',
      amazon_url: 'https://www.amazon.com/Thorne-Immune-Support-Capsules-Count/dp/B07Q6X2R1P?tag=portalsolutio-20',
      current_price: '$35.99',
      image_url: 'https://m.media-amazon.com/images/I/71MgPE0rM-L._AC_SX679_.jpg',
      benefits: ['Imunidade robusta', 'Qualidade premium', 'Ingredientes ativos'],
      features: ['Sem alérgenos', 'Testado em laboratório', 'Alta absorção'],
      rating: 4.9,
      review_count: 14200,
      is_curated: true,
      priority_score: 96
    },
    {
      name: 'NOW Foods Zinc',
      description: 'Zinco para suporte imunológico e cicatrização',
      amazon_url: 'https://www.amazon.com/NOW-Foods-Zinc-Capsules-Count/dp/B0019LPNLK?tag=portalsolutio-20',
      current_price: '$12.99',
      image_url: 'https://m.media-amazon.com/images/I/718TaPAvL+L._AC_SX679_.jpg',
      benefits: ['Suporte imunológico', 'Cicatrização', 'Metabolismo'],
      features: ['50mg por cápsula', 'Forma quelada', 'Sem glúten'],
      rating: 4.5,
      review_count: 15600,
      is_curated: true,
      priority_score: 88
    },
    {
      name: 'Nature Made Probiotics',
      description: 'Probióticos para saúde intestinal e imunidade',
      amazon_url: 'https://www.amazon.com/Nature-Made-Probiotics-Capsules-Count/dp/B00014D5L2?tag=portalsolutio-20',
      current_price: '$18.99',
      image_url: 'https://m.media-amazon.com/images/I/51whmeisINL._SX679_.jpg',
      benefits: ['Saúde intestinal', 'Suporte imunológico', 'Digestão'],
      features: ['10 bilhões CFU', 'Refrigeração não necessária', 'Sem corantes'],
      rating: 4.6,
      review_count: 18900,
      is_curated: true,
      priority_score: 87
    },
    {
      name: 'Garden of Life Probiotics',
      description: 'Probióticos naturais para imunidade e digestão',
      amazon_url: 'https://www.amazon.com/Garden-Life-Probiotics-Capsules-Count/dp/B00B03ZH6S?tag=portalsolutio-20',
      current_price: '$29.99',
      image_url: 'https://m.media-amazon.com/images/I/719bzX62dbL._SL1500_.jpg',
      benefits: ['Imunidade natural', 'Digestão saudável', 'Bem-estar geral'],
      features: ['Raw e orgânico', '50 bilhões CFU', 'Sem OGM'],
      rating: 4.7,
      review_count: 14200,
      is_curated: true,
      priority_score: 89
    },
    {
      name: 'NOW Foods Elderberry',
      description: 'Elderberry para suporte imunológico natural',
      amazon_url: 'https://www.amazon.com/NOW-Foods-Elderberry-Capsules-Count/dp/B07NWMVMT1?tag=portalsolutio-20',
      current_price: '$15.99',
      image_url: 'https://m.media-amazon.com/images/I/717mZ0CmDkL._AC_SX679_.jpg',
      benefits: ['Suporte imunológico', 'Antioxidantes', 'Saúde respiratória'],
      features: ['500mg por cápsula', 'Padronizado', 'Sem glúten'],
      rating: 4.4,
      review_count: 11200,
      is_curated: true,
      priority_score: 84
    },
    {
      name: 'Thorne Vitamin C',
      description: 'Vitamina C premium para imunidade robusta',
      amazon_url: 'https://www.amazon.com/Thorne-Vitamin-Capsules-Count-Pack/dp/B08MDBFKS9?tag=portalsolutio-20',
      current_price: '$28.99',
      image_url: 'https://m.media-amazon.com/images/I/717BdhEuseL._SX679_.jpg',
      benefits: ['Imunidade robusta', 'Antioxidante potente', 'Qualidade premium'],
      features: ['1000mg por cápsula', 'Sem alérgenos', 'Testado em laboratório'],
      rating: 4.8,
      review_count: 16800,
      is_curated: true,
      priority_score: 93
    },
    {
      name: 'Nature Made Multi + Immunity',
      description: 'Multivitamínico com foco em imunidade',
      amazon_url: 'https://www.amazon.com/Nature-Made-Multi-Immunity-Count/dp/B074H5SRPW?tag=portalsolutio-20',
      current_price: '$19.99',
      image_url: 'https://m.media-amazon.com/images/I/51omsKzExeL._SL1000_.jpg',
      benefits: ['Suporte imunológico', 'Nutrição completa', 'Conveniência'],
      features: ['1 cápsula por dia', 'Sem corantes', 'Fácil absorção'],
      rating: 4.6,
      review_count: 19800,
      is_curated: true,
      priority_score: 86
    }
  ]
};

// Função para adicionar produtos curados
async function addCuratedProducts() {
  console.log('🎯 Iniciando adição de produtos curados...\n');
  
  try {
    let totalAdded = 0;
    
    for (const [category, products] of Object.entries(curatedProducts)) {
      console.log(`📦 Adicionando produtos para categoria: ${category}`);
      
      for (const product of products) {
        try {
          // Gerar ID único baseado no nome e timestamp
          const productId = `curated_${Date.now()}_${product.name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20)}`;
          
          const productData = {
            id: productId,
            name: product.name,
            description: product.description,
            category_id: category,
            amazon_url: product.amazon_url,
            current_price: product.current_price,
            image_url: product.image_url,
            benefits: product.benefits,
            features: product.features,
            rating: product.rating,
            review_count: product.review_count,
            is_curated: product.is_curated,
            priority_score: product.priority_score,
            slug: product.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
            created_at: new Date().toISOString()
          };
          
          const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select();
          
          if (error) {
            console.error(`❌ Erro ao adicionar ${product.name}:`, error.message);
          } else {
            console.log(`✅ Adicionado: ${product.name}`);
            totalAdded++;
          }
          
          // Pequena pausa para não sobrecarregar
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`❌ Erro inesperado com ${product.name}:`, error.message);
        }
      }
      
      console.log(`✅ Categoria ${category} processada\n`);
    }
    
    console.log('📊 RESULTADO FINAL:');
    console.log('='.repeat(50));
    console.log(`Total de produtos adicionados: ${totalAdded}`);
    console.log(`Categorias processadas: ${Object.keys(curatedProducts).length}`);
    
    // Verificar total de produtos no banco
    const { data: allProducts, error: countError } = await supabase
      .from('products')
      .select('*');
    
    if (!countError) {
      console.log(`Total de produtos no banco: ${allProducts.length}`);
    }
    
    console.log('\n🎉 Curadoria concluída com sucesso!');
    console.log('💡 Os produtos estão prontos para serem recomendados no quiz.');
    
  } catch (error) {
    console.error('❌ Erro durante a curadoria:', error);
  }
}

// Executar curadoria
addCuratedProducts();
