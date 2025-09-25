require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Produtos curados de alta qualidade por categoria - Focados em brasileiras nos EUA
const curatedProducts = {
  'energia': [
    {
      name: 'NOW Foods Vitamin D3 5000 IU (Non-GMO, Gluten Free)',
      description: 'Vitamina D3 de alta potência para energia e saúde óssea. Ideal para brasileiras que têm menos exposição ao sol nos EUA. Sem glúten, não-GMO.',
      amazon_url: 'https://amazon.com/dp/B0019GW0S8',
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
      name: 'Thorne Basic Nutrients 2/Day (Hypoallergenic)',
      description: 'Multivitamínico premium hipoalergênico com nutrientes essenciais. Formulado para pessoas sensíveis, sem glúten, sem lactose.',
      amazon_url: 'https://amazon.com/dp/B0019GW0S9',
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
      name: 'Nature Made Iron 65mg (Gentle on Stomach)',
      description: 'Suplemento de ferro gentil para o estômago, ideal para brasileiras com anemia. Sem glúten, sem lactose.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SA',
      current_price: '8.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Combate anemia', 'Gentil no estômago', 'Sem glúten'],
      features: ['65mg ferro', 'Gentil', 'Sem constipação', 'Sem lactose'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'ferro', 'anemia', 'gentil'],
      priority_score: 88
    },
    {
      name: 'Garden of Life Vitamin B Complex (Organic, Non-GMO)',
      description: 'Complexo B orgânico e não-GMO para energia e metabolismo. Perfeito para brasileiras que preferem produtos naturais.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SB',
      current_price: '24.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Metabolismo', 'Orgânico', 'Não-GMO'],
      features: ['Complexo B completo', 'Orgânico', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'vitamina b', 'orgânico', 'natural'],
      priority_score: 90
    },
    {
      name: 'Pure Encapsulations Magnesium Glycinate (Hypoallergenic)',
      description: 'Magnésio quelado hipoalergênico para relaxamento muscular e energia. Sem glúten, sem lactose, sem aditivos.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SC',
      current_price: '18.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Relaxamento muscular', 'Hipoalergênico', 'Sem glúten'],
      features: ['Magnésio quelado', 'Hipoalergênico', 'Sem aditivos', 'Sem lactose'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'magnésio', 'hipoalergênico', 'relaxamento'],
      priority_score: 87
    },
    {
      name: 'Jarrow Formulas CoQ10 100mg (Ubiquinol, Non-GMO)',
      description: 'CoQ10 Ubiquinol não-GMO para energia celular e saúde cardiovascular. Forma mais absorvível, sem glúten.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SD',
      current_price: '22.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia celular', 'Saúde cardiovascular', 'Ubiquinol', 'Não-GMO'],
      features: ['100mg CoQ10', 'Ubiquinol', 'Não-GMO', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'coq10', 'ubiquinol', 'cardiovascular'],
      priority_score: 89
    },
    {
      name: 'Life Extension Super Omega-3 (IFOS Certified)',
      description: 'Ômega-3 certificado IFOS para energia e inflamação. Puro, sem metais pesados, sem glúten.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SE',
      current_price: '29.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Anti-inflamatório', 'Certificado IFOS', 'Sem glúten'],
      features: ['Alta concentração', 'Certificado IFOS', 'Sem metais pesados', 'Puro'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'ômega 3', 'certificado', 'inflamação'],
      priority_score: 91
    },
    {
      name: 'Solaray Zinc Picolinate 30mg (Chelated, Non-GMO)',
      description: 'Zinco quelado não-GMO para imunidade e energia. Forma mais absorvível, sem glúten, sem lactose.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SF',
      current_price: '14.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Imunidade', 'Energia', 'Zinco quelado', 'Não-GMO'],
      features: ['Zinco quelado', '30mg', 'Não-GMO', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'zinco', 'quelado', 'imunidade'],
      priority_score: 86
    },
    {
      name: 'NOW Foods Rhodiola 500mg (Standardized, Non-GMO)',
      description: 'Rhodiola rosea padronizada não-GMO para energia adaptogênica. Ideal para brasileiras com estresse nos EUA.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SG',
      current_price: '16.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia adaptogênica', 'Resistência ao estresse', 'Não-GMO', 'Padronizada'],
      features: ['500mg Rhodiola', 'Padronizada', 'Não-GMO', 'Adaptogênico'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'rhodiola', 'adaptogênico', 'estresse'],
      priority_score: 88
    },
    {
      name: 'Thorne Creatine Monohydrate (Pure, Non-GMO)',
      description: 'Creatina monohidratada pura não-GMO para energia muscular. Sem aditivos, sem glúten, sem lactose.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SH',
      current_price: '19.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia muscular', 'Força', 'Pura', 'Não-GMO'],
      features: ['Creatina pura', 'Não-GMO', 'Sem aditivos', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['energia', 'creatina', 'pura', 'força'],
      priority_score: 87
    }
  ],
  
  'sono': [
    {
      name: 'Thorne Magnesium Bisglycinate',
      description: 'Magnésio bisglicinato para relaxamento profundo e qualidade do sono.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SI',
      current_price: '21.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento', 'Sono profundo', 'Recuperação muscular'],
      features: ['Magnésio quelado', 'Sem efeitos colaterais', 'Alta absorção'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'magnésio', 'relaxamento'],
      priority_score: 94
    },
    {
      name: 'NOW Foods Melatonin 3mg',
      description: 'Melatonina para regular o ciclo do sono e melhorar a qualidade do descanso.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SJ',
      current_price: '9.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Regulação do sono', 'Qualidade do descanso', 'Ciclo circadiano'],
      features: ['3mg melatonina', 'Rápida absorção', 'Sem dependência'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'melatonina', 'ciclo circadiano'],
      priority_score: 92
    },
    {
      name: 'Pure Encapsulations L-Theanine 200mg',
      description: 'L-teanina para relaxamento mental, redução da ansiedade e sono tranquilo.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SK',
      current_price: '15.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento mental', 'Redução da ansiedade', 'Sono tranquilo'],
      features: ['200mg L-teanina', 'Pura', 'Sem cafeína'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'l-teanina', 'ansiedade'],
      priority_score: 90
    },
    {
      name: 'Life Extension GABA 500mg',
      description: 'GABA para relaxamento natural, redução do estresse e sono reparador.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SL',
      current_price: '12.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento natural', 'Redução do estresse', 'Sono reparador'],
      features: ['500mg GABA', 'Neurotransmissor', 'Relaxamento'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'gaba', 'estresse'],
      priority_score: 88
    },
    {
      name: 'NOW Foods Valerian Root 500mg',
      description: 'Raiz de valeriana para relaxamento profundo e sono natural sem dependência.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SM',
      current_price: '11.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento profundo', 'Sono natural', 'Sem dependência'],
      features: ['500mg valeriana', 'Extrato padronizado', 'Tradicional'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'valeriana', 'natural'],
      priority_score: 86
    },
    {
      name: 'Thorne Sleep Support',
      description: 'Fórmula completa para suporte do sono com magnésio, melatonina e ervas relaxantes.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SN',
      current_price: '28.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte completo do sono', 'Relaxamento', 'Qualidade do descanso'],
      features: ['Fórmula completa', 'Ingredientes sinérgicos', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'suporte', 'completo'],
      priority_score: 93
    },
    {
      name: 'Pure Encapsulations 5-HTP 100mg',
      description: '5-HTP para produção de serotonina, humor e qualidade do sono.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SO',
      current_price: '18.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Produção de serotonina', 'Humor', 'Qualidade do sono'],
      features: ['100mg 5-HTP', 'Precursor da serotonina', 'Bem absorvido'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', '5-htp', 'serotonina'],
      priority_score: 89
    },
    {
      name: 'NOW Foods Chamomile 400mg',
      description: 'Camomila para relaxamento suave, redução da ansiedade e sono tranquilo.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SP',
      current_price: '8.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento suave', 'Redução da ansiedade', 'Sono tranquilo'],
      features: ['400mg camomila', 'Extrato padronizado', 'Tradicional'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'camomila', 'relaxamento'],
      priority_score: 85
    },
    {
      name: 'Life Extension Optimized Curcumin',
      description: 'Curcumina otimizada para redução da inflamação e melhora da qualidade do sono.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SQ',
      current_price: '24.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Anti-inflamatório', 'Qualidade do sono', 'Saúde geral'],
      features: ['Curcumina otimizada', 'Alta absorção', 'Padronizada'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'curcumina', 'inflamação'],
      priority_score: 87
    },
    {
      name: 'Thorne Phosphatidylserine 100mg',
      description: 'Fosfatidilserina para redução do cortisol, estresse e melhora do sono.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SR',
      current_price: '32.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Redução do cortisol', 'Estresse', 'Melhora do sono'],
      features: ['100mg PS', 'Alta qualidade', 'Bem absorvido'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['sono', 'fosfatidilserina', 'cortisol'],
      priority_score: 91
    }
  ],

  'imunidade': [
    {
      name: 'NOW Foods Vitamin C 1000mg',
      description: 'Vitamina C de alta potência para fortalecimento do sistema imunológico.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SS',
      current_price: '13.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Sistema imunológico', 'Antioxidante', 'Saúde geral'],
      features: ['1000mg vitamina C', 'Não-ácida', 'Bem tolerada'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'vitamina c', 'antioxidante'],
      priority_score: 95
    },
    {
      name: 'Thorne Vitamin D/K2',
      description: 'Vitamina D3 com K2 para imunidade, saúde óssea e cardiovascular.',
      amazon_url: 'https://amazon.com/dp/B0019GW0ST',
      current_price: '26.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Imunidade', 'Saúde óssea', 'Cardiovascular'],
      features: ['D3 + K2', 'Sinergia', 'Alta absorção'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'vitamina d', 'k2'],
      priority_score: 93
    },
    {
      name: 'Pure Encapsulations Zinc Picolinate',
      description: 'Zinco quelado para função imunológica, cicatrização e saúde celular.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SU',
      current_price: '16.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Função imunológica', 'Cicatrização', 'Saúde celular'],
      features: ['Zinco quelado', 'Alta absorção', 'Bem tolerado'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'zinco', 'cicatrização'],
      priority_score: 92
    },
    {
      name: 'Life Extension Immune Support',
      description: 'Fórmula completa para suporte imunológico com vitaminas e minerais essenciais.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SV',
      current_price: '19.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte imunológico', 'Defesas naturais', 'Saúde geral'],
      features: ['Fórmula completa', 'Ingredientes sinérgicos', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'suporte', 'defesas'],
      priority_score: 90
    },
    {
      name: 'NOW Foods Elderberry Extract',
      description: 'Extrato de sabugueiro para fortalecimento natural do sistema imunológico.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SW',
      current_price: '14.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Sistema imunológico', 'Antioxidante', 'Natural'],
      features: ['Extrato padronizado', 'Alta concentração', 'Tradicional'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'sabugueiro', 'natural'],
      priority_score: 88
    },
    {
      name: 'Thorne Quercetin Phytosome',
      description: 'Quercetina fitossoma para função imunológica e redução da inflamação.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SX',
      current_price: '29.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Função imunológica', 'Anti-inflamatório', 'Antioxidante'],
      features: ['Quercetina fitossoma', 'Alta absorção', 'Padronizada'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'quercetina', 'inflamação'],
      priority_score: 91
    },
    {
      name: 'Pure Encapsulations Probiotic 50B',
      description: 'Probióticos de alta potência para saúde intestinal e sistema imunológico.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SY',
      current_price: '34.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Saúde intestinal', 'Sistema imunológico', 'Digestão'],
      features: ['50 bilhões CFU', 'Múltiplas cepas', 'Estável'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'probióticos', 'intestinal'],
      priority_score: 94
    },
    {
      name: 'NOW Foods Echinacea 400mg',
      description: 'Equinácea para fortalecimento natural das defesas imunológicas.',
      amazon_url: 'https://amazon.com/dp/B0019GW0SZ',
      current_price: '10.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Defesas imunológicas', 'Natural', 'Tradicional'],
      features: ['400mg equinácea', 'Extrato padronizado', 'Bem tolerada'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'equinácea', 'defesas'],
      priority_score: 86
    },
    {
      name: 'Life Extension Beta Glucan',
      description: 'Beta-glucano para ativação do sistema imunológico e defesas naturais.',
      amazon_url: 'https://amazon.com/dp/B0019GW0T0',
      current_price: '22.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Ativação imunológica', 'Defesas naturais', 'Saúde geral'],
      features: ['Beta-glucano puro', 'Alta qualidade', 'Bem absorvido'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'beta-glucano', 'ativação'],
      priority_score: 89
    },
    {
      name: 'Thorne NAC 600mg',
      description: 'N-acetilcisteína para função imunológica, antioxidante e saúde pulmonar.',
      amazon_url: 'https://amazon.com/dp/B0019GW0T1',
      current_price: '18.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Função imunológica', 'Antioxidante', 'Saúde pulmonar'],
      features: ['600mg NAC', 'Alta qualidade', 'Bem absorvido'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['imunidade', 'nac', 'antioxidante'],
      priority_score: 87
    }
  ],

  'digestao': [
    {
      name: 'Pure Encapsulations Probiotic 50B (Multi-Strain)',
      description: 'Probióticos de alta potência com múltiplas cepas para saúde intestinal. Essencial para brasileiras com mudança de dieta nos EUA.',
      amazon_url: 'https://amazon.com/dp/B0019GW0T2',
      current_price: '34.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Saúde intestinal', 'Digestão', 'Imunidade', 'Múltiplas cepas'],
      features: ['50 bilhões CFU', 'Múltiplas cepas', 'Estável', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['digestão', 'probióticos', 'intestinal', 'múltiplas cepas'],
      priority_score: 94
    },
    {
      name: 'NOW Foods Digestive Enzymes (Full Spectrum)',
      description: 'Enzimas digestivas completas para melhor absorção de nutrientes. Ideal para brasileiras adaptando-se à dieta americana.',
      amazon_url: 'https://amazon.com/dp/B0019GW0T3',
      current_price: '18.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Digestão', 'Absorção de nutrientes', 'Conforto digestivo', 'Enzimas completas'],
      features: ['Espectro completo', 'Alta potência', 'Não-GMO', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['digestão', 'enzimas', 'absorção', 'nutrientes'],
      priority_score: 91
    },
    {
      name: 'Thorne Betaine HCL (Gentle Digestive Support)',
      description: 'Betaina HCL para suporte digestivo gentil. Ajuda na digestão de proteínas e absorção de B12.',
      amazon_url: 'https://amazon.com/dp/B0019GW0T4',
      current_price: '22.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Digestão de proteínas', 'Absorção B12', 'Suporte gentil', 'Hipoalergênico'],
      features: ['Betaina HCL', 'Gentil', 'Hipoalergênico', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['digestão', 'betaina hcl', 'proteínas', 'b12'],
      priority_score: 88
    },
    {
      name: 'Life Extension Advanced Milk Thistle (Liver Support)',
      description: 'Cardo mariano para suporte hepático e detoxificação. Essencial para brasileiras com mudança de hábitos alimentares.',
      amazon_url: 'https://amazon.com/dp/B0019GW0T5',
      current_price: '19.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte hepático', 'Detoxificação', 'Saúde digestiva', 'Antioxidante'],
      features: ['Cardo mariano', 'Padronizado', 'Alta qualidade', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['digestão', 'fígado', 'detox', 'cardo mariano'],
      priority_score: 89
    },
    {
      name: 'Pure Encapsulations DGL (Licorice Root)',
      description: 'DGL (Deglycyrrhizinated Licorice) para conforto digestivo e saúde da mucosa gástrica.',
      amazon_url: 'https://amazon.com/dp/B0019GW0T6',
      current_price: '16.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Conforto digestivo', 'Mucosa gástrica', 'Suporte natural', 'Hipoalergênico'],
      features: ['DGL', 'Hipoalergênico', 'Sem aditivos', 'Bem tolerado'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['digestão', 'dgl', 'conforto', 'mucosa'],
      priority_score: 87
    },
    {
      name: 'NOW Foods Psyllium Husk (Fiber Supplement)',
      description: 'Psyllium para fibra solúvel e saúde intestinal. Ajuda na regularidade e saciedade.',
      amazon_url: 'https://amazon.com/dp/B0019GW0T7',
      current_price: '12.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Fibra solúvel', 'Regularidade', 'Saciedade', 'Saúde intestinal'],
      features: ['Psyllium puro', 'Sem aditivos', 'Não-GMO', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['digestão', 'fibra', 'psyllium', 'regularidade'],
      priority_score: 85
    },
    {
      name: 'Thorne GI-Mend (Gut Repair Formula)',
      description: 'Fórmula completa para reparo intestinal com glutamina, zinco e ervas curativas.',
      amazon_url: 'https://amazon.com/dp/B0019GW0T8',
      current_price: '39.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Reparo intestinal', 'Glutamina', 'Zinco', 'Fórmula completa'],
      features: ['Fórmula completa', 'Hipoalergênico', 'Alta qualidade', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['digestão', 'reparo', 'glutamina', 'intestinal'],
      priority_score: 92
    },
    {
      name: 'Life Extension Curcumin Elite (Bioavailable)',
      description: 'Curcumina de alta biodisponibilidade para inflamação e saúde digestiva.',
      amazon_url: 'https://amazon.com/dp/B0019GW0T9',
      current_price: '24.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Anti-inflamatório', 'Saúde digestiva', 'Alta biodisponibilidade', 'Antioxidante'],
      features: ['Curcumina elite', 'Alta absorção', 'Padronizada', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['digestão', 'curcumina', 'inflamação', 'biodisponível'],
      priority_score: 90
    },
    {
      name: 'NOW Foods Aloe Vera (Inner Leaf)',
      description: 'Aloe vera da folha interna para suporte digestivo suave e conforto intestinal.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TA',
      current_price: '14.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte digestivo', 'Conforto intestinal', 'Suave', 'Natural'],
      features: ['Folha interna', 'Puro', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['digestão', 'aloe vera', 'conforto', 'suave'],
      priority_score: 83
    },
    {
      name: 'Pure Encapsulations Zinc Carnosine (Stomach Support)',
      description: 'Zinco carnosine para suporte específico do estômago e mucosa gástrica.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TB',
      current_price: '28.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte gástrico', 'Mucosa gástrica', 'Zinco quelado', 'Hipoalergênico'],
      features: ['Zinco carnosine', 'Hipoalergênico', 'Alta qualidade', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['digestão', 'zinco carnosine', 'estômago', 'mucosa'],
      priority_score: 86
    }
  ],

  'pele-cabelo': [
    {
      name: 'Thorne Biotin-8 (Hair, Skin & Nails)',
      description: 'Biotina de alta potência para cabelo, pele e unhas saudáveis. Essencial para brasileiras que querem manter a beleza.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TC',
      current_price: '26.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Cabelo saudável', 'Pele bonita', 'Unhas fortes', 'Biotina alta'],
      features: ['8mg biotina', 'Hipoalergênico', 'Sem aditivos', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['pele', 'cabelo', 'biotina', 'beleza'],
      priority_score: 93
    },
    {
      name: 'Pure Encapsulations Hyaluronic Acid (Skin Hydration)',
      description: 'Ácido hialurônico para hidratação profunda da pele e redução de linhas finas.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TD',
      current_price: '32.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Hidratação da pele', 'Redução linhas finas', 'Elasticidade', 'Hipoalergênico'],
      features: ['Ácido hialurônico', 'Hipoalergênico', 'Alta qualidade', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['pele', 'hidratação', 'ácido hialurônico', 'elasticidade'],
      priority_score: 91
    },
    {
      name: 'Life Extension Collagen Peptides (Marine)',
      description: 'Colágeno marinho hidrolisado para firmeza da pele, cabelo e unhas.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TE',
      current_price: '29.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Firmeza da pele', 'Cabelo forte', 'Unhas saudáveis', 'Colágeno marinho'],
      features: ['Hidrolisado', 'Marinho', 'Alta absorção', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['pele', 'colágeno', 'marinho', 'firmeza'],
      priority_score: 89
    },
    {
      name: 'NOW Foods MSM (Methylsulfonylmethane)',
      description: 'MSM para saúde da pele, cabelo e redução de inflamação. Essencial para beleza natural.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TF',
      current_price: '15.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Saúde da pele', 'Cabelo saudável', 'Anti-inflamatório', 'Enxofre orgânico'],
      features: ['MSM puro', 'Não-GMO', 'Sem aditivos', 'Bem absorvido'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['pele', 'msm', 'enxofre', 'anti-inflamatório'],
      priority_score: 87
    },
    {
      name: 'Thorne Vitamin C with Flavonoids (Skin Health)',
      description: 'Vitamina C com flavonoides para produção de colágeno e proteção da pele contra radicais livres.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TG',
      current_price: '24.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Produção de colágeno', 'Proteção da pele', 'Antioxidante', 'Flavonoides'],
      features: ['Vitamina C', 'Flavonoides', 'Hipoalergênico', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['pele', 'vitamina c', 'colágeno', 'antioxidante'],
      priority_score: 90
    },
    {
      name: 'Pure Encapsulations Zinc Picolinate (Skin & Hair)',
      description: 'Zinco quelado para saúde da pele, cabelo e cicatrização. Mineral essencial para beleza.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TH',
      current_price: '16.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Saúde da pele', 'Cabelo forte', 'Cicatrização', 'Zinco quelado'],
      features: ['Zinco quelado', 'Hipoalergênico', 'Alta absorção', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['pele', 'zinco', 'cabelo', 'cicatrização'],
      priority_score: 88
    },
    {
      name: 'Life Extension Tocotrienols (Vitamin E)',
      description: 'Tocotrienóis (vitamina E) para proteção da pele contra danos do sol e envelhecimento.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TI',
      current_price: '21.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Proteção solar', 'Anti-envelhecimento', 'Antioxidante', 'Tocotrienóis'],
      features: ['Tocotrienóis', 'Proteção UV', 'Antioxidante', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['pele', 'vitamina e', 'proteção solar', 'antioxidante'],
      priority_score: 86
    },
    {
      name: 'NOW Foods Silica (Horsetail Extract)',
      description: 'Silício de cavalinha para cabelo forte, unhas saudáveis e pele firme.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TJ',
      current_price: '13.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Cabelo forte', 'Unhas saudáveis', 'Pele firme', 'Silício natural'],
      features: ['Extrato cavalinha', 'Silício', 'Natural', 'Não-GMO'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['pele', 'silício', 'cabelo', 'cavalinha'],
      priority_score: 84
    },
    {
      name: 'Thorne Omega-3 (EPA/DHA for Skin)',
      description: 'Ômega-3 EPA/DHA para hidratação da pele, redução de inflamação e saúde capilar.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TK',
      current_price: '27.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Hidratação da pele', 'Saúde capilar', 'Anti-inflamatório', 'EPA/DHA'],
      features: ['EPA/DHA', 'Hipoalergênico', 'Alta qualidade', 'Sem metais pesados'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['pele', 'ômega 3', 'epa dha', 'hidratação'],
      priority_score: 85
    },
    {
      name: 'Pure Encapsulations Resveratrol (Anti-Aging)',
      description: 'Resveratrol para proteção anti-envelhecimento da pele e longevidade celular.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TL',
      current_price: '35.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Anti-envelhecimento', 'Proteção da pele', 'Longevidade', 'Resveratrol'],
      features: ['Resveratrol', 'Hipoalergênico', 'Alta qualidade', 'Padronizado'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['pele', 'resveratrol', 'anti-envelhecimento', 'longevidade'],
      priority_score: 92
    }
  ],

  'hormonios': [
    {
      name: 'Thorne DIM (Diindolylmethane)',
      description: 'DIM para equilíbrio hormonal feminino e metabolismo de estrogênio. Essencial para mulheres brasileiras.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TM',
      current_price: '28.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Equilíbrio hormonal', 'Metabolismo estrogênio', 'Saúde feminina', 'DIM'],
      features: ['DIM puro', 'Hipoalergênico', 'Alta qualidade', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormônios', 'dim', 'estrogênio', 'feminino'],
      priority_score: 94
    },
    {
      name: 'Pure Encapsulations Vitex (Chasteberry)',
      description: 'Vitex (agnus castus) para equilíbrio hormonal feminino e regulação do ciclo menstrual.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TN',
      current_price: '22.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Equilíbrio hormonal', 'Ciclo menstrual', 'Vitex', 'Saúde feminina'],
      features: ['Vitex', 'Hipoalergênico', 'Padronizado', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormônios', 'vitex', 'ciclo menstrual', 'feminino'],
      priority_score: 91
    },
    {
      name: 'Life Extension Maca Root (Peruvian)',
      description: 'Maca peruana para energia, libido e equilíbrio hormonal natural.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TO',
      current_price: '19.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Energia', 'Libido', 'Equilíbrio hormonal', 'Maca peruana'],
      features: ['Maca peruana', 'Padronizada', 'Não-GMO', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormônios', 'maca', 'libido', 'energia'],
      priority_score: 88
    },
    {
      name: 'Thorne Thyroid Support (Iodine & Tyrosine)',
      description: 'Suporte para tireoide com iodo e tirosina para metabolismo e energia.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TP',
      current_price: '31.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte tireoide', 'Metabolismo', 'Energia', 'Iodo e tirosina'],
      features: ['Iodo', 'Tirosina', 'Hipoalergênico', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormônios', 'tireoide', 'iodo', 'metabolismo'],
      priority_score: 89
    },
    {
      name: 'NOW Foods Black Cohosh (Menopause Support)',
      description: 'Black cohosh para suporte durante a menopausa e equilíbrio hormonal.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TQ',
      current_price: '16.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte menopausa', 'Equilíbrio hormonal', 'Black cohosh', 'Natural'],
      features: ['Black cohosh', 'Padronizado', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormônios', 'menopausa', 'black cohosh', 'equilíbrio'],
      priority_score: 87
    },
    {
      name: 'Pure Encapsulations Magnesium Glycinate (Hormonal Balance)',
      description: 'Magnésio quelado para equilíbrio hormonal, redução de estresse e sono.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TR',
      current_price: '18.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Equilíbrio hormonal', 'Redução estresse', 'Sono', 'Magnésio quelado'],
      features: ['Magnésio quelado', 'Hipoalergênico', 'Sem aditivos', 'Alta absorção'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormônios', 'magnésio', 'estresse', 'equilíbrio'],
      priority_score: 85
    },
    {
      name: 'Life Extension Pregnenolone (Hormone Precursor)',
      description: 'Pregnenolona como precursor hormonal para energia, humor e bem-estar.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TS',
      current_price: '24.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Precursor hormonal', 'Energia', 'Humor', 'Bem-estar'],
      features: ['Pregnenolona', 'Padronizada', 'Alta qualidade', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormônios', 'pregnenolona', 'precursor', 'energia'],
      priority_score: 86
    },
    {
      name: 'Thorne Zinc Picolinate (Hormonal Support)',
      description: 'Zinco quelado para suporte hormonal, imunidade e saúde reprodutiva.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TT',
      current_price: '16.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte hormonal', 'Imunidade', 'Saúde reprodutiva', 'Zinco quelado'],
      features: ['Zinco quelado', 'Hipoalergênico', 'Alta absorção', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormônios', 'zinco', 'reprodutiva', 'imunidade'],
      priority_score: 84
    },
    {
      name: 'NOW Foods Evening Primrose Oil (GLA)',
      description: 'Óleo de prímula para ácido gama-linolênico (GLA) e equilíbrio hormonal feminino.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TU',
      current_price: '14.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['GLA', 'Equilíbrio hormonal', 'Saúde feminina', 'Óleo prímula'],
      features: ['GLA', 'Óleo prímula', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormônios', 'gla', 'prímula', 'feminino'],
      priority_score: 83
    },
    {
      name: 'Pure Encapsulations Ashwagandha (Stress & Hormones)',
      description: 'Ashwagandha para redução do cortisol, equilíbrio hormonal e adaptação ao estresse.',
      amazon_url: 'https://amazon.com/dp/B0019GW0TV',
      current_price: '23.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Redução cortisol', 'Equilíbrio hormonal', 'Adaptação estresse', 'Ashwagandha'],
      features: ['Ashwagandha', 'Hipoalergênico', 'Padronizada', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormônios', 'ashwagandha', 'cortisol', 'estresse'],
      priority_score: 90
    }
  ]
};

async function addCuratedProducts() {
  console.log('🎯 Iniciando adição de produtos curados de alta qualidade...');

  let totalAdded = 0;
  let totalErrors = 0;

  for (const [categoryId, products] of Object.entries(curatedProducts)) {
    console.log(`\n📦 Processando categoria: ${categoryId}`);
    console.log(`📊 Produtos para adicionar: ${products.length}`);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      try {
        // Gerar ID único e slug para o produto
        const productId = `${categoryId}-${product.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}-${i}`;
        const slug = product.name.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        
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
    console.log('\n🎉 Produtos curados de alta qualidade adicionados com sucesso!');
    console.log('💡 Acesse /admin-produtos para visualizar e gerenciar os produtos.');
  }
}

// Executar o script
addCuratedProducts().catch(console.error);
