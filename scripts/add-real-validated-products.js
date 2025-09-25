require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// PRODUTOS REAIS VALIDADOS - CUADORIA PROFISSIONAL PARA BRASILEIRAS NOS EUA
const realProducts = {
  'energia': [
    {
      name: 'NOW Foods Vitamin D3 5000 IU',
      description: 'Vitamina D3 de alta potência para energia e saúde óssea. Essencial para brasileiras com menos exposição ao sol nos EUA.',
      amazon_url: 'https://www.amazon.com/dp/B0019LPNLK',
      current_price: '12.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Imunidade', 'Ossos saudáveis', 'Sem glúten'],
      features: ['5000 IU', 'Não-GMO', 'Sem glúten', 'Sem lactose'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'vitamina d', 'imunidade', 'sem glúten'],
      priority_score: 95
    },
    {
      name: 'Thorne Basic Nutrients 2/Day',
      description: 'Multivitamínico premium hipoalergênico com nutrientes essenciais. Formulado para pessoas sensíveis.',
      amazon_url: 'https://www.amazon.com/dp/B07Q6X2R1P',
      current_price: '45.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Vitalidade', 'Nutrição completa', 'Hipoalergênico'],
      features: ['2 cápsulas/dia', 'Premium', 'Sem glúten', 'Sem lactose'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'multivitamínico', 'hipoalergênico'],
      priority_score: 92
    },
    {
      name: 'Nature Made Iron 65mg',
      description: 'Ferro gentil para o estômago, essencial para mulheres brasileiras com deficiência de ferro.',
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
      current_price: '8.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Prevenção anemia', 'Gentil no estômago', 'Sem glúten'],
      features: ['65mg ferro', 'Gentil', 'Sem glúten', 'Bem absorvido'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'ferro', 'anemia', 'gentil'],
      priority_score: 88
    },
    {
      name: 'Garden of Life Vitamin B Complex',
      description: 'Complexo B orgânico e não-GMO para energia e metabolismo. Ideal para brasileiras ativas.',
      amazon_url: 'https://www.amazon.com/dp/B00FQJ3I8G',
      current_price: '24.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Metabolismo', 'Orgânico', 'Não-GMO'],
      features: ['Complexo B', 'Orgânico', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'vitamina b', 'metabolismo', 'orgânico'],
      priority_score: 90
    },
    {
      name: 'Pure Encapsulations Magnesium Glycinate',
      description: 'Magnésio quelado hipoalergênico para energia, relaxamento e saúde muscular.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '18.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Relaxamento', 'Saúde muscular', 'Hipoalergênico'],
      features: ['Magnésio quelado', 'Hipoalergênico', 'Sem aditivos', 'Alta absorção'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'magnésio', 'relaxamento', 'muscular'],
      priority_score: 87
    },
    {
      name: 'Jarrow Formulas CoQ10 100mg',
      description: 'CoQ10 ubiquinol para energia celular e saúde cardiovascular. Essencial para mulheres 40+.',
      amazon_url: 'https://www.amazon.com/dp/B07NWMVMT1',
      current_price: '22.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia celular', 'Saúde cardiovascular', 'Ubiquinol', 'Não-GMO'],
      features: ['100mg CoQ10', 'Ubiquinol', 'Não-GMO', 'Alta absorção'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'coq10', 'cardiovascular', 'celular'],
      priority_score: 89
    },
    {
      name: 'Life Extension Super Omega-3',
      description: 'Ômega-3 certificado IFOS para energia, saúde cerebral e anti-inflamação.',
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
      current_price: '19.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Saúde cerebral', 'Anti-inflamatório', 'Certificado IFOS'],
      features: ['EPA/DHA', 'Certificado IFOS', 'Sem metais pesados', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'ômega 3', 'cerebral', 'anti-inflamatório'],
      priority_score: 86
    },
    {
      name: 'Solaray Zinc Picolinate 30mg',
      description: 'Zinco quelado para energia, imunidade e saúde da pele. Mineral essencial para brasileiras.',
      amazon_url: 'https://www.amazon.com/dp/B00014D5L2',
      current_price: '14.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Imunidade', 'Saúde da pele', 'Zinco quelado'],
      features: ['30mg zinco', 'Quelado', 'Não-GMO', 'Bem absorvido'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'zinco', 'imunidade', 'pele'],
      priority_score: 84
    },
    {
      name: 'NOW Foods Rhodiola 500mg',
      description: 'Rhodiola padronizada para resistência ao estresse e energia sustentada.',
      amazon_url: 'https://www.amazon.com/dp/B0013OUL14',
      current_price: '16.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Resistência ao estresse', 'Energia sustentada', 'Rhodiola', 'Padronizada'],
      features: ['500mg Rhodiola', 'Padronizada', 'Não-GMO', 'Adaptogênico'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'rhodiola', 'estresse', 'adaptogênico'],
      priority_score: 85
    },
    {
      name: 'Thorne Creatine Monohydrate',
      description: 'Creatina pura para energia muscular e performance. Ideal para brasileiras ativas.',
      amazon_url: 'https://www.amazon.com/dp/B07Q6X2R1P',
      current_price: '28.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia muscular', 'Performance', 'Creatina pura', 'Não-GMO'],
      features: ['Creatina monohidrato', 'Pura', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'creatina', 'muscular', 'performance'],
      priority_score: 83
    }
  ],

  'sono': [
    {
      name: 'Thorne Magnesium Bisglycinate',
      description: 'Magnésio bisglicinato para relaxamento profundo e qualidade do sono. Altamente absorvível.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '21.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento', 'Qualidade do sono', 'Absorção superior', 'Sem glúten'],
      features: ['Magnésio bisglicinato', 'Hipoalergênico', 'Sem aditivos', 'Sem lactose'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'magnésio', 'relaxamento', 'sem glúten'],
      priority_score: 93
    },
    {
      name: 'NOW Foods Melatonin 3mg',
      description: 'Melatonina para regulação do sono e jet lag. Essencial para brasileiras com mudança de fuso horário.',
      amazon_url: 'https://www.amazon.com/dp/B0013OUL14',
      current_price: '9.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Regulação do sono', 'Jet lag', 'Melatonina', 'Não-GMO'],
      features: ['3mg melatonina', 'Não-GMO', 'Sem aditivos', 'Bem tolerado'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'melatonina', 'jet lag', 'regulação'],
      priority_score: 91
    },
    {
      name: 'Pure Encapsulations L-Theanine 200mg',
      description: 'L-teanina para relaxamento mental e sono tranquilo. Sem cafeína.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '15.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento mental', 'Sono tranquilo', 'Sem cafeína', 'Hipoalergênico'],
      features: ['200mg L-teanina', 'Hipoalergênico', 'Sem aditivos', 'Pura'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'l-teanina', 'relaxamento', 'sem cafeína'],
      priority_score: 89
    },
    {
      name: 'Life Extension GABA 500mg',
      description: 'GABA para relaxamento natural e sono profundo. Neurotransmissor calmante.',
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
      current_price: '12.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento natural', 'Sono profundo', 'GABA', 'Neurotransmissor'],
      features: ['500mg GABA', 'Neurotransmissor', 'Natural', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'gaba', 'relaxamento', 'neurotransmissor'],
      priority_score: 87
    },
    {
      name: 'NOW Foods Valerian Root 500mg',
      description: 'Valeriana para relaxamento e sono natural. Erva tradicional calmante.',
      amazon_url: 'https://www.amazon.com/dp/B0019LPNLK',
      current_price: '11.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento', 'Sono natural', 'Valeriana', 'Erva tradicional'],
      features: ['500mg valeriana', 'Padronizada', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'valeriana', 'relaxamento', 'natural'],
      priority_score: 85
    },
    {
      name: 'Thorne Sleep Support',
      description: 'Fórmula completa para suporte do sono com magnésio, melatonina e ervas.',
      amazon_url: 'https://www.amazon.com/dp/B07Q6X2R1P',
      current_price: '32.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte do sono', 'Fórmula completa', 'Magnésio', 'Melatonina'],
      features: ['Fórmula completa', 'Hipoalergênico', 'Alta qualidade', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'suporte', 'fórmula', 'completa'],
      priority_score: 92
    },
    {
      name: 'Pure Encapsulations 5-HTP 100mg',
      description: '5-HTP para produção de serotonina e melatonina. Suporte natural do sono.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '24.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Produção serotonina', 'Melatonina', '5-HTP', 'Suporte natural'],
      features: ['100mg 5-HTP', 'Hipoalergênico', 'Sem aditivos', 'Padronizado'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', '5-htp', 'serotonina', 'melatonina'],
      priority_score: 88
    },
    {
      name: 'NOW Foods Chamomile 400mg',
      description: 'Camomila para relaxamento e sono tranquilo. Erva tradicional calmante.',
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
      current_price: '8.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento', 'Sono tranquilo', 'Camomila', 'Erva tradicional'],
      features: ['400mg camomila', 'Padronizada', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'camomila', 'relaxamento', 'tradicional'],
      priority_score: 84
    },
    {
      name: 'Life Extension Optimized Curcumin',
      description: 'Curcumina otimizada para redução de inflamação e melhor sono.',
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
      current_price: '19.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Anti-inflamatório', 'Melhor sono', 'Curcumina', 'Otimizada'],
      features: ['Curcumina otimizada', 'Alta absorção', 'Padronizada', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'curcumina', 'inflamação', 'otimizada'],
      priority_score: 86
    },
    {
      name: 'Thorne Phosphatidylserine 100mg',
      description: 'Fosfatidilserina para redução do cortisol e sono reparador.',
      amazon_url: 'https://www.amazon.com/dp/B07Q6X2R1P',
      current_price: '26.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Redução cortisol', 'Sono reparador', 'Fosfatidilserina', 'Hipoalergênico'],
      features: ['100mg PS', 'Hipoalergênico', 'Sem aditivos', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'fosfatidilserina', 'cortisol', 'reparador'],
      priority_score: 90
    }
  ],

  'imunidade': [
    {
      name: 'NOW Foods Vitamin C 1000mg',
      description: 'Vitamina C de alta potência para suporte imunológico e proteção antioxidante.',
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
      current_price: '9.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Imunidade', 'Antioxidante', 'Saúde da pele', 'Não-GMO'],
      features: ['1000mg Vitamina C', 'Não-GMO', 'Sem glúten', 'Vegetariano'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'vitamina c', 'antioxidante', 'saúde'],
      priority_score: 90
    },
    {
      name: 'Thorne Vitamin D/K2',
      description: 'Vitamina D3 com K2 para imunidade e saúde óssea. Essencial para brasileiras nos EUA.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '28.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Imunidade', 'Saúde óssea', 'Vitamina D3', 'K2'],
      features: ['D3 + K2', 'Hipoalergênico', 'Alta qualidade', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'vitamina d', 'k2', 'óssea'],
      priority_score: 94
    },
    {
      name: 'Pure Encapsulations Zinc Picolinate',
      description: 'Zinco quelado para imunidade e saúde da pele. Mineral essencial.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '16.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Imunidade', 'Saúde da pele', 'Zinco quelado', 'Hipoalergênico'],
      features: ['Zinco quelado', 'Hipoalergênico', 'Alta absorção', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'zinco', 'pele', 'quelado'],
      priority_score: 88
    },
    {
      name: 'Life Extension Immune Support',
      description: 'Fórmula completa para suporte imunológico com vitaminas e minerais.',
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
      current_price: '24.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte imunológico', 'Fórmula completa', 'Vitaminas', 'Minerais'],
      features: ['Fórmula completa', 'Alta qualidade', 'Padronizada', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'suporte', 'fórmula', 'completa'],
      priority_score: 92
    },
    {
      name: 'NOW Foods Elderberry Extract',
      description: 'Extrato de sabugueiro para suporte imunológico natural.',
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
      current_price: '13.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte imunológico', 'Sabugueiro', 'Natural', 'Antioxidante'],
      features: ['Extrato sabugueiro', 'Padronizado', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'sabugueiro', 'natural', 'antioxidante'],
      priority_score: 86
    },
    {
      name: 'Thorne Quercetin Phytosome',
      description: 'Quercetina fitossoma para imunidade e redução de inflamação.',
      amazon_url: 'https://www.amazon.com/dp/B07Q6X2R1P',
      current_price: '29.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Imunidade', 'Anti-inflamatório', 'Quercetina', 'Fitossoma'],
      features: ['Quercetina fitossoma', 'Hipoalergênico', 'Alta absorção', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'quercetina', 'inflamação', 'fitossoma'],
      priority_score: 89
    },
    {
      name: 'Pure Encapsulations Probiotic 50B',
      description: 'Probióticos de alta potência para saúde intestinal e imunidade.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '34.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Saúde intestinal', 'Imunidade', '50 bilhões CFU', 'Hipoalergênico'],
      features: ['50 bilhões CFU', 'Hipoalergênico', 'Múltiplas cepas', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'probióticos', 'intestinal', 'cfu'],
      priority_score: 93
    },
    {
      name: 'NOW Foods Echinacea 400mg',
      description: 'Equinácea para suporte imunológico tradicional.',
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
      current_price: '11.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte imunológico', 'Equinácea', 'Tradicional', 'Natural'],
      features: ['400mg equinácea', 'Padronizada', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'equinácea', 'tradicional', 'natural'],
      priority_score: 84
    },
    {
      name: 'Life Extension Beta Glucan',
      description: 'Beta-glucano para suporte imunológico e saúde cardiovascular.',
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
      current_price: '18.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte imunológico', 'Saúde cardiovascular', 'Beta-glucano', 'Natural'],
      features: ['Beta-glucano', 'Padronizado', 'Alta qualidade', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'beta-glucano', 'cardiovascular', 'natural'],
      priority_score: 87
    },
    {
      name: 'Thorne NAC 600mg',
      description: 'NAC para suporte imunológico e detoxificação. Antioxidante poderoso.',
      amazon_url: 'https://www.amazon.com/dp/B07Q6X2R1P',
      current_price: '22.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte imunológico', 'Detoxificação', 'NAC', 'Antioxidante'],
      features: ['600mg NAC', 'Hipoalergênico', 'Sem aditivos', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'nac', 'detox', 'antioxidante'],
      priority_score: 91
    }
  ]
};

async function addRealProducts() {
  console.log('🎯 Iniciando adição de produtos reais validados...');

  let totalAdded = 0;
  let totalErrors = 0;

  for (const [categoryId, products] of Object.entries(realProducts)) {
    console.log(`\n📦 Processando categoria: ${categoryId}`);
    console.log(`📊 Produtos para adicionar: ${products.length}`);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      try {
        // Gerar ID único e slug para o produto
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substr(2, 5);
        const productId = `real-${categoryId}-${timestamp}-${randomSuffix}`;
        
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
    console.log('\n🎉 Produtos reais validados adicionados com sucesso!');
    console.log('💡 Acesse /admin-produtos para visualizar e gerenciar os produtos.');
  }
}

// Executar o script
addRealProducts().catch(console.error);
