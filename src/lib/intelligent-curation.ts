/* eslint-disable @typescript-eslint/no-explicit-any */

// === Sistema de Curadoria Inteligente para Brasileiros nos EUA ===
// Baseado na conversa com ChatGPT - implementação completa do sistema de scoring

export interface CuratedProduct {
  name: string;
  asin: string;
  price: string;
  rating: number;
  imageUrl: string;
  detailPageURL: string;
  isValid: boolean;
  isBestSeller?: boolean;
  isAmazonChoice?: boolean;
  reviewCount?: number;
  score: number;
  scoreBreakdown: {
    brand: number;
    nutrients: number;
    price: number;
    shipping: number;
    penalties: number;
  };
  brand?: string;
  features?: string[];
}

// === Whitelist de Marcas Confiáveis para Brasileiros nos EUA ===
const BRAND_WHITELIST = [
  'NOW Foods',
  'Garden of Life', 
  'Nature Made',
  'Solgar',
  'Optimum Nutrition',
  'Nature\'s Bounty',
  'Thorne',
  'Pure Encapsulations',
  'Life Extension',
  'Jarrow Formulas',
  'Doctor\'s Best',
  'Swanson',
  'Country Life',
  'Rainbow Light',
  'New Chapter',
  'MegaFood',
  'Nordic Naturals',
  'Carlson',
  'Barlean\'s',
  'Spectrum'
];

// === Termos de Nutrientes para Scoring ===
const NUTRIENT_KEYWORDS = {
  // Vitaminas essenciais
  'vitamin d3': { weight: 15, keywords: ['vitamin d3', 'd3', 'cholecalciferol'] },
  'vitamin b12': { weight: 12, keywords: ['vitamin b12', 'b12', 'methylcobalamin', 'cyanocobalamin'] },
  'vitamin c': { weight: 10, keywords: ['vitamin c', 'ascorbic acid', 'ascorbate'] },
  'magnesium': { weight: 12, keywords: ['magnesium', 'mg', 'glycinate', 'citrate', 'oxide'] },
  'zinc': { weight: 10, keywords: ['zinc', 'picolinate', 'citrate', 'gluconate'] },
  
  // Minerais importantes
  'iron': { weight: 8, keywords: ['iron', 'ferrous', 'ferric', 'bisglycinate'] },
  'calcium': { weight: 8, keywords: ['calcium', 'citrate', 'carbonate', 'malate'] },
  'potassium': { weight: 6, keywords: ['potassium', 'citrate', 'gluconate'] },
  
  // Suplementos populares
  'omega 3': { weight: 12, keywords: ['omega 3', 'fish oil', 'epa', 'dha', 'epa/dha'] },
  'probiotics': { weight: 10, keywords: ['probiotic', 'lactobacillus', 'bifidobacterium', 'acidophilus'] },
  'coq10': { weight: 8, keywords: ['coq10', 'coenzyme q10', 'ubiquinol', 'ubiquinone'] },
  'melatonin': { weight: 8, keywords: ['melatonin', 'sleep aid'] },
  'ashwagandha': { weight: 8, keywords: ['ashwagandha', 'ksm-66', 'withania'] },
  'turmeric': { weight: 6, keywords: ['turmeric', 'curcumin', 'curcuma'] },
  
  // Fibras e digestão
  'fiber': { weight: 8, keywords: ['fiber', 'psyllium', 'inulin', 'prebiotic'] },
  'digestive': { weight: 6, keywords: ['digestive', 'enzymes', 'betaine', 'hcl'] }
};

// === Termos Penalizados ===
const PENALTY_TERMS = {
  'proprietary blend': -8,
  'added sugar': -6,
  'artificial': -4,
  'gummy': -6, // Se quiser evitar açúcar
  'kids': -3,
  'children': -3,
  'men\'s 50+': -2,
  'women\'s 50+': -2,
  'generic': -3,
  'store brand': -4
};

/**
 * Calcula score baseado na marca (whitelist)
 */
export function calculateBrandScore(brand?: string): number {
  if (!brand) return 0;
  
  const brandLower = brand.toLowerCase();
  const matchedBrand = BRAND_WHITELIST.find(b => 
    brandLower.includes(b.toLowerCase())
  );
  
  return matchedBrand ? 25 : 0;
}

/**
 * Calcula score baseado em nutrientes no título e features
 */
export function calculateNutrientScore(title: string, features: string[] = []): number {
  const text = (title + ' ' + features.join(' ')).toLowerCase();
  let score = 0;
  
  // Buscar nutrientes específicos
  for (const [nutrient, data] of Object.entries(NUTRIENT_KEYWORDS)) {
    const found = data.keywords.some(keyword => text.includes(keyword));
    if (found) {
      score += data.weight;
      console.log(`✅ Found nutrient: ${nutrient} (+${data.weight} points)`);
    }
  }
  
  return Math.min(score, 50); // Cap máximo de 50 pontos
}

/**
 * Calcula score baseado no preço (heurística simples)
 */
export function calculatePriceScore(title: string, features: string[], price: number): number {
  if (!price || price <= 0) return 0;
  
  // Extrair informações de quantidade do título/features
  const text = (title + ' ' + features.join(' ')).toLowerCase();
  
  // Tentar identificar quantidade de servings/capsules
  const servingsMatch = text.match(/(\d+)\s*(servings|capsules|caps|tablets|pills)/);
  const countMatch = text.match(/(\d+)\s*(count|ct)/);
  
  let servings = 1;
  if (servingsMatch) {
    servings = parseInt(servingsMatch[1]);
  } else if (countMatch) {
    servings = parseInt(countMatch[1]);
  }
  
  const pricePerServing = price / servings;
  
  // Scoring baseado no preço por serving
  if (pricePerServing < 0.50) return 15;
  if (pricePerServing < 1.00) return 12;
  if (pricePerServing < 1.50) return 10;
  if (pricePerServing < 2.00) return 8;
  if (pricePerServing < 3.00) return 5;
  return 2;
}

/**
 * Calcula score baseado em shipping (Prime, etc.)
 */
export function calculateShippingScore(offer: any): number {
  try {
    const prime = offer?.Listings?.[0]?.DeliveryInfo?.IsPrimeEligible;
    const shipsFromAmazon = offer?.Listings?.[0]?.DeliveryInfo?.ShipsFromAmazon;
    
    if (prime) return 10;
    if (shipsFromAmazon) return 6;
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Calcula penalidades baseadas em termos indesejados
 */
export function calculatePenaltyScore(title: string, features: string[] = []): number {
  const text = (title + ' ' + features.join(' ')).toLowerCase();
  let penalty = 0;
  
  for (const [term, penaltyValue] of Object.entries(PENALTY_TERMS)) {
    if (text.includes(term)) {
      penalty += penaltyValue;
      console.log(`⚠️ Penalty applied: ${term} (${penaltyValue} points)`);
    }
  }
  
  return penalty;
}

/**
 * Função principal de curadoria inteligente
 */
export function applyIntelligentCuration(products: any[]): CuratedProduct[] {
  console.log(`🎯 Starting intelligent curation for ${products.length} products`);
  
  const curatedProducts = products.map(product => {
    const title = product.ItemInfo?.Title?.DisplayValue || product.name || '';
    const brand = product.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || '';
    const features = product.ItemInfo?.Features?.DisplayValues || [];
    const price = product.Offers?.Listings?.[0]?.Price?.Amount || 0;
    const asin = product.ASIN || product.asin || '';
    
    // Calcular scores individuais
    const brandScore = calculateBrandScore(brand);
    const nutrientScore = calculateNutrientScore(title, features);
    const priceScore = calculatePriceScore(title, features, price);
    const shippingScore = calculateShippingScore(product.Offers);
    const penaltyScore = calculatePenaltyScore(title, features);
    
    // Score total
    const totalScore = brandScore + nutrientScore + priceScore + shippingScore + penaltyScore;
    
    // Construir URL com tag de afiliado
    let url = product.DetailPageURL || product.detailPageURL || `https://www.amazon.com/dp/${asin}`;
    if (url.includes('tag=')) {
      url = url.replace(/tag=[^&]*/, 'tag=portalsolutio-20');
    } else {
      url = url.includes('?') ? `${url}&tag=portalsolutio-20` : `${url}?tag=portalsolutio-20`;
    }
    
    const curatedProduct: CuratedProduct = {
      name: title,
      asin,
      price: product.Offers?.Listings?.[0]?.Price?.DisplayAmount || product.price || '$0.00',
      rating: product.CustomerReviews?.StarRating?.Value || product.rating || 4.0,
      imageUrl: product.Images?.Primary?.Large?.URL || product.imageUrl || '',
      detailPageURL: url,
      isValid: true,
      isBestSeller: product.BrowseNodeInfo?.WebsiteSalesRank?.Rank <= 100 || product.isBestSeller,
      isAmazonChoice: product.ItemInfo?.ProductInfo?.IsAmazonChoice || product.isAmazonChoice,
      reviewCount: product.CustomerReviews?.Count || product.reviewCount || 0,
      score: totalScore,
      scoreBreakdown: {
        brand: brandScore,
        nutrients: nutrientScore,
        price: priceScore,
        shipping: shippingScore,
        penalties: penaltyScore
      },
      brand,
      features
    };
    
    console.log(`📊 Product: ${title.substring(0, 50)}... | Score: ${totalScore} (Brand: ${brandScore}, Nutrients: ${nutrientScore}, Price: ${priceScore}, Shipping: ${shippingScore}, Penalties: ${penaltyScore})`);
    
    return curatedProduct;
  });
  
  // Filtrar produtos válidos e ordenar por score
  const validProducts = curatedProducts
    .filter(p => p.price !== '$0.00' && p.name && p.score > 0)
    .sort((a, b) => b.score - a.score);
  
  console.log(`✅ Curated ${validProducts.length} high-quality products from ${products.length} total`);
  
  return validProducts;
}

/**
 * Função para buscar produtos com curadoria aplicada
 */
export async function searchWithIntelligentCuration(
  query: string,
  maxResults: number = 6,
  searchIndex: string = 'HealthPersonalCare'
): Promise<CuratedProduct[]> {
  console.log(`🔍 Searching with intelligent curation: "${query}"`);
  
  // Esta função será integrada com a API da Amazon existente
  // Por enquanto, retorna array vazio - será implementada na próxima etapa
  return [];
}

/**
 * Função para gerar termos de busca inteligentes baseados na análise
 */
export function generateIntelligentSearchTerms(analysis: string): string[] {
  const searchTerms: string[] = [];
  const analysisLower = analysis.toLowerCase();
  
  // ENERGIA/FADIGA
  if (analysisLower.includes('energia') || analysisLower.includes('fadiga') || analysisLower.includes('cansaço')) {
    searchTerms.push(
      'NOW Foods vitamin b12 methylcobalamin energy',
      'Nature Made vitamin d3 5000iu',
      'Thorne coq10 energy supplement',
      'Solgar iron supplement women'
    );
  }
  
  // ANSIEDADE/ESTRESSE
  if (analysisLower.includes('ansiedade') || analysisLower.includes('estresse') || analysisLower.includes('nervos')) {
    searchTerms.push(
      'NOW Foods l-theanine 200mg anxiety relief',
      'Thorne ashwagandha ksm-66 stress',
      'Pure Encapsulations magnesium glycinate',
      'NOW Foods gaba supplement'
    );
  }
  
  // SONO
  if (analysisLower.includes('sono') || analysisLower.includes('dormir') || analysisLower.includes('insônia')) {
    searchTerms.push(
      'NOW Foods melatonin 5mg time release',
      'Thorne magnesium glycinate sleep',
      'Nature Made valerian root sleep aid',
      'NOW Foods l-tryptophan supplement'
    );
  }
  
  // IMUNIDADE
  if (analysisLower.includes('imunidade') || analysisLower.includes('imune') || analysisLower.includes('gripe')) {
    searchTerms.push(
      'NOW Foods vitamin c 1000mg',
      'Thorne zinc picolinate 50mg',
      'Nature Made elderberry immune support',
      'Pure Encapsulations vitamin d3 k2'
    );
  }
  
  // DIGESTÃO
  if (analysisLower.includes('digestão') || analysisLower.includes('digestivo') || analysisLower.includes('intestino')) {
    searchTerms.push(
      'NOW Foods probiotics women health',
      'Garden of Life digestive enzymes',
      'Thorne betaine hcl pepsin',
      'Nature Made fiber supplement'
    );
  }
  
  // Se não encontrou termos específicos, usar termos gerais de qualidade
  if (searchTerms.length === 0) {
    searchTerms.push(
      'NOW Foods vitamin d3 5000iu',
      'Thorne magnesium glycinate',
      'Pure Encapsulations vitamin b12',
      'Nature Made omega 3 fish oil'
    );
  }
  
  return searchTerms;
}
