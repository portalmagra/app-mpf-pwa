import { NextRequest, NextResponse } from 'next/server'
import { searchRealAmazonProducts } from '@/lib/real-amazon-api'

// Função para gerar produtos mockados específicos por categoria
function generateMockProductsByQuery(query: string): any[] {
  const queryLower = query.toLowerCase();
  
  // Produtos para SONO
  if (queryLower.includes('melatonin') || queryLower.includes('sleep') || queryLower.includes('sono')) {
    return [
      {
        name: 'NOW Foods Melatonin 5mg Time Release',
        asin: 'B0013OUL14',
        price: '$9.99',
        rating: 4.7,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OUL14',
        isValid: true,
        isBestSeller: true,
        isAmazonChoice: true,
        reviewCount: 12500,
        brand: 'NOW Foods',
        features: ['5mg Melatonin', 'Time Release', 'Non-Habit Forming'],
        score: 88
      },
      {
        name: 'Thorne Magnesium Glycinate Sleep Support',
        asin: 'B0013OUL22',
        price: '$24.99',
        rating: 4.8,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OUL22',
        isValid: true,
        isBestSeller: false,
        isAmazonChoice: true,
        reviewCount: 8900,
        brand: 'Thorne',
        features: ['Magnesium Glycinate', 'Sleep Support', 'High Absorption'],
        score: 92
      },
      {
        name: 'Nature Made Valerian Root Sleep Aid',
        asin: 'B0013OULJ3',
        price: '$12.99',
        rating: 4.5,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULJ3',
        isValid: true,
        isBestSeller: true,
        isAmazonChoice: false,
        reviewCount: 6800,
        brand: 'Nature Made',
        features: ['Valerian Root', 'Natural Sleep Aid', 'Non-GMO'],
        score: 85
      }
    ];
  }
  
  // Produtos para ENERGIA
  if (queryLower.includes('vitamin d3') || queryLower.includes('b12') || queryLower.includes('energia')) {
    return [
      {
        name: 'NOW Foods Vitamin D3 5000 IU',
        asin: 'B0013OUL14',
        price: '$12.99',
        rating: 4.8,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OUL14',
        isValid: true,
        isBestSeller: true,
        isAmazonChoice: true,
        reviewCount: 15420,
        brand: 'NOW Foods',
        features: ['5000 IU Vitamin D3', 'Non-GMO', 'Gluten Free'],
        score: 85
      },
      {
        name: 'Thorne Vitamin B12 Methylcobalamin',
        asin: 'B0013OULJ5',
        price: '$18.99',
        rating: 4.9,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULJ5',
        isValid: true,
        isBestSeller: false,
        isAmazonChoice: true,
        reviewCount: 8920,
        brand: 'Thorne',
        features: ['Methylcobalamin B12', 'High Bioavailability', 'Lab Tested'],
        score: 90
      },
      {
        name: 'Garden of Life Vitamin Code Raw Iron',
        asin: 'B0013OULJ6',
        price: '$15.99',
        rating: 4.6,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULJ6',
        isValid: true,
        isBestSeller: true,
        isAmazonChoice: false,
        reviewCount: 12350,
        brand: 'Garden of Life',
        features: ['Raw Iron', 'Whole Food', 'Non-GMO'],
        score: 82
      }
    ];
  }
  
  // Produtos para ANSIEDADE
  if (queryLower.includes('ashwagandha') || queryLower.includes('theanine') || queryLower.includes('ansiedade')) {
    return [
      {
        name: 'Himalaya Ashwagandha KSM-66',
        asin: 'B0013OULJ7',
        price: '$19.99',
        rating: 4.7,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULJ7',
        isValid: true,
        isBestSeller: true,
        isAmazonChoice: true,
        reviewCount: 11200,
        brand: 'Himalaya',
        features: ['KSM-66 Ashwagandha', 'Stress Relief', 'Adaptogen'],
        score: 87
      },
      {
        name: 'NOW Foods L-Theanine 200mg',
        asin: 'B0013OULJ8',
        price: '$14.99',
        rating: 4.6,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULJ8',
        isValid: true,
        isBestSeller: false,
        isAmazonChoice: true,
        reviewCount: 6800,
        brand: 'NOW Foods',
        features: ['200mg L-Theanine', 'Calm Focus', 'No Drowsiness'],
        score: 84
      },
      {
        name: 'Pure Encapsulations GABA',
        asin: 'B0013OULJ9',
        price: '$22.99',
        rating: 4.5,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULJ9',
        isValid: true,
        isBestSeller: false,
        isAmazonChoice: true,
        reviewCount: 4200,
        brand: 'Pure Encapsulations',
        features: ['GABA 500mg', 'Relaxation Support', 'Pharmaceutical Grade'],
        score: 86
      }
    ];
  }
  
  // Produtos para GANHO DE MASSA MUSCULAR
  if (queryLower.includes('whey') || queryLower.includes('protein') || queryLower.includes('creatine') || queryLower.includes('bcaa')) {
    return [
      {
        name: 'Optimum Nutrition Gold Standard Whey',
        asin: 'B0013OULK1',
        price: '$29.99',
        rating: 4.8,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULK1',
        isValid: true,
        isBestSeller: true,
        isAmazonChoice: true,
        reviewCount: 25000,
        brand: 'Optimum Nutrition',
        features: ['24g Protein', 'Whey Protein Isolate', 'Muscle Building'],
        score: 95
      },
      {
        name: 'NOW Foods Creatine Monohydrate',
        asin: 'B0013OULK2',
        price: '$16.99',
        rating: 4.7,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULK2',
        isValid: true,
        isBestSeller: true,
        isAmazonChoice: true,
        reviewCount: 18500,
        brand: 'NOW Foods',
        features: ['Creatine Monohydrate', 'Muscle Strength', 'Power Output'],
        score: 88
      },
      {
        name: 'Scivation XTEND BCAA',
        asin: 'B0013OULK3',
        price: '$24.99',
        rating: 4.6,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULK3',
        isValid: true,
        isBestSeller: false,
        isAmazonChoice: true,
        reviewCount: 12800,
        brand: 'Scivation',
        features: ['BCAA 2:1:1 Ratio', 'Muscle Recovery', 'Endurance'],
        score: 89
      }
    ];
  }
  
  // Produtos para IMUNIDADE
  if (queryLower.includes('vitamin c') || queryLower.includes('zinc') || queryLower.includes('imunidade')) {
    return [
      {
        name: 'Nature Made Vitamin C 1000mg',
        asin: 'B0013OULK4',
        price: '$11.99',
        rating: 4.4,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULK4',
        isValid: true,
        isBestSeller: true,
        isAmazonChoice: false,
        reviewCount: 9500,
        brand: 'Nature Made',
        features: ['1000mg Vitamin C', 'Immune Support', 'Antioxidant'],
        score: 82
      },
      {
        name: 'NOW Foods Zinc Picolinate 50mg',
        asin: 'B0013OULK5',
        price: '$8.99',
        rating: 4.6,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULK5',
        isValid: true,
        isBestSeller: false,
        isAmazonChoice: true,
        reviewCount: 2800,
        brand: 'NOW Foods',
        features: ['50mg Zinc', 'Immune Support', 'High Absorption'],
        score: 85
      },
      {
        name: 'Nature Made Elderberry Immune Support',
        asin: 'B0013OULK6',
        price: '$13.99',
        rating: 4.5,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULK6',
        isValid: true,
        isBestSeller: true,
        isAmazonChoice: true,
        reviewCount: 7200,
        brand: 'Nature Made',
        features: ['Elderberry Extract', 'Immune Support', 'Antioxidants'],
        score: 83
      }
    ];
  }
  
  // Produtos para DIGESTÃO
  if (queryLower.includes('probiotic') || queryLower.includes('digestive') || queryLower.includes('digestao')) {
    return [
      {
        name: 'Culturelle Daily Probiotic',
        asin: 'B0013OULK7',
        price: '$22.99',
        rating: 4.7,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULK7',
        isValid: true,
        isBestSeller: true,
        isAmazonChoice: true,
        reviewCount: 8900,
        brand: 'Culturelle',
        features: ['Daily Probiotic', 'Digestive Health', 'Immune Support'],
        score: 88
      },
      {
        name: 'Garden of Life Digestive Enzymes',
        asin: 'B0013OULK8',
        price: '$19.99',
        rating: 4.5,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULK8',
        isValid: true,
        isBestSeller: false,
        isAmazonChoice: true,
        reviewCount: 3200,
        brand: 'Garden of Life',
        features: ['Digestive Enzymes', 'Whole Food', 'Non-GMO'],
        score: 80
      },
      {
        name: 'NOW Foods Psyllium Husk Fiber',
        asin: 'B0013OULK9',
        price: '$12.99',
        rating: 4.3,
        imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
        detailPageURL: 'https://meuportalfit.com/link/B0013OULK9',
        isValid: true,
        isBestSeller: true,
        isAmazonChoice: false,
        reviewCount: 5600,
        brand: 'NOW Foods',
        features: ['Psyllium Husk', 'Fiber Supplement', 'Digestive Health'],
        score: 78
      }
    ];
  }
  
  // Produtos padrão se não encontrar categoria específica
  return [
    {
      name: 'Nature Made Multi Complete',
      asin: 'B0013OULM1',
      price: '$19.99',
      rating: 4.4,
      imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULM1',
      isValid: true,
      isBestSeller: true,
      isAmazonChoice: false,
      reviewCount: 8500,
      brand: 'Nature Made',
      features: ['Complete Multivitamin', 'Daily Support', 'Easy to Swallow'],
      score: 82
    },
    {
      name: 'Nordic Naturals Omega-3',
      asin: 'B0013OULM2',
      price: '$24.99',
      rating: 4.8,
      imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULM2',
      isValid: true,
      isBestSeller: true,
      isAmazonChoice: true,
      reviewCount: 12000,
      brand: 'Nordic Naturals',
      features: ['Omega-3', 'Heart Health', 'Brain Support'],
      score: 90
    },
    {
      name: 'Vital Proteins Collagen Peptides',
      asin: 'B00130ULJ2',
      price: '$28.99',
      rating: 4.6,
      imageUrl: 'https://via.placeholder.com/300x300/f0f0f0/666666?text=Produto+Mockado',
      detailPageURL: 'https://meuportalfit.com/link/B00130ULJ2',
      isValid: true,
      isBestSeller: true,
      isAmazonChoice: true,
      reviewCount: 15000,
      brand: 'Vital Proteins',
      features: ['Collagen Peptides', 'Skin Health', 'Joint Support'],
      score: 85
    }
  ];
}

export async function POST(request: NextRequest) {
  let query = '';
  
  try {
    const body = await request.json()
    query = body.query || '';
    const { maxResults, specificProduct } = body

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Query inválida. Mínimo de 2 caracteres.' },
        { status: 400 }
      )
    }

    console.log(`🚀 REAL AMAZON SEARCH REQUEST: "${query}"${specificProduct ? ' (PRODUTO ESPECÍFICO)' : ''}`)

    // Se é busca específica por ASIN, usar busca direta
    if (specificProduct && query.match(/^[A-Z0-9]{10}$/)) {
      console.log(`🎯 Buscando produto específico: ${query}`)
      
      // Buscar produto específico usando ASIN
      const products = await searchRealAmazonProducts(query, 1, true)
      
      console.log(`✅ PRODUTO ESPECÍFICO ENCONTRADO: ${products.length} products`)
      
      return NextResponse.json({ 
        success: true, 
        products, 
        query, 
        totalFound: products.length,
        source: 'real-amazon-api-specific',
        asin: query
      })
    }

    // Buscar produtos reais na Amazon
    console.log(`🔍 Buscando produtos reais na Amazon para: "${query}"`)
    
    const products = await searchRealAmazonProducts(query, maxResults || 10)
    
    console.log(`✅ PRODUTOS REAIS ENCONTRADOS: ${products.length} products`)
    
    if (products.length > 0) {
      return NextResponse.json({ 
        success: true, 
        products, 
        query, 
        totalFound: products.length,
        source: 'real-amazon-api'
      })
    }
    
    // Se não encontrou produtos reais, usar produtos mockados
    console.log(`⚠️ Nenhum produto real encontrado, usando produtos mockados para: "${query}"`)
    
    const mockProducts = generateMockProductsByQuery(query)
    
    return NextResponse.json({ 
      success: true, 
      products: mockProducts,
      query: query || 'unknown',
      totalFound: mockProducts.length,
      source: 'mock-curated-products'
    })
    
  } catch (error: any) {
    console.error('❌ Real Amazon API Error:', error)
    
    // Gerar produtos mockados específicos baseados na query
    const mockProducts = generateMockProductsByQuery(query);
    
    return NextResponse.json(
      { 
        success: true, 
        products: mockProducts,
        query: query || 'unknown',
        totalFound: mockProducts.length,
        source: 'mock-curated-products'
      },
      { status: 200 }
    )
  }
}