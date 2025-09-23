import { NextRequest, NextResponse } from 'next/server'

interface AmazonProductData {
  name: string
  price: string
  imageUrl: string
  rating: number
  reviewCount: number
  description: string
  asin: string
}

export async function POST(request: NextRequest) {
  try {
    const { links } = await request.json()
    
    if (!links || !Array.isArray(links)) {
      return NextResponse.json({ error: 'Links array is required' }, { status: 400 })
    }

    const results = []
    
    for (const link of links) {
      try {
        const asin = extractAsinFromUrl(link)
        if (!asin) {
          results.push({ error: `ASIN not found in: ${link}` })
          continue
        }

        // Tentar extrair dados reais da Amazon
        const productData = await extractRealAmazonData(asin)
        
        if (productData) {
          results.push({
            success: true,
            ...productData
          })
        } else {
          // Fallback para dados básicos se não conseguir extrair
          results.push({
            success: true,
            asin,
            name: `Produto ${asin}`,
            price: 'Preço não disponível',
            imageUrl: `https://via.placeholder.com/300x300/f0f0f0/666666?text=${asin}`,
            rating: 0,
            reviewCount: 0,
            description: `Produto ${asin} da Amazon`
          })
        }
      } catch (error) {
        results.push({ error: `Error processing ${link}: ${error}` })
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error in extract-amazon-products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function extractAsinFromUrl(url: string): string | null {
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/,
    /\/product\/([A-Z0-9]{10})/,
    /\/gp\/product\/([A-Z0-9]{10})/,
    /\/exec\/obidos\/ASIN\/([A-Z0-9]{10})/,
    /\/dp\/product\/([A-Z0-9]{10})/,
    /\/dp\/[^\/]+\/([A-Z0-9]{10})/,
    /\/[^\/]*\/([A-Z0-9]{10})/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }
  return null
}

async function extractRealAmazonData(asin: string): Promise<AmazonProductData | null> {
  try {
    // Primeiro tentar usar uma API de terceiros para dados mais confiáveis
    try {
      const rapidApiResponse = await fetch(`https://amazon-product-reviews1.p.rapidapi.com/product/${asin}`, {
        headers: {
          'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Você precisaria de uma chave da RapidAPI
          'X-RapidAPI-Host': 'amazon-product-reviews1.p.rapidapi.com'
        }
      })
      
      if (rapidApiResponse.ok) {
        const data = await rapidApiResponse.json()
        return {
          name: data.title || `Produto ${asin}`,
          price: data.price || 'Preço não disponível',
          imageUrl: data.image || `https://via.placeholder.com/300x300/f0f0f0/666666?text=${asin}`,
          rating: data.rating || 0,
          reviewCount: data.reviewCount || 0,
          description: data.title || `Produto ${asin}`,
          asin
        }
      }
    } catch (rapidApiError) {
      console.log('RapidAPI não disponível, usando web scraping')
    }

    // Fallback: Tentar extrair dados reais da Amazon usando web scraping
    const amazonUrl = `https://www.amazon.com/dp/${asin}`
    
    // Usar um serviço de proxy ou API para evitar bloqueios
    const response = await fetch(amazonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      }
    })

    if (!response.ok) {
      console.log(`Failed to fetch Amazon page for ASIN ${asin}: ${response.status}`)
      return null
    }

    const html = await response.text()
    
    // Extrair dados usando regex (método básico)
    const nameMatch = html.match(/<span id="productTitle"[^>]*>([^<]+)<\/span>/)
    const priceMatch = html.match(/<span class="a-price-whole">([^<]+)<\/span>/)
    
    // Múltiplos padrões para encontrar a imagem
    const imagePatterns = [
      /<img[^>]*id="landingImage"[^>]*src="([^"]+)"/,
      /<img[^>]*data-old-hires="([^"]+)"/,
      /<img[^>]*data-a-dynamic-image[^>]*src="([^"]+)"/,
      /<img[^>]*class="[^"]*a-dynamic-image[^"]*"[^>]*src="([^"]+)"/,
      /<img[^>]*src="([^"]*images-amazon[^"]*\.jpg[^"]*)"/,
      /<img[^>]*src="([^"]*media-amazon[^"]*\.jpg[^"]*)"/,
      /<img[^>]*src="([^"]*\.jpg[^"]*)"[^>]*class="[^"]*a-dynamic-image/
    ]
    
    let imageUrl = null
    for (const pattern of imagePatterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        imageUrl = match[1]
        break
      }
    }
    
    const ratingMatch = html.match(/<span class="a-icon-alt">([0-9.]+) out of 5 stars<\/span>/)
    const reviewMatch = html.match(/<span id="acrCustomerReviewText"[^>]*>([^<]+)<\/span>/)
    
    const name = nameMatch ? nameMatch[1].trim() : `Produto ${asin}`
    const price = priceMatch ? `$${priceMatch[1].trim()}` : 'Preço não disponível'
    
    // Se não encontrou imagem via regex, usar URL direta da Amazon
    let finalImageUrl = imageUrl
    if (!finalImageUrl) {
      // Tentar URL direta da imagem da Amazon
      finalImageUrl = `https://images-na.ssl-images-amazon.com/images/I/${asin}.jpg`
      
      // Verificar se a imagem existe
      try {
        const imageResponse = await fetch(finalImageUrl, { method: 'HEAD' })
        if (!imageResponse.ok) {
          // Tentar variações da URL
          const alternativeUrls = [
            `https://m.media-amazon.com/images/I/${asin}.jpg`,
            `https://images-na.ssl-images-amazon.com/images/I/${asin}._AC_SL1500_.jpg`,
            `https://m.media-amazon.com/images/I/${asin}._AC_SL1500_.jpg`
          ]
          
          for (const altUrl of alternativeUrls) {
            const altResponse = await fetch(altUrl, { method: 'HEAD' })
            if (altResponse.ok) {
              finalImageUrl = altUrl
              break
            }
          }
        }
      } catch (imageError) {
        console.log('Erro ao verificar imagem:', imageError)
      }
    }
    
    // Fallback final
    if (!finalImageUrl) {
      finalImageUrl = `https://via.placeholder.com/300x300/f0f0f0/666666?text=${asin}`
    }
    
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0
    const reviewCount = reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, '')) : 0

    return {
      name,
      price,
      imageUrl: finalImageUrl,
      rating,
      reviewCount,
      description: name,
      asin
    }
  } catch (error) {
    console.error(`Error extracting data for ASIN ${asin}:`, error)
    return null
  }
}
