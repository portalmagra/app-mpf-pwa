require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// PRODUTOS FINAIS PARA COMPLETAR 100+ - FOCO EM BRASILEIRAS NOS EUA
const finalProducts = {
  'emagrecimento': [
    {
      name: 'Thorne Chromium Picolinate (Blood Sugar Support)',
      description: 'Cromo quelado para controle do açúcar no sangue e metabolismo. Essencial para brasileiras com resistência à insulina.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '15.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Controle açúcar', 'Metabolismo', 'Cromo quelado', 'Hipoalergênico'],
      features: ['Cromo quelado', 'Hipoalergênico', 'Sem aditivos', 'Alta absorção'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['emagrecimento', 'cromo', 'açúcar', 'metabolismo'],
      priority_score: 92
    },
    {
      name: 'Pure Encapsulations L-Carnitine (Fat Metabolism)',
      description: 'L-carnitina para metabolismo de gorduras e energia. Ideal para brasileiras ativas.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '22.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Metabolismo gorduras', 'Energia', 'L-carnitina', 'Hipoalergênico'],
      features: ['L-carnitina', 'Hipoalergênico', 'Sem aditivos', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['emagrecimento', 'l-carnitina', 'gorduras', 'energia'],
      priority_score: 89
    },
    {
      name: 'NOW Foods Green Tea Extract (EGCG)',
      description: 'Extrato de chá verde com EGCG para metabolismo e antioxidantes.',
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
      current_price: '12.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Metabolismo', 'Antioxidantes', 'EGCG', 'Chá verde'],
      features: ['EGCG', 'Padronizado', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['emagrecimento', 'chá verde', 'egcg', 'metabolismo'],
      priority_score: 87
    },
    {
      name: 'Life Extension CLA (Conjugated Linoleic Acid)',
      description: 'CLA para redução de gordura corporal e composição corporal.',
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
      current_price: '18.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Redução gordura', 'Composição corporal', 'CLA', 'Natural'],
      features: ['CLA', 'Padronizado', 'Alta qualidade', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['emagrecimento', 'cla', 'gordura', 'corporal'],
      priority_score: 85
    },
    {
      name: 'Thorne Berberine-500 (Blood Sugar)',
      description: 'Berberina para controle do açúcar no sangue e metabolismo.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '26.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Controle açúcar', 'Metabolismo', 'Berberina', 'Hipoalergênico'],
      features: ['500mg Berberina', 'Hipoalergênico', 'Sem aditivos', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['emagrecimento', 'berberina', 'açúcar', 'metabolismo'],
      priority_score: 91
    }
  ],

  'fadiga': [
    {
      name: 'Thorne Iron Bisglycinate (Gentle Iron)',
      description: 'Ferro bisglicinato gentil para energia e prevenção da anemia.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '19.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Prevenção anemia', 'Ferro gentil', 'Hipoalergênico'],
      features: ['Ferro bisglicinato', 'Hipoalergênico', 'Sem efeitos colaterais', 'Alta absorção'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['fadiga', 'ferro', 'anemia', 'energia'],
      priority_score: 93
    },
    {
      name: 'Pure Encapsulations B-Complex (Energy)',
      description: 'Complexo B para energia e metabolismo celular.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '24.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Metabolismo celular', 'Complexo B', 'Hipoalergênico'],
      features: ['Complexo B', 'Hipoalergênico', 'Sem aditivos', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['fadiga', 'complexo b', 'energia', 'metabolismo'],
      priority_score: 90
    },
    {
      name: 'Life Extension NAD+ (Cellular Energy)',
      description: 'NAD+ para energia celular e longevidade.',
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
      current_price: '39.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia celular', 'Longevidade', 'NAD+', 'Antienvelhecimento'],
      features: ['NAD+', 'Padronizado', 'Alta qualidade', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['fadiga', 'nad+', 'celular', 'longevidade'],
      priority_score: 88
    },
    {
      name: 'NOW Foods Tyrosine 500mg (Mental Energy)',
      description: 'Tirosina para energia mental e foco.',
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
      current_price: '13.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia mental', 'Foco', 'Tirosina', 'Neurotransmissor'],
      features: ['500mg Tirosina', 'Padronizada', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['fadiga', 'tirosina', 'mental', 'foco'],
      priority_score: 86
    },
    {
      name: 'Thorne PQQ (Pyrroloquinoline Quinone)',
      description: 'PQQ para energia mitocondrial e função cognitiva.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '32.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia mitocondrial', 'Função cognitiva', 'PQQ', 'Hipoalergênico'],
      features: ['PQQ', 'Hipoalergênico', 'Sem aditivos', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['fadiga', 'pqq', 'mitocondrial', 'cognitiva'],
      priority_score: 87
    }
  ],

  'utensilios': [
    {
      name: 'Digital Kitchen Scale (Precision Weighing)',
      description: 'Balança digital de cozinha para medições precisas. Essencial para brasileiras que cozinham saudável.',
      amazon_url: 'https://www.amazon.com/dp/B07HFJJ49P',
      current_price: '24.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Medições precisas', 'Cozinha saudável', 'Digital', 'Precisão'],
      features: ['Balança digital', 'Precisão', 'Fácil uso', 'Durabilidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['utensilios', 'balança', 'precisão', 'cozinha'],
      priority_score: 89
    },
    {
      name: 'Stainless Steel Measuring Cups & Spoons Set',
      description: 'Conjunto de xícaras e colheres de aço inoxidável para medições precisas.',
      amazon_url: 'https://www.amazon.com/dp/B07H3QRCZD',
      current_price: '18.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Medições precisas', 'Aço inoxidável', 'Conjunto completo', 'Durabilidade'],
      features: ['Aço inoxidável', 'Conjunto completo', 'Precisão', 'Fácil limpeza'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['utensilios', 'medidas', 'aço inoxidável', 'precisão'],
      priority_score: 87
    },
    {
      name: 'High-Speed Blender (Nutrient Extraction)',
      description: 'Liquidificador de alta velocidade para extração máxima de nutrientes.',
      amazon_url: 'https://www.amazon.com/dp/B0DDWDP59L',
      current_price: '89.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Extração nutrientes', 'Alta velocidade', 'Smoothies', 'Saúde'],
      features: ['Alta velocidade', 'Extração máxima', 'Fácil limpeza', 'Durabilidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['utensilios', 'liquidificador', 'nutrientes', 'smoothies'],
      priority_score: 91
    },
    {
      name: 'Food Processor (Healthy Meal Prep)',
      description: 'Processador de alimentos para preparo saudável de refeições.',
      amazon_url: 'https://www.amazon.com/dp/B0FKHLZK24',
      current_price: '79.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Preparo saudável', 'Refeições', 'Processamento', 'Saúde'],
      features: ['Processamento', 'Fácil uso', 'Fácil limpeza', 'Durabilidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['utensilios', 'processador', 'refeições', 'saudável'],
      priority_score: 85
    },
    {
      name: 'Glass Storage Containers (Meal Prep)',
      description: 'Recipientes de vidro para armazenamento saudável de refeições.',
      amazon_url: 'https://www.amazon.com/dp/B0CHMMDNVV',
      current_price: '34.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Armazenamento saudável', 'Vidro', 'Refeições', 'Segurança'],
      features: ['Vidro', 'Segurança', 'Fácil limpeza', 'Durabilidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['utensilios', 'recipientes', 'vidro', 'armazenamento'],
      priority_score: 83
    }
  ],

  'snacks': [
    {
      name: 'Organic Almonds (Raw, Unsalted)',
      description: 'Amêndoas orgânicas cruas sem sal. Snack saudável rico em proteínas e gorduras boas.',
      amazon_url: 'https://www.amazon.com/dp/B008U5OSTQ',
      current_price: '12.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Proteínas', 'Gorduras boas', 'Orgânico', 'Sem sal'],
      features: ['Orgânico', 'Cru', 'Sem sal', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['snacks', 'amêndoas', 'orgânico', 'proteínas'],
      priority_score: 90
    },
    {
      name: 'Organic Walnuts (Raw, Unsalted)',
      description: 'Nozes orgânicas cruas sem sal. Rico em ômega-3 e antioxidantes.',
      amazon_url: 'https://www.amazon.com/dp/B000VTWD64',
      current_price: '14.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Ômega-3', 'Antioxidantes', 'Orgânico', 'Sem sal'],
      features: ['Orgânico', 'Cru', 'Sem sal', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['snacks', 'nozes', 'ômega 3', 'antioxidantes'],
      priority_score: 88
    },
    {
      name: 'Organic Chia Seeds (Superfood)',
      description: 'Sementes de chia orgânicas. Superalimento rico em fibras e ômega-3.',
      amazon_url: 'https://www.amazon.com/dp/B074HJF6KM',
      current_price: '9.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Fibras', 'Ômega-3', 'Superalimento', 'Orgânico'],
      features: ['Orgânico', 'Superalimento', 'Alta qualidade', 'Natural'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['snacks', 'chia', 'superalimento', 'fibras'],
      priority_score: 92
    },
    {
      name: 'Organic Pumpkin Seeds (Raw)',
      description: 'Sementes de abóbora orgânicas cruas. Rico em magnésio e zinco.',
      amazon_url: 'https://www.amazon.com/dp/B011LVDECM',
      current_price: '11.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Magnésio', 'Zinco', 'Orgânico', 'Cru'],
      features: ['Orgânico', 'Cru', 'Alta qualidade', 'Natural'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['snacks', 'abóbora', 'magnésio', 'zinco'],
      priority_score: 86
    },
    {
      name: 'Organic Dark Chocolate (85% Cacao)',
      description: 'Chocolate escuro orgânico 85% cacau. Antioxidantes e flavonoides.',
      amazon_url: 'https://www.amazon.com/dp/B0B8LQMP4R',
      current_price: '8.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Antioxidantes', 'Flavonoides', '85% cacau', 'Orgânico'],
      features: ['85% cacau', 'Orgânico', 'Alta qualidade', 'Natural'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['snacks', 'chocolate', 'antioxidantes', 'cacau'],
      priority_score: 84
    }
  ],

  'cozinha': [
    {
      name: 'Extra Virgin Olive Oil (Cold Pressed)',
      description: 'Azeite extra virgem prensado a frio. Gordura saudável para cozinha brasileira.',
      amazon_url: 'https://www.amazon.com/dp/B011LVDECM',
      current_price: '19.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Gordura saudável', 'Prensado a frio', 'Extra virgem', 'Antioxidantes'],
      features: ['Extra virgem', 'Prensado a frio', 'Alta qualidade', 'Natural'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['cozinha', 'azeite', 'gordura saudável', 'antioxidantes'],
      priority_score: 91
    },
    {
      name: 'Coconut Oil (Organic, Unrefined)',
      description: 'Óleo de coco orgânico não refinado. Ideal para cozinha saudável.',
      amazon_url: 'https://www.amazon.com/dp/B011LVDECM',
      current_price: '15.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Gordura saudável', 'Orgânico', 'Não refinado', 'MCT'],
      features: ['Orgânico', 'Não refinado', 'Alta qualidade', 'Natural'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['cozinha', 'óleo coco', 'orgânico', 'mct'],
      priority_score: 89
    },
    {
      name: 'Sea Salt (Himalayan Pink)',
      description: 'Sal rosa do Himalaia. Sal natural rico em minerais.',
      amazon_url: 'https://www.amazon.com/dp/B074PY8734',
      current_price: '12.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Minerais', 'Natural', 'Sal rosa', 'Himalaia'],
      features: ['Himalaia', 'Natural', 'Minerais', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['cozinha', 'sal', 'himalaia', 'minerais'],
      priority_score: 87
    },
    {
      name: 'Organic Turmeric Powder (Curcumin)',
      description: 'Açafrão orgânico em pó. Anti-inflamatório natural para cozinha saudável.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '9.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Anti-inflamatório', 'Curcumina', 'Orgânico', 'Natural'],
      features: ['Orgânico', 'Curcumina', 'Alta qualidade', 'Natural'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['cozinha', 'açafrão', 'anti-inflamatório', 'curcumina'],
      priority_score: 85
    },
    {
      name: 'Organic Cinnamon Powder (Ceylon)',
      description: 'Canela orgânica do Ceilão. Controle do açúcar e sabor natural.',
      amazon_url: 'https://www.amazon.com/dp/B0CKY26DQQ',
      current_price: '7.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Controle açúcar', 'Sabor natural', 'Orgânico', 'Ceilão'],
      features: ['Ceilão', 'Orgânico', 'Alta qualidade', 'Natural'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['cozinha', 'canela', 'açúcar', 'ceilão'],
      priority_score: 83
    }
  ]
};

async function addFinalProducts() {
  console.log('🎯 Iniciando adição dos produtos finais para completar 100+...');

  let totalAdded = 0;
  let totalErrors = 0;

  for (const [categoryId, products] of Object.entries(finalProducts)) {
    console.log(`\n📦 Processando categoria: ${categoryId}`);
    console.log(`📊 Produtos para adicionar: ${products.length}`);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      try {
        // Gerar ID único e slug para o produto
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substr(2, 5);
        const productId = `final-${categoryId}-${timestamp}-${randomSuffix}`;
        
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
        await new Promise(resolve => setTimeout(resolve, 200));

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
    console.log('\n🎉 Produtos finais adicionados com sucesso!');
    console.log('💡 Acesse /admin-produtos para visualizar e gerenciar os produtos.');
  }
}

// Executar o script
addFinalProducts().catch(console.error);
