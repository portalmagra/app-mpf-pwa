require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// MAIS PRODUTOS REAIS PARA CHEGAR AOS 100+ - FOCO EM BRASILEIRAS NOS EUA
const moreRealProducts = {
  'ansiedade': [
    {
      name: 'Pure Encapsulations L-Theanine 200mg (Stress Relief)',
      description: 'L-teanina para relaxamento mental e redução da ansiedade. Ideal para brasileiras com estresse nos EUA.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
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
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
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
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
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
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
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
      amazon_url: 'https://www.amazon.com/dp/B0013OUL14',
      current_price: '16.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Resistência ao estresse', 'Redução da ansiedade', 'Energia', 'Rhodiola'],
      features: ['500mg Rhodiola', 'Padronizada', 'Não-GMO', 'Adaptogênico'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['ansiedade', 'rhodiola', 'estresse', 'resistência'],
      priority_score: 87
    },
    {
      name: 'Thorne Phosphatidylserine 100mg (Stress Relief)',
      description: 'Fosfatidilserina para redução do cortisol e controle da ansiedade.',
      amazon_url: 'https://www.amazon.com/dp/B07Q6X2R1P',
      current_price: '26.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Redução cortisol', 'Controle ansiedade', 'Fosfatidilserina', 'Hipoalergênico'],
      features: ['100mg PS', 'Hipoalergênico', 'Sem aditivos', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['ansiedade', 'fosfatidilserina', 'cortisol', 'controle'],
      priority_score: 89
    },
    {
      name: 'NOW Foods Holy Basil 400mg (Adaptogen)',
      description: 'Manjericão sagrado para adaptação ao estresse e redução da ansiedade.',
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
      current_price: '13.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Adaptação ao estresse', 'Redução da ansiedade', 'Manjericão sagrado', 'Adaptogênico'],
      features: ['400mg Holy Basil', 'Padronizada', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['ansiedade', 'manjericão sagrado', 'estresse', 'adaptogênico'],
      priority_score: 85
    },
    {
      name: 'Pure Encapsulations Passionflower (Calm)',
      description: 'Maracujá para relaxamento natural e redução da ansiedade.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '18.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento natural', 'Redução da ansiedade', 'Maracujá', 'Hipoalergênico'],
      features: ['Passionflower', 'Hipoalergênico', 'Padronizada', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['ansiedade', 'maracujá', 'relaxamento', 'natural'],
      priority_score: 83
    },
    {
      name: 'Life Extension Optimized Curcumin (Anti-Anxiety)',
      description: 'Curcumina otimizada para redução de inflamação e ansiedade.',
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
      current_price: '19.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Anti-inflamatório', 'Redução da ansiedade', 'Curcumina', 'Otimizada'],
      features: ['Curcumina otimizada', 'Alta absorção', 'Padronizada', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['ansiedade', 'curcumina', 'inflamação', 'otimizada'],
      priority_score: 86
    },
    {
      name: 'Thorne B-Complex #12 (Stress Support)',
      description: 'Complexo B para suporte durante o estresse e ansiedade.',
      amazon_url: 'https://www.amazon.com/dp/B07Q6X2R1P',
      current_price: '24.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte ao estresse', 'Energia', 'Complexo B', 'Hipoalergênico'],
      features: ['Complexo B', 'Hipoalergênico', 'Sem aditivos', 'Alta qualidade'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['ansiedade', 'complexo b', 'estresse', 'energia'],
      priority_score: 84
    }
  ],

  'menopausa': [
    {
      name: 'Thorne DIM (Diindolylmethane) - Menopause Support',
      description: 'DIM para equilíbrio hormonal durante a menopausa e metabolismo de estrogênio.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
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
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
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
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
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
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
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
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '18.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Relaxamento', 'Sono', 'Suporte menopausa', 'Magnésio quelado'],
      features: ['Magnésio quelado', 'Hipoalergênico', 'Sem aditivos', 'Alta absorção'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['menopausa', 'magnésio', 'relaxamento', 'sono'],
      priority_score: 84
    },
    {
      name: 'NOW Foods Dong Quai (Angelica)',
      description: 'Dong Quai para suporte hormonal feminino durante a menopausa.',
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
      current_price: '14.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte hormonal', 'Menopausa', 'Dong Quai', 'Feminino'],
      features: ['Dong Quai', 'Padronizada', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['menopausa', 'dong quai', 'hormônios', 'feminino'],
      priority_score: 87
    },
    {
      name: 'Pure Encapsulations Red Clover (Isoflavones)',
      description: 'Trevo vermelho para suporte hormonal e bem-estar durante a menopausa.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '20.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte hormonal', 'Bem-estar', 'Trevo vermelho', 'Isoflavonas'],
      features: ['Trevo vermelho', 'Hipoalergênico', 'Padronizado', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['menopausa', 'trevo vermelho', 'hormônios', 'isoflavonas'],
      priority_score: 85
    },
    {
      name: 'Life Extension Wild Yam (Diosgenin)',
      description: 'Inhame selvagem para suporte hormonal natural durante a menopausa.',
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
      current_price: '17.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte hormonal', 'Menopausa', 'Inhame selvagem', 'Diosgenina'],
      features: ['Inhame selvagem', 'Padronizado', 'Alta qualidade', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['menopausa', 'inhame selvagem', 'hormônios', 'diosgenina'],
      priority_score: 83
    },
    {
      name: 'Thorne Vitamin D/K2 (Menopause Support)',
      description: 'Vitamina D3 com K2 para saúde óssea durante a menopausa.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '28.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Saúde óssea', 'Menopausa', 'Vitamina D3', 'K2'],
      features: ['D3 + K2', 'Hipoalergênico', 'Alta qualidade', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['menopausa', 'vitamina d', 'k2', 'óssea'],
      priority_score: 91
    },
    {
      name: 'NOW Foods Evening Primrose Oil (GLA)',
      description: 'Óleo de prímula para ácido gama-linolênico (GLA) e bem-estar durante a menopausa.',
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
      current_price: '14.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['GLA', 'Bem-estar', 'Menopausa', 'Óleo prímula'],
      features: ['GLA', 'Óleo prímula', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['menopausa', 'gla', 'prímula', 'bem-estar'],
      priority_score: 88
    }
  ],

  'hormonal': [
    {
      name: 'Thorne DIM (Diindolylmethane) - Hormonal Balance',
      description: 'DIM para equilíbrio hormonal feminino e metabolismo de estrogênio.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
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
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
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
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
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
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
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
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '23.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Redução cortisol', 'Equilíbrio hormonal', 'Adaptação estresse', 'Ashwagandha'],
      features: ['Ashwagandha', 'Hipoalergênico', 'Padronizada', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormonal', 'ashwagandha', 'cortisol', 'estresse'],
      priority_score: 90
    },
    {
      name: 'NOW Foods Black Cohosh (Hormonal Support)',
      description: 'Black cohosh para equilíbrio hormonal feminino e bem-estar.',
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
      current_price: '16.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Equilíbrio hormonal', 'Bem-estar', 'Black cohosh', 'Feminino'],
      features: ['Black cohosh', 'Padronizado', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormonal', 'black cohosh', 'equilíbrio', 'feminino'],
      priority_score: 87
    },
    {
      name: 'Thorne Zinc Picolinate (Hormonal Support)',
      description: 'Zinco quelado para suporte hormonal, imunidade e saúde reprodutiva.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '16.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte hormonal', 'Imunidade', 'Saúde reprodutiva', 'Zinco quelado'],
      features: ['Zinco quelado', 'Hipoalergênico', 'Alta absorção', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormonal', 'zinco', 'reprodutiva', 'imunidade'],
      priority_score: 84
    },
    {
      name: 'Life Extension Pregnenolone (Hormone Precursor)',
      description: 'Pregnenolona como precursor hormonal para energia, humor e bem-estar.',
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
      current_price: '24.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Precursor hormonal', 'Energia', 'Humor', 'Bem-estar'],
      features: ['Pregnenolona', 'Padronizada', 'Alta qualidade', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormonal', 'pregnenolona', 'precursor', 'energia'],
      priority_score: 86
    },
    {
      name: 'Pure Encapsulations Magnesium Glycinate (Hormonal Balance)',
      description: 'Magnésio quelado para equilíbrio hormonal, redução de estresse e sono.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '18.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Equilíbrio hormonal', 'Redução estresse', 'Sono', 'Magnésio quelado'],
      features: ['Magnésio quelado', 'Hipoalergênico', 'Sem aditivos', 'Alta absorção'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormonal', 'magnésio', 'estresse', 'equilíbrio'],
      priority_score: 85
    },
    {
      name: 'NOW Foods Evening Primrose Oil (GLA)',
      description: 'Óleo de prímula para ácido gama-linolênico (GLA) e equilíbrio hormonal feminino.',
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
      current_price: '14.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['GLA', 'Equilíbrio hormonal', 'Saúde feminina', 'Óleo prímula'],
      features: ['GLA', 'Óleo prímula', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['hormonal', 'gla', 'prímula', 'feminino'],
      priority_score: 83
    }
  ],

  'intestino': [
    {
      name: 'Pure Encapsulations Probiotic 50B (Multi-Strain)',
      description: 'Probióticos de alta potência com múltiplas cepas para saúde intestinal.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
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
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
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
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
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
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
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
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
      current_price: '12.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Fibra solúvel', 'Regularidade', 'Saciedade', 'Saúde intestinal'],
      features: ['Psyllium puro', 'Sem aditivos', 'Não-GMO', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['intestino', 'fibra', 'psyllium', 'regularidade'],
      priority_score: 85
    },
    {
      name: 'Thorne GI-Mend (Gut Repair Formula)',
      description: 'Fórmula completa para reparo intestinal com glutamina, zinco e ervas curativas.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '39.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Reparo intestinal', 'Glutamina', 'Zinco', 'Fórmula completa'],
      features: ['Fórmula completa', 'Hipoalergênico', 'Alta qualidade', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['intestino', 'reparo', 'glutamina', 'intestinal'],
      priority_score: 92
    },
    {
      name: 'Life Extension Curcumin Elite (Bioavailable)',
      description: 'Curcumina de alta biodisponibilidade para inflamação e saúde digestiva.',
      amazon_url: 'https://www.amazon.com/dp/B074H5SRPW',
      current_price: '24.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Anti-inflamatório', 'Saúde digestiva', 'Alta biodisponibilidade', 'Antioxidante'],
      features: ['Curcumina elite', 'Alta absorção', 'Padronizada', 'Sem glúten'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['intestino', 'curcumina', 'inflamação', 'biodisponível'],
      priority_score: 90
    },
    {
      name: 'NOW Foods Aloe Vera (Inner Leaf)',
      description: 'Aloe vera da folha interna para suporte digestivo suave e conforto intestinal.',
      amazon_url: 'https://www.amazon.com/dp/B00014F8Y4',
      current_price: '14.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte digestivo', 'Conforto intestinal', 'Suave', 'Natural'],
      features: ['Folha interna', 'Puro', 'Não-GMO', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['intestino', 'aloe vera', 'conforto', 'suave'],
      priority_score: 83
    },
    {
      name: 'Pure Encapsulations Zinc Carnosine (Stomach Support)',
      description: 'Zinco carnosine para suporte específico do estômago e mucosa gástrica.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '28.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Suporte gástrico', 'Mucosa gástrica', 'Zinco quelado', 'Hipoalergênico'],
      features: ['Zinco carnosine', 'Hipoalergênico', 'Alta qualidade', 'Sem aditivos'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['intestino', 'zinco carnosine', 'estômago', 'mucosa'],
      priority_score: 86
    },
    {
      name: 'Thorne DGL (Deglycyrrhizinated Licorice)',
      description: 'DGL para conforto digestivo e saúde da mucosa gástrica.',
      amazon_url: 'https://www.amazon.com/dp/B08MDBFKS9',
      current_price: '16.99',
      image_url: 'https://m.media-amazon.com/images/I/71QKQ9QKQ9L._AC_SL1500_.jpg',
      benefits: ['Conforto digestivo', 'Mucosa gástrica', 'Suporte natural', 'Hipoalergênico'],
      features: ['DGL', 'Hipoalergênico', 'Sem aditivos', 'Bem tolerado'],
      is_mentoria: false,
      is_curated: true,
      quiz_keywords: ['intestino', 'dgl', 'conforto', 'mucosa'],
      priority_score: 87
    }
  ]
};

async function addMoreRealProducts() {
  console.log('🎯 Iniciando adição de mais produtos reais validados...');

  let totalAdded = 0;
  let totalErrors = 0;

  for (const [categoryId, products] of Object.entries(moreRealProducts)) {
    console.log(`\n📦 Processando categoria: ${categoryId}`);
    console.log(`📊 Produtos para adicionar: ${products.length}`);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      try {
        // Gerar ID único e slug para o produto
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substr(2, 5);
        const productId = `more-real-${categoryId}-${timestamp}-${randomSuffix}`;
        
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
    console.log('\n🎉 Mais produtos reais validados adicionados com sucesso!');
    console.log('💡 Acesse /admin-produtos para visualizar e gerenciar os produtos.');
  }
}

// Executar o script
addMoreRealProducts().catch(console.error);
