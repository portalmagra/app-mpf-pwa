import { NextRequest, NextResponse } from 'next/server'
import { searchAmazonProducts } from '@/lib/amazon-api'

export async function POST(request: NextRequest) {
  try {
    const { query, maxResults = 3 } = await request.json()
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query deve ter pelo menos 2 caracteres' }, 
        { status: 400 }
      )
    }
    
    console.log(`🔍 Amazon Search API: "${query}" (max: ${maxResults})`)
    
    const products = await searchAmazonProducts(query, maxResults)
    
    console.log(`✅ Amazon Search API: Found ${products.length} products`)
    
    return NextResponse.json({
      success: true,
      products,
      query,
      totalFound: products.length
    })
    
  } catch (error) {
    console.error('❌ Amazon Search API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
