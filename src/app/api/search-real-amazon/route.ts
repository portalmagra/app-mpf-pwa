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
    
    // Redirecionamento direto para Amazon quando API falha
    const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=portalsolutio-20`
    
    return NextResponse.json(
      { 
        success: true, 
        error: null,
        products: [{
          name: `Busca por "${query}" na Amazon`,
          asin: 'REDIRECT',
          price: 'Ver preços na Amazon',
          rating: 0,
          imageUrl: 'https://via.placeholder.com/150x150/ff9900/ffffff?text=Amazon',
          detailPageURL: amazonUrl,
          isValid: true,
          isBestSeller: false,
          isAmazonChoice: false,
          reviewCount: 0,
          brand: 'Amazon',
          ingredients: ['Busca direta'],
          nutritionalValue: 'Redirecionamento para Amazon'
        }],
        query: query || 'unknown',
        totalFound: 1,
        source: 'amazon-redirect',
        redirectUrl: amazonUrl
      },
      { status: 200 }
    )
  }
}
