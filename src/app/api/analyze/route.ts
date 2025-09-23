import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { searchAmazonProducts } from '../../../lib/amazon-api'
import { searchRealAmazonProducts } from '../../../lib/real-amazon-api'
import { generateIntelligentSearchTerms } from '../../../lib/intelligent-curation'
import { productService } from '../../../lib/supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: null,
})

// === FUNÇÕES PARA GERAR PRODUTOS BASEADOS NO DIAGNÓSTICO ===

// Função para buscar produtos por categoria específica
async function getProductsByCategory(categoryName: string): Promise<any[]> {
  console.log(`🔍 Buscando produtos da categoria: ${categoryName}`)
  
  try {
    // Buscar produtos da categoria específica no Supabase
    const products = await productService.getProductsByCategory(categoryName, true)
    
    if (products && products.length > 0) {
      console.log(`✅ Encontrados ${products.length} produtos na categoria ${categoryName}`)
      
      // Converter para o formato esperado
      return products.slice(0, 3).map(product => ({
        name: product.name,
        description: product.description || `Produto ${categoryName} para sua saúde`,
        asin: product.amazon_url?.split('/dp/')[1]?.split('?')[0] || product.id,
        price: product.current_price || '$29.99',
        rating: product.rating || 4.5,
        category: categoryName,
        benefits: product.benefits || [`Benefícios para ${categoryName}`],
        amazonUrl: product.amazon_url || `https://meuportalfit.com/link/${product.id}`,
        detailPageURL: `/produtos/${categoryName}`, // Link para a categoria completa
        source: 'supabase-category',
        savings: Math.floor(Math.random() * 20) + 15,
        imageUrl: product.image_url || '',
        featured: false,
        shortUrl: `meuportalfit.com/produtos/${categoryName}`
      }))
    }
  } catch (error) {
    console.error(`❌ Erro ao buscar produtos da categoria ${categoryName}:`, error)
  }
  
  return []
}

function extractNeedsFromAnalysis(analysis: string): string[] {
  const needs: string[] = [];
  const analysisLower = analysis.toLowerCase();
  
  // Detectar necessidades baseadas no diagnóstico específico
  if (analysisLower.includes('sono') || analysisLower.includes('sleep') || analysisLower.includes('dormir') || analysisLower.includes('insônia')) {
    needs.push('magnesium', 'melatonin');
  }
  if (analysisLower.includes('energia') || analysisLower.includes('energy') || analysisLower.includes('cansaço') || analysisLower.includes('fatigue')) {
    needs.push('vitamin-d3', 'vitamin-b12');
  }
  if (analysisLower.includes('estresse') || analysisLower.includes('stress') || analysisLower.includes('ansiedade') || analysisLower.includes('anxiety')) {
    needs.push('ashwagandha', 'theanine');
  }
  if (analysisLower.includes('digestão') || analysisLower.includes('digestion') || analysisLower.includes('intestino') || analysisLower.includes('gut')) {
    needs.push('probiotics', 'digestive-enzymes');
  }
  if (analysisLower.includes('imunidade') || analysisLower.includes('immunity') || analysisLower.includes('gripe') || analysisLower.includes('cold')) {
    needs.push('vitamin-c', 'zinc');
  }
  if (analysisLower.includes('pele') || analysisLower.includes('skin') || analysisLower.includes('cabelo') || analysisLower.includes('hair')) {
    needs.push('collagen', 'biotin');
  }
  if (analysisLower.includes('inflamação') || analysisLower.includes('inflammation') || analysisLower.includes('dores') || analysisLower.includes('pain')) {
    needs.push('omega-3', 'curcumin');
  }
  if (analysisLower.includes('vitamina d') || analysisLower.includes('vitamin d') || analysisLower.includes('sol')) {
    needs.push('vitamin-d3');
  }
  if (analysisLower.includes('magnésio') || analysisLower.includes('magnesium') || analysisLower.includes('relaxamento')) {
    needs.push('magnesium');
  }
  if (analysisLower.includes('b12') || analysisLower.includes('vitamina b') || analysisLower.includes('vitamin b')) {
    needs.push('vitamin-b12');
  }
  if (analysisLower.includes('ferro') || analysisLower.includes('iron') || analysisLower.includes('anemia')) {
    needs.push('iron');
  }
  if (analysisLower.includes('probiótico') || analysisLower.includes('probiotic') || analysisLower.includes('bactéria')) {
    needs.push('probiotics');
  }
  if (analysisLower.includes('ômega') || analysisLower.includes('omega') || analysisLower.includes('peixe')) {
    needs.push('omega-3');
  }
  if (analysisLower.includes('colágeno') || analysisLower.includes('collagen') || analysisLower.includes('articulação')) {
    needs.push('collagen');
  }
  
  // Se não detectou nada específico, usar necessidades gerais baseadas no contexto
  if (needs.length === 0) {
    needs.push('multivitamin', 'vitamin-d3', 'magnesium');
  }
  
  return needs;
}

function generateProductsFromNeeds(needs: string[]): any[] {
  const productDatabase = {
    'vitamin-d3': {
      name: 'NOW Foods Vitamin D3 5000 IU',
      asin: 'B0013OULJ4',
      price: '$12.99',
      rating: 4.8,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ4',
      isValid: true,
      isBestSeller: true,
      isAmazonChoice: true,
      reviewCount: 15420,
      brand: 'NOW Foods',
      features: ['5000 IU Vitamin D3', 'Non-GMO', 'Gluten Free'],
      score: 85
    },
    'magnesium': {
      name: 'Thorne Magnesium Glycinate',
      asin: 'B0013OULJ5',
      price: '$18.99',
      rating: 4.9,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ5',
      isValid: true,
      isBestSeller: false,
      isAmazonChoice: true,
      reviewCount: 8920,
      brand: 'Thorne',
      features: ['Magnesium Glycinate', 'High Quality', 'Lab Tested'],
      score: 82
    },
    'melatonin': {
      name: 'Nature Made Melatonin 3mg',
      asin: 'B0013OULJ2',
      price: '$9.99',
      rating: 4.5,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ2',
      isValid: true,
      isBestSeller: true,
      isAmazonChoice: true,
      reviewCount: 12000,
      brand: 'Nature Made',
      features: ['3mg Melatonin', 'Natural Sleep Aid', 'Non-Habit Forming'],
      score: 88
    },
    'vitamin-b12': {
      name: 'Nature Made Vitamin B12',
      asin: 'B0013OULJ6',
      price: '$8.99',
      rating: 4.6,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ6',
      isValid: true,
      isBestSeller: true,
      isAmazonChoice: false,
      reviewCount: 12350,
      brand: 'Nature Made',
      features: ['Vitamin B12', 'Trusted Brand', 'Easy to Swallow'],
      score: 78
    },
    'ashwagandha': {
      name: 'Himalaya Ashwagandha',
      asin: 'B0013OULJ3',
      price: '$16.99',
      rating: 4.7,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ3',
      isValid: true,
      isBestSeller: true,
      isAmazonChoice: true,
      reviewCount: 6800,
      brand: 'Himalaya',
      features: ['Ashwagandha Extract', 'Stress Relief', 'Natural Adaptogen'],
      score: 86
    },
    'theanine': {
      name: 'NOW Foods L-Theanine',
      asin: 'B0013OULJ4',
      price: '$14.99',
      rating: 4.6,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ4',
      isValid: true,
      isBestSeller: false,
      isAmazonChoice: true,
      reviewCount: 4200,
      brand: 'NOW Foods',
      features: ['L-Theanine 200mg', 'Calm Focus', 'No Drowsiness'],
      score: 84
    },
    'probiotics': {
      name: 'Culturelle Daily Probiotic',
      asin: 'B0013OULJ8',
      price: '$22.99',
      rating: 4.7,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ8',
      isValid: true,
      isBestSeller: true,
      isAmazonChoice: true,
      reviewCount: 8900,
      brand: 'Culturelle',
      features: ['Daily Probiotic', 'Digestive Health', 'Immune Support'],
      score: 88
    },
    'digestive-enzymes': {
      name: 'Garden of Life Digestive Enzymes',
      asin: 'B0013OULJ5',
      price: '$19.99',
      rating: 4.5,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ5',
      isValid: true,
      isBestSeller: false,
      isAmazonChoice: true,
      reviewCount: 3200,
      brand: 'Garden of Life',
      features: ['Digestive Enzymes', 'Whole Food', 'Non-GMO'],
      score: 80
    },
    'vitamin-c': {
      name: 'Nature Made Vitamin C 1000mg',
      asin: 'B0013OULJ6',
      price: '$11.99',
      rating: 4.4,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ6',
      isValid: true,
      isBestSeller: true,
      isAmazonChoice: false,
      reviewCount: 9500,
      brand: 'Nature Made',
      features: ['1000mg Vitamin C', 'Immune Support', 'Antioxidant'],
      score: 82
    },
    'zinc': {
      name: 'NOW Foods Zinc 50mg',
      asin: 'B0013OULJ7',
      price: '$8.99',
      rating: 4.6,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ7',
      isValid: true,
      isBestSeller: false,
      isAmazonChoice: true,
      reviewCount: 2800,
      brand: 'NOW Foods',
      features: ['50mg Zinc', 'Immune Support', 'High Absorption'],
      score: 85
    },
    'collagen': {
      name: 'Vital Proteins Collagen Peptides',
      asin: 'B0013OULJ0',
      price: '$28.99',
      rating: 4.6,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ0',
      isValid: true,
      isBestSeller: true,
      isAmazonChoice: true,
      reviewCount: 15000,
      brand: 'Vital Proteins',
      features: ['Collagen Peptides', 'Skin Health', 'Joint Support'],
      score: 85
    },
    'biotin': {
      name: 'Nature Made Biotin 5000mcg',
      asin: 'B0013OULJ1',
      price: '$7.99',
      rating: 4.3,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ1',
      isValid: true,
      isBestSeller: true,
      isAmazonChoice: false,
      reviewCount: 12000,
      brand: 'Nature Made',
      features: ['5000mcg Biotin', 'Hair Growth', 'Nail Strength'],
      score: 80
    },
    'omega-3': {
      name: 'Nordic Naturals Omega-3',
      asin: 'B0013OULJ9',
      price: '$24.99',
      rating: 4.8,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ9',
      isValid: true,
      isBestSeller: true,
      isAmazonChoice: true,
      reviewCount: 12000,
      brand: 'Nordic Naturals',
      features: ['Omega-3', 'Heart Health', 'Brain Support'],
      score: 90
    },
    'curcumin': {
      name: 'NOW Foods Curcumin C3 Complex',
      asin: 'B0013OULJ2',
      price: '$18.99',
      rating: 4.7,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ2',
      isValid: true,
      isBestSeller: false,
      isAmazonChoice: true,
      reviewCount: 4500,
      brand: 'NOW Foods',
      features: ['Curcumin C3 Complex', 'Anti-Inflammatory', 'Joint Support'],
      score: 87
    },
    'iron': {
      name: 'Garden of Life Vitamin Code Raw Iron',
      asin: 'B0013OULJ7',
      price: '$15.99',
      rating: 4.5,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ7',
      isValid: true,
      isBestSeller: false,
      isAmazonChoice: true,
      reviewCount: 3200,
      brand: 'Garden of Life',
      features: ['Raw Iron', 'Whole Food', 'Non-GMO'],
      score: 80
    },
    'multivitamin': {
      name: 'Nature Made Multi Complete',
      asin: 'B0013OULJ1',
      price: '$19.99',
      rating: 4.4,
      imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
      detailPageURL: 'https://meuportalfit.com/link/B0013OULJ1',
      isValid: true,
      isBestSeller: true,
      isAmazonChoice: false,
      reviewCount: 8500,
      brand: 'Nature Made',
      features: ['Complete Multivitamin', 'Daily Support', 'Easy to Swallow'],
      score: 82
    }
  };
  
  // Gerar produtos baseados nas necessidades detectadas
  const products = needs.slice(0, 3).map(need => productDatabase[need as keyof typeof productDatabase]);
  
  // Se não encontrou produtos específicos, usar multivitamin como fallback
  if (products.length === 0) {
    return [productDatabase.multivitamin];
  }
  
  return products;
}

/**
 * Gera termos de busca inteligentes baseados na análise
 * DEPRECATED: Agora usa generateIntelligentSearchTerms da curadoria inteligente
 */
function generateSmartSearchTerms(analysis: string): string[] {
  // Usar a nova função de curadoria inteligente
  return generateIntelligentSearchTerms(analysis);
}

/**
 * Busca produtos de forma inteligente e adaptativa - SISTEMA HÍBRIDO
 * 1. Primeiro: Buscar produtos curados no Supabase baseados na análise
 * 2. Fallback: Se não encontrar suficientes, usar busca dinâmica da Amazon
 */
async function searchProductsSmart(
  analysis: string,
  targetCount: number = 6
): Promise<unknown[]> {
  console.log('🎯 Iniciando busca híbrida inteligente...')
  
  let allProducts: unknown[] = []
  
  // === ETAPA 1: BUSCAR PRODUTOS CURADOS NO SUPABASE ===
  try {
    console.log('📦 Buscando produtos curados no Supabase...')
    const curatedProducts = await productService.getCuratedProductsByQuiz(analysis, targetCount)
    
    if (curatedProducts && curatedProducts.length > 0) {
      // Converter produtos do Supabase para o formato esperado
      const formattedProducts = curatedProducts.map(product => {
        // Extrair ASIN da URL do Amazon ou usar ID do produto
        const asin = product.amazon_url?.split('/dp/')[1]?.split('?')[0] || product.id
        
        // Criar link interno para o guia de produtos
        const internalLink = `/produtos/${product.category_id}/${product.slug || product.id}`
        
        return {
          name: product.name,
          asin: asin,
          price: product.current_price || '$29.99',
          rating: product.rating || 4.5,
          imageUrl: product.image_url || '',
          detailPageURL: internalLink, // Usar link interno em vez do Amazon
          amazonUrl: product.amazon_url, // Manter URL do Amazon para referência
          isValid: true,
          isBestSeller: false,
          isAmazonChoice: false,
          reviewCount: product.review_count || 1000,
          brand: product.name.split(' ')[0] || 'Premium',
          features: product.features || [],
          benefits: product.benefits || [],
          description: product.description || '',
          score: product.priority_score || 75,
          scoreBreakdown: {
            brand: 20,
            nutrients: 15,
            price: 10,
            shipping: 10,
            penalties: 0
          },
          source: 'supabase-curated'
        }
      })
      
      allProducts.push(...formattedProducts)
      console.log(`✅ Encontrados ${formattedProducts.length} produtos curados no Supabase`)
    }
  } catch (error) {
    console.warn('⚠️ Erro ao buscar produtos curados:', error instanceof Error ? error.message : String(error))
  }
  
  // === ETAPA 2: FALLBACK PARA BUSCA DINÂMICA DA AMAZON ===
  // SÓ buscar na Amazon se não tivermos produtos curados suficientes
  if (allProducts.length < targetCount) {
    console.log(`🔄 Precisamos de mais produtos (temos ${allProducts.length}, queremos ${targetCount})`)
    console.log('🔍 Iniciando busca dinâmica na Amazon como fallback...')
    
    const remainingCount = targetCount - allProducts.length
    let searchAttempts = 0
    const maxAttempts = 15
    
    // Gerar termos de busca baseados na análise
    const smartTerms = generateSmartSearchTerms(analysis)
    console.log(`🎯 Generated ${smartTerms.length} smart search terms`)
    
    // Buscar com termos inteligentes
    for (const term of smartTerms) {
      if (allProducts.length >= targetCount || searchAttempts >= maxAttempts) break
      
      searchAttempts++
      console.log(`🔍 Searching [${searchAttempts}/${maxAttempts}]: "${term}"`)
      
      try {
        // Usar a nova API com curadoria inteligente
        const results = await searchRealAmazonProducts(term, 3)
        
        if (results && results.length > 0) {
          // Filtrar apenas produtos únicos (por ASIN)
          const newProducts = results.filter(product => 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            !allProducts.some((existing: any) => existing.asin === product.asin)
          )
          
          allProducts.push(...newProducts)
          console.log(`✅ Found ${newProducts.length} unique products with intelligent curation (total: ${allProducts.length})`)
        }
      } catch (error) {
        console.warn(`⚠️ Search error for "${term}":`, error instanceof Error ? error.message : String(error))
      }
    }
    
    // Se ainda não tem produtos suficientes, buscar termos mais genéricos
    if (allProducts.length < targetCount) {
      console.log(`📦 Need more products (have ${allProducts.length}, want ${targetCount})`)
      
      const genericTerms = [
        'bestseller supplement women',
        'vitamin women health',
        'natural supplement wellness',
        'daily vitamin pack women',
        'health supplement amazon choice'
      ]
      
      for (const term of genericTerms) {
        if (allProducts.length >= targetCount || searchAttempts >= maxAttempts) break
        
        searchAttempts++
        console.log(`🔄 Generic search [${searchAttempts}/${maxAttempts}]: "${term}"`)
        
        try {
          const results = await searchRealAmazonProducts(term, 2)
          
          if (results && results.length > 0) {
            const newProducts = results.filter(product => 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              !allProducts.some((existing: any) => existing.asin === product.asin)
            )
            
            allProducts.push(...newProducts)
            console.log(`✅ Added ${newProducts.length} generic products (total: ${allProducts.length})`)
          }
        } catch (error) {
          console.warn(`⚠️ Generic search error:`, error instanceof Error ? error.message : String(error))
        }
      }
    }
  }
  
  // === ETAPA 3: ORDENAÇÃO FINAL ===
  // Priorizar produtos curados do Supabase, depois produtos da Amazon
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allProducts.sort((a: any, b: any) => {
    // 1. Priorizar produtos curados do Supabase
    if (a.source === 'supabase-curated' && b.source !== 'supabase-curated') return -1
    if (a.source !== 'supabase-curated' && b.source === 'supabase-curated') return 1
    
    // 2. Priorizar bestsellers
    if (a.isBestSeller && !b.isBestSeller) return -1
    if (!a.isBestSeller && b.isBestSeller) return 1
    
    // 3. Ordenar por rating
    return (b.rating || 4.0) - (a.rating || 4.0)
  })
  
  // Retornar apenas a quantidade desejada
  const finalProducts = allProducts.slice(0, targetCount)
  
  console.log(`🎉 Busca híbrida concluída: ${finalProducts.length} produtos`)
  console.log(`📊 Produtos curados: ${finalProducts.filter((p: any) => p.source === 'supabase-curated').length}`)
  console.log(`📊 Produtos Amazon: ${finalProducts.filter((p: any) => p.source !== 'supabase-curated').length}`)
  
  return finalProducts
}

/**
 * Gera descrição personalizada do produto
 */
function generateProductDescription(productName: string, language: string): string {
  const name = productName.toLowerCase()
  
  if (language === 'pt') {
    if (name.includes('theanine')) return 'Aminoácido natural para calma e foco sem sonolência'
    if (name.includes('ashwagandha')) return 'Adaptógeno poderoso para controle do estresse'
    if (name.includes('melatonin')) return 'Hormônio natural do sono para melhor descanso'
    if (name.includes('magnesium')) return 'Mineral essencial para relaxamento e bem-estar'
    if (name.includes('vitamin d')) return 'Vitamina do sol para energia e imunidade'
    if (name.includes('b12') || name.includes('b-12')) return 'Vitamina B12 para energia sustentável'
    if (name.includes('probiotic')) return 'Probióticos para saúde digestiva e imunidade'
    if (name.includes('collagen')) return 'Colágeno para pele, cabelo e unhas saudáveis'
    if (name.includes('omega')) return 'Ômega 3 para coração e cérebro saudáveis'
    if (name.includes('biotin')) return 'Biotina para cabelo e unhas fortes'
    if (name.includes('iron')) return 'Ferro para energia e vitalidade feminina'
    if (name.includes('zinc')) return 'Zinco para imunidade e recuperação'
    return 'Suplemento premium recomendado para seu perfil'
  }
  
  // Default em inglês
  if (name.includes('theanine')) return 'Natural amino acid for calm and focus without drowsiness'
  if (name.includes('ashwagandha')) return 'Powerful adaptogen for stress management'
  if (name.includes('melatonin')) return 'Natural sleep hormone for better rest'
  if (name.includes('magnesium')) return 'Essential mineral for relaxation and wellness'
  if (name.includes('vitamin d')) return 'Sunshine vitamin for energy and immunity'
  if (name.includes('b12')) return 'Vitamin B12 for sustained energy'
  if (name.includes('probiotic')) return 'Probiotics for digestive health and immunity'
  if (name.includes('collagen')) return 'Collagen for healthy skin, hair and nails'
  return 'Premium supplement recommended for your profile'
}

/**
 * Identifica categoria do produto
 */
function identifyCategory(productName: string): string {
  const name = productName.toLowerCase()
  
  if (name.includes('vitamin') || name.includes('vitamina')) return 'Vitaminas'
  if (name.includes('magnesium') || name.includes('calcium') || name.includes('iron') || name.includes('zinc')) return 'Minerais'
  if (name.includes('ashwagandha') || name.includes('theanine') || name.includes('gaba')) return 'Ansiedade/Estresse'
  if (name.includes('melatonin') || name.includes('sleep') || name.includes('valerian')) return 'Sono'
  if (name.includes('probiotic') || name.includes('enzyme') || name.includes('fiber')) return 'Digestão'
  if (name.includes('collagen') || name.includes('biotin') || name.includes('hyaluronic')) return 'Beleza'
  if (name.includes('omega') || name.includes('fish oil')) return 'Ômega 3'
  if (name.includes('protein') || name.includes('whey')) return 'Proteína'
  
  return 'Bem-estar'
}

/**
 * Gera benefícios do produto
 */
function generateBenefits(productName: string, language: string): string[] {
  const name = productName.toLowerCase()
  
  if (language === 'pt') {
    if (name.includes('theanine')) return ['Reduz ansiedade', 'Melhora foco', 'Sem sonolência']
    if (name.includes('ashwagandha')) return ['Controla cortisol', 'Energia sustentável', 'Adaptógeno natural']
    if (name.includes('melatonin')) return ['Melhora qualidade do sono', 'Regula ciclo circadiano', '100% natural']
    if (name.includes('magnesium')) return ['Relaxamento muscular', 'Sono reparador', 'Anti-cãibras']
    if (name.includes('vitamin d')) return ['Mais energia', 'Sistema imune forte', 'Humor equilibrado']
    if (name.includes('b12')) return ['Energia o dia todo', 'Foco mental', 'Metabolismo ativo']
    if (name.includes('probiotic')) return ['Digestão saudável', 'Imunidade forte', 'Bem-estar intestinal']
    if (name.includes('collagen')) return ['Pele firme', 'Cabelo brilhante', 'Unhas fortes']
    if (name.includes('omega')) return ['Coração saudável', 'Cérebro ativo', 'Anti-inflamatório']
    if (name.includes('biotin')) return ['Crescimento capilar', 'Unhas resistentes', 'Pele radiante']
    return ['Alta qualidade', 'Recomendação especializada', 'Resultados comprovados']
  }
  
  // Default em inglês
  if (name.includes('theanine')) return ['Reduces anxiety', 'Improves focus', 'No drowsiness']
  if (name.includes('ashwagandha')) return ['Controls cortisol', 'Sustained energy', 'Natural adaptogen']
  if (name.includes('melatonin')) return ['Better sleep quality', 'Regulates circadian rhythm', '100% natural']
  if (name.includes('magnesium')) return ['Muscle relaxation', 'Restful sleep', 'Anti-cramp']
  if (name.includes('vitamin d')) return ['More energy', 'Strong immunity', 'Balanced mood']
  return ['High quality', 'Expert recommendation', 'Proven results']
}

export async function POST(request: NextRequest) {
  try {
    const { answers, language = 'pt', detailed, userName } = await request.json()
    
    if (!answers || (typeof answers !== 'object' && !Array.isArray(answers))) {
      console.error('❌ Respostas inválidas:', answers)
      return NextResponse.json(
        { error: 'Respostas inválidas' }, 
        { status: 400 }
      )
    }

    console.log('📊 Dados recebidos:', { answers, detailed })
    console.log('🔍 Tipo de answers:', typeof answers)
    console.log('🔍 É array:', Array.isArray(answers))
    console.log('🔍 Length:', Array.isArray(answers) ? answers.length : 'N/A')

    // Análise com Dra. Ana Slim (GPT-4o Mini)
    let analysis = ''
    
    try {
      console.log('🤖 Usando Dra. Ana Slim com GPT-4o Mini')

      const systemPrompt = `
      Você é Dra. Ana Slim, nutricionista brasileira especialista em wellness para brasileiras e latinas que vivem nos EUA há 15+ anos.

      PERFIL: Especialista em medicina funcional, entende desafios únicos do clima americano (inverno, ar seco, correria). Consultora de confiança com linguagem calorosa e próxima.

      PÚBLICO: Mulheres brasileiras/latinas 25-50 anos nos EUA, orçamento $50-500/mês, querem soluções práticas e produtos da Amazon USA.

      ESTILO: Tom acolhedor usando o nome da pessoa, máximo 200 palavras, sempre explique o porquê, use emojis para deixar leve.

      FORMATO DE RESPOSTA OBRIGATÓRIO (sempre seguir exatamente):

      1. Acolhimento personalizado: "Olá [NOME]! 👋"
      2. Identificação do problema: 2-3 frases sobre os desafios específicos baseados nas respostas
      3. Explicação simples: O que está acontecendo no corpo/rotina baseado no perfil
      4. **Soluções práticas:** (SEMPRE incluir esta seção com 3-5 dicas específicas)
      5. Encerramento motivacional: Mensagem de apoio variada e personalizada
      6. Call-to-action: "Que tal agendar uma avaliação personalizada?"

      REGRAS CRÍTICAS:
      - SEMPRE usar o nome da pessoa no "Olá [NOME]! 👋"
      - NUNCA ultrapassar 200 palavras
      - SEMPRE incluir a seção **Soluções práticas:** com 3-5 dicas específicas
      - Usar emojis estratégicos (🌙, 💧, 🌿, ✨)
      - Explicar o porquê de cada sugestão
      - Encerramento variado e motivacional
      - Sempre sugerir avaliação personalizada
      - Foco em soluções práticas e sustentáveis
      - Linguagem calorosa mas profissional
      - PERSONALIZAR as orientações baseadas nas respostas específicas da pessoa
      - NÃO usar orientações genéricas - sempre adaptar ao perfil individual
      - Para soluções práticas, use **texto em negrito** para os títulos (ex: **Inclua mais fibras**)
      - Use **O problema:** em negrito para destacar a seção
      - Use **Soluções práticas:** em negrito para destacar a seção
      - ANALISAR as respostas específicas para identificar necessidades únicas
      - CRIAR orientações específicas baseadas no que a pessoa respondeu
      - EVITAR orientações genéricas que servem para qualquer pessoa
      - OBRIGATÓRIO: Sempre terminar com a seção **Soluções práticas:** seguida de 3-5 dicas específicas

      EXEMPLO DE PERSONALIZAÇÃO:
      Se a pessoa respondeu sobre problemas de sono → focar em melatonina, magnésio, rotina noturna
      Se a pessoa respondeu sobre energia → focar em vitamina D, B12, proteína, exercícios
      Se a pessoa respondeu sobre digestão → focar em probióticos, fibras, água, enzimas
      Se a pessoa respondeu sobre estresse → focar em ashwagandha, theanine, meditação
      Se a pessoa respondeu sobre imunidade → focar em vitamina C, zinco, sono, exercícios

      EXEMPLO:
      "Olá [NOME]! 👋 Vejo que você está enfrentando desafios com energia e sono. Isso é comum para nós brasileiras no clima americano.

      🌙 **O problema:** Seu corpo está desregulado pelo horário irregular e falta de nutrientes essenciais.

      ✨ **Soluções práticas:**
      - **Tome sol 15 minutos por dia** para regular o ciclo
      - **Inclua mais proteína** no café da manhã
      - **Estabeleça um horário fixo** para dormir

      Você merece se sentir renovada e cheia de energia! Estou aqui para te apoiar nessa jornada.

      Que tal agendar uma avaliação personalizada?"
      `;

      // Detectar gênero baseado no nome (se fornecido)
      const detectGender = (name: string): 'masculino' | 'feminino' | 'neutro' => {
        if (!name) return 'neutro'
        
        const maleNames = ['andre', 'andré', 'carlos', 'joão', 'pedro', 'rafael', 'lucas', 'bruno', 'felipe', 'gabriel', 'daniel', 'marcos', 'antonio', 'ricardo', 'rodrigo', 'miguel', 'diego', 'alexandre', 'leonardo', 'thiago']
        const femaleNames = ['ana', 'maria', 'julia', 'fernanda', 'camila', 'bruna', 'carolina', 'beatriz', 'laura', 'sophia', 'isabella', 'valentina', 'manuela', 'alice', 'helena', 'luiza', 'giovanna', 'mariana', 'nicole', 'rafaella']
        
        const nameLower = name.toLowerCase().trim()
        
        if (maleNames.some(n => nameLower.includes(n))) return 'masculino'
        if (femaleNames.some(n => nameLower.includes(n))) return 'feminino'
        return 'neutro'
      }

      const gender = detectGender(userName || '')
      const greeting = `Olá, ${userName}!`
      const pronoun = gender === 'masculino' ? 'você' : gender === 'feminino' ? 'você' : 'você'
      const possessive = gender === 'masculino' ? 'seu' : gender === 'feminino' ? 'sua' : 'seu'

      const userMessage = `
      Olá Dra. Ana Slim! Aqui estão os dados de uma nova avaliação:

      Nome do usuário: ${userName || 'Não fornecido'} (Gênero detectado: ${gender})
      Saudação apropriada: ${greeting}
      Pronome: ${pronoun}
      Possessivo: ${possessive}

      Respostas do quiz (0=primeira opção, 1=segunda, etc):
      ${JSON.stringify(answers)}
      
      ${detailed ? `
      Dados detalhados adicionais:
      - Horário de acordar: ${detailed.wakeUpTime || 'Não informado'}
      - Horário de dormir: ${detailed.sleepTime || 'Não informado'}
      - Qualidade do sono: ${detailed.sleepQuality || 'Não informado'}
      - Principal preocupação: ${detailed.mainConcern || 'Não informado'}
      - Áreas de melhoria: ${detailed.improvementAreas?.join(', ') || 'Não informado'}
      - Usa medicamentos: ${detailed.usesMedication || 'Não informado'} ${detailed.medicationDetails ? `(${detailed.medicationDetails})` : ''}
      - Alterações na saúde: ${detailed.healthIssues || 'Não informado'} ${detailed.healthIssuesDetails ? `(${detailed.healthIssuesDetails})` : ''}
      - Restrições alimentares: ${detailed.foodRestrictions || 'Não informado'} ${detailed.foodRestrictionsDetails ? `(${detailed.foodRestrictionsDetails})` : ''}
      - Usa suplementos: ${detailed.usesSupplements || 'Não informado'} ${detailed.supplementsDetails ? `(${detailed.supplementsDetails})` : ''}
      ` : ''}

      IMPORTANTE: Use a saudação "${greeting}" e adapte sua linguagem ao gênero detectado (${gender}).
      Use "${pronoun}" como pronome e "${possessive}" como possessivo.
      
      Por favor, forneça uma análise personalizada e específica, mencionando produtos específicos mas SEM incluir links da Amazon.
      Responda em ${language === 'pt' ? 'português brasileiro' : language === 'es' ? 'espanhol' : 'inglês'}.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: 400,
        temperature: 0.7
      })

      analysis = completion.choices[0]?.message?.content || ''
      console.log('✅ Dra. Ana Slim respondeu:', analysis.substring(0, 100) + '...')
      
    } catch (error) {
      console.error('❌ Erro na Dra. Ana Slim:', error)
      console.warn('⚠️ Dra. Ana Slim falhou, usando análise de fallback')
      
      // Análise de fallback baseada nas respostas - estilo Dra. Ana Slim
      const healthChallenge = answers[1] || 0
      const energyLevel = answers[2] || 0
      const sleepQuality = answers[4] || 0
      
      // Detectar gênero para fallback também
      const detectGenderFallback = (name: string): 'masculino' | 'feminino' | 'neutro' => {
        if (!name) return 'neutro'
        const maleNames = ['andre', 'andré', 'carlos', 'joão', 'pedro', 'rafael', 'lucas', 'bruno', 'felipe', 'gabriel', 'daniel', 'marcos', 'antonio', 'ricardo', 'rodrigo', 'miguel', 'diego', 'alexandre', 'leonardo', 'thiago']
        const femaleNames = ['ana', 'maria', 'julia', 'fernanda', 'camila', 'bruna', 'carolina', 'beatriz', 'laura', 'sophia', 'isabella', 'valentina', 'manuela', 'alice', 'helena', 'luiza', 'giovanna', 'mariana', 'nicole', 'rafaella']
        const nameLower = name.toLowerCase().trim()
        if (maleNames.some(n => nameLower.includes(n))) return 'masculino'
        if (femaleNames.some(n => nameLower.includes(n))) return 'feminino'
        return 'neutro'
      }
      
      const genderFallback = detectGenderFallback(userName || '')
      const greetingFallback = `Olá, ${userName}!`
      const pronounFallback = genderFallback === 'masculino' ? 'você' : genderFallback === 'feminino' ? 'você' : 'você'
      const groupFallback = genderFallback === 'masculino' ? 'brasileiros' : genderFallback === 'feminino' ? 'brasileiras' : 'brasileiros'
      
      if (language === 'pt') {
        if (healthChallenge === 0 || energyLevel < 3) {
          analysis = `${greetingFallback} vejo que ${pronounFallback} está enfrentando aquela fadiga típica de quem vive nos EUA - super comum entre nós ${groupFallback}! O ritmo acelerado aqui, combinado com menos sol que no Brasil, cria uma deficiência energética real. ${pronounFallback} precisa de vitamina B12 metilcobalamina para energia sustentável, vitamina D3 5000IU (essencial no clima americano), e ferro quelato se houver deficiência. Magnésio glicinato também ajuda muito com energia e qualidade do sono. O clima seco aqui afeta nossa absorção de nutrientes, então suplementação de qualidade é fundamental.`
        } else if (healthChallenge === 1) {
          analysis = `${greetingFallback} reconheço esse padrão de ansiedade e estresse - muitos de nós ${groupFallback} passamos por isso aqui! A pressão do dia a dia nos EUA é intensa e diferente do Brasil. ${pronounFallback} precisa de L-teanina 200mg para calma sem sonolência, magnésio glicinato para relaxamento muscular profundo, e adaptógenos como ashwagandha KSM-66 para equilibrar o cortisol. Ômega 3 EPA/DHA também ajuda muito com o equilíbrio emocional. O estresse crônico aqui esgota nossos estoques de magnésio rapidamente.`
        } else if (healthChallenge === 2 || sleepQuality < 3) {
          analysis = `${greetingFallback} problemas de sono são tão comuns entre ${groupFallback} nos EUA! O clima seco, mudança de horário e estresse afetam muito nosso ciclo circadiano. ${pronounFallback} precisa de melatonina de liberação prolongada para regular o ciclo natural, magnésio glicinato para relaxamento muscular profundo, e L-triptofano para produção natural de serotonina. Vitamina D3 também ajuda a regular o ciclo circadiano. O ar seco aqui desidrata nosso corpo e afeta a qualidade do sono.`
        } else {
          analysis = `Pelo ${pronounFallback} perfil, vejo que ${pronounFallback} busca manter ${pronounFallback === 'você' ? 'sua' : 'sua'} saúde em dia - parabéns! Para ${groupFallback} como nós nos EUA, é essencial manter níveis adequados de vitamina D3 2000IU (especialmente no inverno), complexo B metilado para energia, probióticos 50 bilhões CFU para saúde digestiva (a dieta americana afeta muito nosso microbioma!), e ômega 3 EPA/DHA para saúde geral. Um bom multivitamínico com minerais quelatos também faz diferença na absorção.`
        }
      } else {
        analysis = "Based on your responses, I can see you're dealing with common wellness challenges many of us face in the USA. You need B-complex vitamins for sustained energy, vitamin D3 for immunity and mood, magnesium for relaxation and better sleep, and probiotics for digestive health. These essentials will help you feel your best."
      }
    }
    
    // BUSCA INTELIGENTE DE PRODUTOS
    console.log('🚀 Iniciando busca inteligente de produtos...')
    
    let recommendedProducts = await searchProductsSmart(analysis, 6)
    
    // Se não encontrou produtos, gerar produtos baseados no diagnóstico da IA
    if (!recommendedProducts || recommendedProducts.length === 0) {
      console.log('📦 Gerando produtos baseados no diagnóstico da IA...')
      
      // Extrair necessidades do diagnóstico da IA
      const needs = extractNeedsFromAnalysis(analysis);
      recommendedProducts = generateProductsFromNeeds(needs);
    }
    
    // Enriquecer produtos com informações adicionais
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recommendedProducts = recommendedProducts.map((product: any, index) => ({
      name: product.name,
      description: generateProductDescription(product.name, language),
      asin: product.asin,
      price: product.price,
      rating: product.rating || 4.0,
      category: identifyCategory(product.name),
      benefits: generateBenefits(product.name, language),
      amazonUrl: `https://meuportalfit.com/link/${product.asin}`,
      detailPageURL: `https://meuportalfit.com/link/${product.asin}`, // Adicionar campo detailPageURL
      source: 'amazon-dynamic', // Adicionar campo source
      savings: Math.floor(Math.random() * 20) + 15, // 15-35% economia
      imageUrl: product.imageUrl || '',
      featured: index === 0,
      shortUrl: `amazon.com/dp/${product.asin}` // URL limpa para exibição
    }))
    
    console.log(`✅ Total de ${recommendedProducts.length} produtos processados`)
    
    // Calcular resumo
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
const totalSavings = recommendedProducts.reduce((sum: number, product: any) => {
  const price = parseFloat(product.price.replace('$', '').replace(',', ''))
  return sum + (price * product.savings / 100)
}, 0)

const budgetAnswer = answers[3] || 1
const budgetMap = ['budget', 'moderate', 'priority', 'premium', 'unlimited']
const budget = budgetMap[budgetAnswer] || 'moderate'

// Extrair orientações práticas da análise da Dra. Ana Slim
const extractPracticalGuidance = (analysis: string): string => {
  console.log('🔍 Extraindo orientações práticas da análise...')
  console.log('📝 Análise completa:', analysis.substring(0, 200) + '...')
  
  // Procurar por seções de orientações práticas na análise
  const guidanceMatch = analysis.match(/\*\*Soluções práticas:\*\*([\s\S]*?)(?=\*\*|$)/i)
  if (guidanceMatch) {
    console.log('✅ Encontrou seção "Soluções práticas"')
    return guidanceMatch[1].trim()
  }
  
  // Procurar por outras variações de orientações práticas
  const variations = [
    /\*\*Orientações práticas:\*\*([\s\S]*?)(?=\*\*|$)/i,
    /\*\*Dicas práticas:\*\*([\s\S]*?)(?=\*\*|$)/i,
    /\*\*Recomendações:\*\*([\s\S]*?)(?=\*\*|$)/i,
    /\*\*Ações práticas:\*\*([\s\S]*?)(?=\*\*|$)/i
  ]
  
  for (const variation of variations) {
    const match = analysis.match(variation)
    if (match) {
      console.log('✅ Encontrou orientações com variação')
      return match[1].trim()
    }
  }
  
  // Fallback: procurar por listas com bullet points
  const bulletMatch = analysis.match(/- \*\*(.*?)\*\*/g)
  if (bulletMatch && bulletMatch.length >= 2) {
    console.log('✅ Encontrou lista com bullet points')
    return bulletMatch.map(bullet => bullet.replace(/^- \*\*(.*?)\*\*/, '**$1**')).join('\n')
  }
  
  // Procurar por linhas que começam com ** (títulos em negrito)
  const boldLines = analysis.match(/\*\*[^*]+\*\*/g)
  if (boldLines && boldLines.length >= 3) {
    console.log('✅ Encontrou linhas em negrito')
    return boldLines.slice(0, 5).join('\n')
  }
  
  // CORREÇÃO: Se não encontrar orientações específicas, retornar a análise completa
  console.log('⚠️ Usando análise completa como fallback')
  return analysis
}

return NextResponse.json({
  success: true,
  analysis,
  orientacoes: extractPracticalGuidance(analysis), // Adicionar orientações práticas
  profile: {
    language,
    budget,
    totalQuestions: Object.keys(answers).length
  },
  recommendations: recommendedProducts,
  summary: {
    totalProducts: recommendedProducts.length,
    totalSavings: Math.round(totalSavings),
    averageRating: recommendedProducts.length > 0 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? recommendedProducts.reduce((sum: number, p: any) => sum + p.rating, 0) / recommendedProducts.length
      : 0  // <-- ESTA É A MUDANÇA IMPORTANTE
  }
})

  } catch (error) {
    console.error('Erro na análise:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
}