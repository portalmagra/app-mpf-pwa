require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Produtos para categorias existentes - Focados em brasileiras nos EUA
const newProducts = {
  'ansiedade': [
    {
      name: 'Pure Encapsulations L-Theanine 200mg (Stress Relief)',
      description: 'L-teanina para relaxamento mental e redução da ansiedade. Ideal para brasileiras com estresse nos EUA.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TW',
      current_price: '15.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento mental', 'Redução da ansiedade', 'Sono tranquilo', 'Sem cafeína'],
      features: ['200mg L-teanina', 'Pura', 'Hipoalergênico', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['ansiedade', 'l-teanina', 'relaxamento', 'estresse'],
      priority_score: 92
    },
    {
      name: 'Thorne Magnesium Bisglycinate (Calm & Relax)',
      description: 'Magnésio bisglicinato para relaxamento profundo e redução da ansiedade.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TX',
      current_price: '21.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento profundo', 'Redução da ansiedade', 'Sono', 'Magnésio quelado'],
      features: ['Magnésio bisglicinato', 'Hipoalergênico', 'Sem efeitos colaterais', 'Alta absorção'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['ansiedade', 'magnésio', 'relaxamento', 'calm'],
      priority_score: 94
    },
    {
      name: 'Life Extension GABA 500mg (Natural Calm)',
      description: 'GABA para relaxamento natural, redução do estresse e ansiedade.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TY',
      current_price: '12.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento natural', 'Redução do estresse', 'Ansiedade', 'GABA'],
      features: ['500mg GABA', 'Neurotransmissor', 'Natural', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['ansiedade', 'gaba', 'relaxamento', 'natural'],
      priority_score: 88
    },
    {
      name: 'Pure Encapsulations Ashwagandha (Adaptogen)',
      description: 'Ashwagandha para adaptação ao estresse, redução da ansiedade e equilíbrio.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TZ',
      current_price: '23.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Adaptação ao estresse', 'Redução da ansiedade', 'Equilíbrio', 'Ashwagandha'],
      features: ['Ashwagandha', 'Hipoalergênico', 'Padronizada', 'Adaptogênico'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['ansiedade', 'ashwagandha', 'estresse', 'adaptogênico'],
      priority_score: 90
    },
    {
      name: 'NOW Foods Rhodiola 500mg (Stress Support)',
      description: 'Rhodiola rosea para resistência ao estresse e redução da ansiedade.',
      amazon_url: 'https://amazon.com/dp/B0019GW0U0',
      current_price: '16.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Resistência ao estresse', 'Redução da ansiedade', 'Energia', 'Rhodiola'],
      features: ['500mg Rhodiola', 'Padronizada', 'Não-GMO', 'Adaptogênico'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['ansiedade', 'rhodiola', 'estresse', 'resistência'],
      priority_score: 87
    }
  ],

  'menopausa': [
    {
      name: 'Thorne DIM (Diindolylmethane) - Menopause Support',
      description: 'DIM para equilíbrio hormonal durante a menopausa e metabolismo de estrogênio.',
      amazon_url: 'https://amazon.com/dp/B0019GW0U1',
      current_price: '28.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Equilíbrio hormonal', 'Menopausa', 'Metabolismo estrogênio', 'DIM'],
      features: ['DIM puro', 'Hipoalergênico', 'Alta qualidade', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['menopausa', 'dim', 'hormônios', 'estrogênio'],
      priority_score: 95
    },
    {
      name: 'NOW Foods Black Cohosh (Menopause Relief)',
      description: 'Black cohosh para alívio dos sintomas da menopausa e equilíbrio hormonal.',
      amazon_url: 'https://amazon.com/dp/B0019GW0U2',
      current_price: '16.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Alívio menopausa', 'Equilíbrio hormonal', 'Black cohosh', 'Natural'],
      features: ['Black cohosh', 'Padronizado', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['menopausa', 'black cohosh', 'alívio', 'hormônios'],
      priority_score: 92
    },
    {
      name: 'Pure Encapsulations Vitex (Chasteberry)',
      description: 'Vitex para equilíbrio hormonal feminino e regulação durante a menopausa.',
      amazon_url: 'https://amazon.com/dp/B0019GW0U3',
      current_price: '22.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Equilíbrio hormonal', 'Menopausa', 'Vitex', 'Saúde feminina'],
      features: ['Vitex', 'Hipoalergênico', 'Padronizado', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['menopausa', 'vitex', 'hormônios', 'feminino'],
      priority_score: 89
    },
    {
      name: 'Life Extension Maca Root (Hormonal Balance)',
      description: 'Maca peruana para equilíbrio hormonal, energia e bem-estar durante a menopausa.',
      amazon_url: 'https://amazon.com/dp/B0019GW0U4',
      current_price: '19.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Equilíbrio hormonal', 'Energia', 'Bem-estar', 'Maca peruana'],
      features: ['Maca peruana', 'Padronizada', 'Não-GMO', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['menopausa', 'maca', 'hormônios', 'energia'],
      priority_score: 86
    },
    {
      name: 'Thorne Magnesium Glycinate (Menopause Support)',
      description: 'Magnésio quelado para relaxamento, sono e suporte durante a menopausa.',
      amazon_url: 'https://amazon.com/dp/B0019GW0U5',
      current_price: '18.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento', 'Sono', 'Suporte menopausa', 'Magnésio quelado'],
      features: ['Magnésio quelado', 'Hipoalergênico', 'Sem aditivos', 'Alta absorção'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['menopausa', 'magnésio', 'relaxamento', 'sono'],
      priority_score: 84
    }
  ],

  'hormonal': [
    {
      name: 'Thorne DIM (Diindolylmethane) - Hormonal Balance',
      description: 'DIM para equilíbrio hormonal feminino e metabolismo de estrogênio.',
      amazon_url: 'https://amazon.com/dp/B0019GW0U6',
      current_price: '28.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Equilíbrio hormonal', 'Metabolismo estrogênio', 'Saúde feminina', 'DIM'],
      features: ['DIM puro', 'Hipoalergênico', 'Alta qualidade', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormonal', 'dim', 'estrogênio', 'feminino'],
      priority_score: 94
    },
    {
      name: 'Pure Encapsulations Vitex (Chasteberry)',
      description: 'Vitex para equilíbrio hormonal feminino e regulação do ciclo menstrual.',
      amazon_url: 'https://amazon.com/dp/B0019GW0U7',
      current_price: '22.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Equilíbrio hormonal', 'Ciclo menstrual', 'Vitex', 'Saúde feminina'],
      features: ['Vitex', 'Hipoalergênico', 'Padronizado', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormonal', 'vitex', 'ciclo menstrual', 'feminino'],
      priority_score: 91
    },
    {
      name: 'Life Extension Maca Root (Peruvian)',
      description: 'Maca peruana para energia, libido e equilíbrio hormonal natural.',
      amazon_url: 'https://amazon.com/dp/B0019GW0U8',
      current_price: '19.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Libido', 'Equilíbrio hormonal', 'Maca peruana'],
      features: ['Maca peruana', 'Padronizada', 'Não-GMO', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormonal', 'maca', 'libido', 'energia'],
      priority_score: 88
    },
    {
      name: 'Thorne Thyroid Support (Iodine & Tyrosine)',
      description: 'Suporte para tireoide com iodo e tirosina para metabolismo e energia.',
      amazon_url: 'https://amazon.com/dp/B0019GW0U9',
      current_price: '31.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte tireoide', 'Metabolismo', 'Energia', 'Iodo e tirosina'],
      features: ['Iodo', 'Tirosina', 'Hipoalergênico', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormonal', 'tireoide', 'iodo', 'metabolismo'],
      priority_score: 89
    },
    {
      name: 'Pure Encapsulations Ashwagandha (Stress & Hormones)',
      description: 'Ashwagandha para redução do cortisol, equilíbrio hormonal e adaptação ao estresse.',
      amazon_url: 'https://amazon.com/dp/B0019GW0UA',
      current_price: '23.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Redução cortisol', 'Equilíbrio hormonal', 'Adaptação estresse', 'Ashwagandha'],
      features: ['Ashwagandha', 'Hipoalergênico', 'Padronizada', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormonal', 'ashwagandha', 'cortisol', 'estresse'],
      priority_score: 90
    }
  ],

  'intestino': [
    {
      name: 'Pure Encapsulations Probiotic 50B (Multi-Strain)',
      description: 'Probióticos de alta potência com múltiplas cepas para saúde intestinal.',
      amazon_url: 'https://amazon.com/dp/B0019GW0UB',
      current_price: '34.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Saúde intestinal', 'Digestão', 'Imunidade', 'Múltiplas cepas'],
      features: ['50 bilhões CFU', 'Múltiplas cepas', 'Estável', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['intestino', 'probióticos', 'digestão', 'múltiplas cepas'],
      priority_score: 94
    },
    {
      name: 'NOW Foods Digestive Enzymes (Full Spectrum)',
      description: 'Enzimas digestivas completas para melhor absorção de nutrientes.',
      amazon_url: 'https://amazon.com/dp/B0019GW0UC',
      current_price: '18.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Digestão', 'Absorção de nutrientes', 'Conforto digestivo', 'Enzimas completas'],
      features: ['Espectro completo', 'Alta potência', 'Não-GMO', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['intestino', 'enzimas', 'absorção', 'nutrientes'],
      priority_score: 91
    },
    {
      name: 'Thorne Betaine HCL (Gentle Digestive Support)',
      description: 'Betaina HCL para suporte digestivo gentil e absorção de B12.',
      amazon_url: 'https://amazon.com/dp/B0019GW0UD',
      current_price: '22.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Digestão de proteínas', 'Absorção B12', 'Suporte gentil', 'Hipoalergênico'],
      features: ['Betaina HCL', 'Gentil', 'Hipoalergênico', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['intestino', 'betaina hcl', 'proteínas', 'b12'],
      priority_score: 88
    },
    {
      name: 'Life Extension Advanced Milk Thistle (Liver Support)',
      description: 'Cardo mariano para suporte hepático e detoxificação.',
      amazon_url: 'https://amazon.com/dp/B0019GW0UE',
      current_price: '19.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte hepático', 'Detoxificação', 'Saúde digestiva', 'Antioxidante'],
      features: ['Cardo mariano', 'Padronizado', 'Alta qualidade', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['intestino', 'fígado', 'detox', 'cardo mariano'],
      priority_score: 89
    },
    {
      name: 'NOW Foods Psyllium Husk (Fiber Supplement)',
      description: 'Psyllium para fibra solúvel e saúde intestinal.',
      amazon_url: 'https://amazon.com/dp/B0019GW0UF',
      current_price: '12.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Fibra solúvel', 'Regularidade', 'Saciedade', 'Saúde intestinal'],
      features: ['Psyllium puro', 'Sem aditivos', 'Não-GMO', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['intestino', 'fibra', 'psyllium', 'regularidade'],
      priority_score: 85
    }
  ]
};

async function addNewProducts() {
  console.log('🎯 Iniciando adição de produtos para novas categorias...');

  let totalAdded = 0;
  let totalErrors = 0;

  for (const [categoryId, products] of Object.entries(newProducts)) {
    console.log(`\n📦 Processando categoria: ${categoryId}`);
    console.log(`📊 Produtos para adicionar: ${products.length}`);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      try {
        // Gerar ID único e slug para o produto
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substr(2, 5);
        const productId = `${categoryId}-${timestamp}-${randomSuffix}`;
        
        const slug = product.name.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') + `-${timestamp}`;
        
        const productData = {
          id: productId,
          name: product.name,
          description: product.description,
          category_id: categoryId,
          slug: slug,
          amazon_url: product.amazon_url,
          current_price: parseFloat(product.current_price),
          image_url: product.image_url,
          benefits: product.benefits,
          features: product.features,
          is_mentoria: product.is_mentoria,
          is_curated: product.is_curated,
          quiz_keywords: product.quiz_keywords,
          priority_score: product.priority_score,
          created_at: new Date().toISOString()
        };

        console.log(`  🔄 Adicionando: ${product.name}`);

        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();

        if (error) {
          console.error(`    ❌ Erro ao adicionar ${product.name}:`, error.message);
          totalErrors++;
        } else {
          console.log(`    ✅ Adicionado com sucesso: ${product.name}`);
          totalAdded++;
        }

        // Pequena pausa para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`    ❌ Erro inesperado ao adicionar ${product.name}:`, error.message);
        totalErrors++;
      }
    }

    console.log(`✅ Categoria ${categoryId} processada`);
  }

  console.log('\n📊 RESULTADO FINAL:');
  console.log('==================================================');
  console.log(`✅ Produtos adicionados com sucesso: ${totalAdded}`);
  console.log(`❌ Erros encontrados: ${totalErrors}`);
  console.log(`📈 Taxa de sucesso: ${((totalAdded / (totalAdded + totalErrors)) * 100).toFixed(1)}%`);

  if (totalAdded > 0) {
    console.log('\n🎉 Produtos curados adicionados com sucesso!');
    console.log('💡 Acesse /admin-produtos para visualizar e gerenciar os produtos.');
  }
}

// Executar o script
addNewProducts().catch(console.error);
