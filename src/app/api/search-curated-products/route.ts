import { NextRequest, NextResponse } from 'next/server'

// Produtos curados/selecionados do app
const curatedProducts = [
  // Suplementos
  {
    name: 'Nature Made Multi Complete',
    asin: 'B0009F3P0Y',
    price: '$19.99',
    rating: 4.4,
    imageUrl: '/images/supplements/nature-made.jpg',
    detailPageURL: 'https://www.amazon.com/Nature-Made-Multi-Complete-Supplement/dp/B0009F3P0Y',
    category: 'suplementos',
    benefits: ['Multivitamínico completo', 'Suporte nutricional', 'Qualidade farmacêutica']
  },
  {
    name: 'Nordic Naturals Omega-3',
    asin: 'B0009F3P0Z',
    price: '$24.99',
    rating: 4.8,
    imageUrl: '/images/supplements/nordic-naturals.jpg',
    detailPageURL: 'https://www.amazon.com/Nordic-Naturals-Ultimate-Omega-Softgels/dp/B0009F3P0Z',
    category: 'suplementos',
    benefits: ['Ômega-3 de alta qualidade', 'Suporte cardiovascular', 'Pele e cabelo']
  },
  {
    name: 'Vital Proteins Collagen Peptides',
    asin: 'B0009F3P1A',
    price: '$28.99',
    rating: 4.6,
    imageUrl: '/images/supplements/vital-proteins.jpg',
    detailPageURL: 'https://www.amazon.com/Vital-Proteins-Collagen-Peptides-Powder/dp/B0009F3P1A',
    category: 'suplementos',
    benefits: ['Colágeno hidrolisado', 'Pele e articulações', 'Sem sabor']
  },
  // Equipamentos de cozinha
  {
    name: 'Vitamix A3500 Ascent Series',
    asin: 'B07B4Q8QZQ',
    price: '$449.95',
    rating: 4.7,
    imageUrl: '/images/kitchen/vitamix.jpg',
    detailPageURL: 'https://www.amazon.com/Vitamix-A3500-Ascent-Series-Blender/dp/B07B4Q8QZQ',
    category: 'cozinha',
    benefits: ['Liquidificador profissional', 'Programas automáticos', 'Garantia de 10 anos']
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    asin: 'B00FLYWNYQ',
    price: '$79.95',
    rating: 4.6,
    imageUrl: '/images/kitchen/instant-pot.jpg',
    detailPageURL: 'https://www.amazon.com/Instant-Pot-Duo-7-1-Programmable/dp/B00FLYWNYQ',
    category: 'cozinha',
    benefits: ['Panela de pressão elétrica', '7 funções em 1', 'Cozimento rápido']
  },
  // Equipamentos de fitness
  {
    name: 'Bowflex SelectTech 552 Dumbbells',
    asin: 'B001ARYU8W',
    price: '$549.00',
    rating: 4.5,
    imageUrl: '/images/fitness/bowflex-dumbbells.jpg',
    detailPageURL: 'https://www.amazon.com/Bowflex-SelectTech-Adjustable-Dumbbells-Pairs/dp/B001ARYU8W',
    category: 'fitness',
    benefits: ['Halteres ajustáveis', '15 pesos em 1', 'Economia de espaço']
  },
  {
    name: 'Peloton Bike',
    asin: 'B07JBJQY7H',
    price: '$1,495.00',
    rating: 4.3,
    imageUrl: '/images/fitness/peloton-bike.jpg',
    detailPageURL: 'https://www.amazon.com/Peloton-Exercise-Bike-Streaming-Classes/dp/B07JBJQY7H',
    category: 'fitness',
    benefits: ['Bicicleta ergométrica', 'Aulas ao vivo', 'Comunidade global']
  }
]

export async function POST(request: NextRequest) {
  try {
    const { query, maxResults = 3 } = await request.json()

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Query deve ter pelo menos 2 caracteres'
      })
    }

    const searchTerm = query.toLowerCase().trim()
    
    // Buscar produtos que correspondem à query
    const matchingProducts = curatedProducts.filter(product => {
      const searchableText = [
        product.name.toLowerCase(),
        product.category?.toLowerCase(),
        ...(product.benefits || []).map(b => b.toLowerCase())
      ].join(' ')
      
      return searchableText.includes(searchTerm)
    })

    // Se não encontrou correspondência exata, buscar por palavras-chave relacionadas
    if (matchingProducts.length === 0) {
      const keywordMap: { [key: string]: string[] } = {
        'geladeira': ['cozinha', 'refrigerador', 'frio'],
        'fogão': ['cozinha', 'cozinhar', 'gás'],
        'microondas': ['cozinha', 'aquecer', 'rápido'],
        'liquidificador': ['vitamix', 'cozinha', 'bater'],
        'panela': ['instant pot', 'cozinha', 'pressão'],
        'halter': ['fitness', 'peso', 'musculação'],
        'bicicleta': ['fitness', 'cardio', 'peloton'],
        'suplemento': ['vitamina', 'proteína', 'colágeno'],
        'vitamina': ['suplemento', 'multivitamínico', 'nature made'],
        'proteína': ['suplemento', 'colágeno', 'vital proteins'],
        'omega': ['suplemento', 'nordic naturals', 'cardio']
      }

      const relatedKeywords = keywordMap[searchTerm] || []
      
      const relatedProducts = curatedProducts.filter(product => {
        const searchableText = [
          product.name.toLowerCase(),
          product.category?.toLowerCase(),
          ...(product.benefits || []).map(b => b.toLowerCase())
        ].join(' ')
        
        return relatedKeywords.some(keyword => searchableText.includes(keyword))
      })

      if (relatedProducts.length > 0) {
        return NextResponse.json({
          success: true,
          products: relatedProducts.slice(0, maxResults),
          source: 'curated',
          message: `Encontramos produtos relacionados a "${query}"`
        })
      }
    }

    // Retornar produtos encontrados
    if (matchingProducts.length > 0) {
      return NextResponse.json({
        success: true,
        products: matchingProducts.slice(0, maxResults),
        source: 'curated',
        message: `Encontramos ${matchingProducts.length} produtos curados para "${query}"`
      })
    }

    // Se não encontrou nada, retornar vazio (vai buscar na Amazon real)
    return NextResponse.json({
      success: false,
      products: [],
      source: 'curated',
      message: `Nenhum produto curado encontrado para "${query}"`
    })

  } catch (error) {
    console.error('Erro na busca de produtos curados:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}
