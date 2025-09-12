import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { searchAmazonProducts } from '../../../lib/amazon-api'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: null,
})

/**
 * Gera termos de busca inteligentes baseados na análise
 */
function generateSmartSearchTerms(analysis: string): string[] {
  const searchTerms: string[] = []
  const analysisLower = analysis.toLowerCase()
  
  // ENERGIA/FADIGA
  if (analysisLower.includes('energia') || analysisLower.includes('fadiga') || analysisLower.includes('cansaço')) {
    searchTerms.push(
      'vitamin b12 methylcobalamin energy',
      'vitamin d3 5000iu supplement',
      'coq10 energy supplement women',
      'iron supplement for women'
    )
  }
  
  // ANSIEDADE/ESTRESSE
  if (analysisLower.includes('ansiedade') || analysisLower.includes('estresse') || analysisLower.includes('nervos')) {
    searchTerms.push(
      'l-theanine 200mg anxiety relief',
      'ashwagandha ksm-66 stress',
      'magnesium glycinate calm',
      'gaba supplement natural calm'
    )
  }
  
  // SONO
  if (analysisLower.includes('sono') || analysisLower.includes('dormir') || analysisLower.includes('insônia')) {
    searchTerms.push(
      'melatonin 5mg time release',
      'magnesium glycinate sleep',
      'valerian root sleep aid',
      'l-tryptophan supplement'
    )
  }
  
  // IMUNIDADE
  if (analysisLower.includes('imunidade') || analysisLower.includes('imune') || analysisLower.includes('gripe')) {
    searchTerms.push(
      'vitamin c 1000mg supplement',
      'zinc picolinate 50mg immune',
      'elderberry immune support',
      'vitamin d3 k2 combination'
    )
  }
  
  // DIGESTÃO
  if (analysisLower.includes('digestão') || analysisLower.includes('intestino') || analysisLower.includes('probiótico')) {
    searchTerms.push(
      'probiotics women 50 billion cfu',
      'digestive enzymes supplement',
      'psyllium husk fiber capsules',
      'l-glutamine gut health'
    )
  }
  
  // BELEZA (Pele, Cabelo, Unhas)
  if (analysisLower.includes('pele') || analysisLower.includes('cabelo') || analysisLower.includes('unha') || analysisLower.includes('colágeno')) {
    searchTerms.push(
      'collagen peptides powder',
      'biotin 10000mcg hair growth',
      'hyaluronic acid supplement',
      'vitamin e mixed tocopherols'
    )
  }
  
  // PESO/METABOLISMO
  if (analysisLower.includes('peso') || analysisLower.includes('metabolismo') || analysisLower.includes('emagrecer')) {
    searchTerms.push(
      'green tea extract egcg',
      'apple cider vinegar capsules',
      'chromium picolinate metabolism',
      'cla weight management'
    )
  }
  
  // Se não identificou nada específico, usar termos gerais de wellness
  if (searchTerms.length === 0) {
    searchTerms.push(
      'multivitamin women daily',
      'omega 3 fish oil supplement',
      'vitamin d3 2000iu',
      'magnesium supplement women',
      'probiotic women health'
    )
  }
  
  return searchTerms
}

/**
 * Busca produtos de forma inteligente e adaptativa
 */
async function searchProductsSmart(
  analysis: string,
  targetCount: number = 6
): Promise<unknown[]> {
    const allProducts: unknown[] = []
  let searchAttempts = 0
  const maxAttempts = 20
  
  // Gerar termos de busca baseados na análise
  const smartTerms = generateSmartSearchTerms(analysis)
  console.log(`🎯 Generated ${smartTerms.length} smart search terms`)
  
  // Buscar com termos inteligentes
  for (const term of smartTerms) {
    if (allProducts.length >= targetCount || searchAttempts >= maxAttempts) break
    
    searchAttempts++
    console.log(`🔍 Searching [${searchAttempts}/${maxAttempts}]: "${term}"`)
    
    try {
      const results = await searchAmazonProducts(term, 3)
      
      if (results && results.length > 0) {
        // Filtrar apenas produtos únicos (por ASIN)
        const newProducts = results.filter(product => 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          !allProducts.some((existing: any) => existing.asin === product.asin)
        )
        
        allProducts.push(...newProducts)
        console.log(`✅ Found ${newProducts.length} unique products (total: ${allProducts.length})`)
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
        const results = await searchAmazonProducts(term, 2)
        
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
  
  // Ordenar por rating (melhores primeiro)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allProducts.sort((a: any, b: any) => (b.rating || 4.0) - (a.rating || 4.0))
  
  // Retornar apenas a quantidade desejada
  return allProducts.slice(0, targetCount)
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
    const { answers, language = 'pt' } = await request.json()
    
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Respostas inválidas' }, 
        { status: 400 }
      )
    }

    // Análise com OpenAI
    let analysis = ''
    
    try {
      const systemPrompt = `
      Você é uma especialista em wellness para mulheres brasileiras e latinas nos EUA.

      **Seu perfil:**
      - Brasileira, viveu nos EUA por 10+ anos
      - Conhece produtos disponíveis na Amazon americana
      - Entende desafios de adaptação cultural e climática
      - Foca em ingredientes naturais e marcas confiáveis

      **Seu público:**
      - Brasileiras/latinas 25-45 anos nos EUA
      - Trabalhadoras (home office, estudantes, profissionais)
      - Orçamento $50-300/mês em wellness
      - Querem qualidade com bom custo-benefício

      **Como responder:**
      1. Tom amigável e pessoal ("querida", "amiga")
      2. Mencione experiências culturais compartilhadas
      3. Explique O QUE a pessoa precisa e POR QUE
      4. Considere clima americano (inverno rigoroso, ar seco)
      5. Seja específica sobre tipos de nutrientes necessários
      6. Máximo 200 palavras
      
      **NÃO mencione produtos ou marcas específicas, apenas as necessidades nutricionais.**
      `

      const userMessage = `
      Respostas do quiz (0=primeira opção, 1=segunda, etc):
      ${JSON.stringify(answers)}
      
      Analise e identifique as necessidades de saúde e bem-estar desta pessoa.
      Responda em ${language === 'pt' ? 'português brasileiro' : language === 'es' ? 'espanhol' : 'inglês'}.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: 300,
        temperature: 0.7
      })

      analysis = completion.choices[0]?.message?.content || ''
      console.log('✅ Análise personalizada gerada com sucesso')
      
    } catch {
      console.warn('⚠️ OpenAI falhou, usando análise de fallback')
      
      // Análise de fallback baseada nas respostas
      const healthChallenge = answers[1] || 0
      const energyLevel = answers[2] || 0
      const sleepQuality = answers[4] || 0
      
      if (language === 'pt') {
        if (healthChallenge === 0 || energyLevel < 3) {
          analysis = "Querida, vejo que você está lidando com fadiga e baixa energia - super comum entre nós que vivemos nos EUA! O ritmo acelerado e a adaptação cultural cobram seu preço. Você precisa de vitaminas do complexo B para energia sustentável, vitamina D3 (essencial com menos sol que no Brasil), e ferro se houver deficiência. Magnésio também ajuda muito com energia e qualidade do sono."
        } else if (healthChallenge === 1) {
          analysis = "Amiga, reconheço esse padrão de ansiedade e estresse - muitas de nós passamos por isso aqui! A pressão do dia a dia nos EUA é intensa. Você precisa de L-teanina para calma sem sonolência, magnésio glicinato para relaxamento, e adaptógenos como ashwagandha para equilibrar o cortisol. Ômega 3 também ajuda muito com o equilíbrio emocional."
        } else if (healthChallenge === 2 || sleepQuality < 3) {
          analysis = "Querida, problemas de sono são tão comuns entre brasileiras nos EUA! O clima seco, mudança de horário e estresse afetam muito. Você precisa de melatonina para regular o ciclo do sono, magnésio para relaxamento muscular, e L-triptofano para produção natural de serotonina. Vitamina D3 também ajuda a regular o ciclo circadiano."
        } else {
          analysis = "Pelo seu perfil, vejo que você busca manter sua saúde em dia - parabéns! Para mulheres como nós nos EUA, é essencial manter níveis adequados de vitamina D3, complexo B para energia, probióticos para saúde digestiva (a dieta americana afeta muito!), e ômega 3 para saúde geral. Um bom multivitamínico também faz diferença."
        }
      } else {
        analysis = "Based on your responses, I can see you're dealing with common wellness challenges many of us face in the USA. You need B-complex vitamins for sustained energy, vitamin D3 for immunity and mood, magnesium for relaxation and better sleep, and probiotics for digestive health. These essentials will help you feel your best."
      }
    }
    
    // BUSCA INTELIGENTE DE PRODUTOS
    console.log('🚀 Iniciando busca inteligente de produtos...')
    
    let recommendedProducts = await searchProductsSmart(analysis, 6)
    
    // Enriquecer produtos com informações adicionais
    recommendedProducts = recommendedProducts.map((product, index) => ({
      name: product.name,
      description: generateProductDescription(product.name, language),
      asin: product.asin,
      price: product.price,
      rating: product.rating || 4.0,
      category: identifyCategory(product.name),
      benefits: generateBenefits(product.name, language),
      amazonUrl: product.detailPageURL || `https://www.amazon.com/dp/${product.asin}?tag=portal07d-20`,
      savings: Math.floor(Math.random() * 20) + 15, // 15-35% economia
      imageUrl: product.imageUrl || '',
      featured: index === 0
    }))
    
    console.log(`✅ Total de ${recommendedProducts.length} produtos processados`)
    
    // Calcular resumo
const totalSavings = recommendedProducts.reduce((sum, product) => {
  const price = parseFloat(product.price.replace('$', '').replace(',', ''))
  return sum + (price * product.savings / 100)
}, 0)

const budgetAnswer = answers[3] || 1
const budgetMap = ['budget', 'moderate', 'priority', 'premium', 'unlimited']
const budget = budgetMap[budgetAnswer] || 'moderate'

return NextResponse.json({
  success: true,
  analysis,
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
      ? recommendedProducts.reduce((sum, p) => sum + p.rating, 0) / recommendedProducts.length
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