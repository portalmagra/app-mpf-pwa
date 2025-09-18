import { NextRequest, NextResponse } from 'next/server'
import { searchRealAmazonProducts } from '@/lib/real-amazon-api'

export async function POST(request: NextRequest) {
  try {
    const { query, maxResults } = await request.json()

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Query inválida. Mínimo de 2 caracteres.' },
        { status: 400 }
      )
    }

    console.log(`🚀 REAL AMAZON SEARCH REQUEST: "${query}"`)

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
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
