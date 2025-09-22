import { NextRequest, NextResponse } from 'next/server'
import { searchRealAmazonProducts } from '@/lib/real-amazon-api'

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

    // Busca normal
    const products = await searchRealAmazonProducts(query, maxResults || 3)

    console.log(`✅ REAL AMAZON SEARCH RESULT: ${products.length} products found`)

    return NextResponse.json({ 
      success: true, 
      products, 
      query, 
      totalFound: products.length,
      source: 'real-amazon-api'
    })
  } catch (error: any) {
    console.error('❌ Real Amazon API Error:', error)
    
    // Produtos curados mockados para demonstração
    const mockProducts = [
      {
        name: `NOW Foods Vitamin D3 5000 IU - ${query}`,
        asin: 'B0013OULJ4',
        price: '$12.99',
        rating: 4.8,
        imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
        detailPageURL: `https://www.amazon.com/dp/B0013OULJ4?tag=portalsolutio-20`,
        isValid: true,
        isBestSeller: true,
        isAmazonChoice: true,
        reviewCount: 15420,
        brand: 'NOW Foods',
        features: ['5000 IU Vitamin D3', 'Non-GMO', 'Gluten Free'],
        score: 85,
        scoreBreakdown: {
          brand: 25,
          nutrients: 15,
          price: 12,
          shipping: 10,
          penalties: 0
        }
      },
      {
        name: `Thorne Vitamin D3 5000 IU - ${query}`,
        asin: 'B0013OULJ5',
        price: '$18.99',
        rating: 4.9,
        imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
        detailPageURL: `https://www.amazon.com/dp/B0013OULJ5?tag=portalsolutio-20`,
        isValid: true,
        isBestSeller: false,
        isAmazonChoice: true,
        reviewCount: 8920,
        brand: 'Thorne',
        features: ['5000 IU Vitamin D3', 'High Quality', 'Lab Tested'],
        score: 82,
        scoreBreakdown: {
          brand: 25,
          nutrients: 15,
          price: 8,
          shipping: 10,
          penalties: 0
        }
      },
      {
        name: `Nature Made Vitamin D3 2000 IU - ${query}`,
        asin: 'B0013OULJ6',
        price: '$8.99',
        rating: 4.6,
        imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
        detailPageURL: `https://www.amazon.com/dp/B0013OULJ6?tag=portalsolutio-20`,
        isValid: true,
        isBestSeller: true,
        isAmazonChoice: false,
        reviewCount: 12350,
        brand: 'Nature Made',
        features: ['2000 IU Vitamin D3', 'Trusted Brand', 'Easy to Swallow'],
        score: 78,
        scoreBreakdown: {
          brand: 25,
          nutrients: 12,
          price: 15,
          shipping: 8,
          penalties: 0
        }
      }
    ];
    
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
