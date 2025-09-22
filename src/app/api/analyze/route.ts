import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { searchAmazonProducts } from '../../../lib/amazon-api'
import { searchRealAmazonProducts } from '../../../lib/real-amazon-api'
import { generateIntelligentSearchTerms } from '../../../lib/intelligent-curation'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: null,
})

/**
 * Gera termos de busca inteligentes baseados na análise
 * DEPRECATED: Agora usa generateIntelligentSearchTerms da curadoria inteligente
 */
function generateSmartSearchTerms(analysis: string): string[] {
  // Usar a nova função de curadoria inteligente
  return generateIntelligentSearchTerms(analysis);
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

      FORMATO DE RESPOSTA (sempre seguir):

      1. Acolhimento personalizado: "Olá [NOME]! 👋"
      2. Identificação do problema: 2-3 frases sobre os desafios específicos
      3. Explicação simples: O que está acontecendo no corpo/rotina
      4. Recomendações práticas: 2-3 dicas de hábitos diários
      5. Encerramento motivacional: Mensagem de apoio variada e personalizada
      6. Call-to-action: "Que tal agendar uma consulta personalizada comigo?"

      REGRAS IMPORTANTES:
      - SEMPRE usar o nome da pessoa
      - NUNCA ultrapassar 200 palavras
      - Usar emojis estratégicos (🌙, 💧, 🌿, ✨)
      - Explicar o porquê de cada sugestão
      - Encerramento variado e motivacional
      - Sempre sugerir consulta personalizada
      - Foco em soluções práticas e sustentáveis
      - Linguagem calorosa mas profissional

      EXEMPLO:
      "Olá Maria! 👋 Vejo que você está enfrentando desafios com energia e sono. Isso é comum para nós brasileiras no clima americano.

      🌙 O problema: Seu corpo está desregulado pelo horário irregular e falta de nutrientes essenciais.

      ✨ Soluções práticas:
      - Tome sol 15 minutos por dia para regular o ciclo
      - Inclua mais proteína no café da manhã
      - Estabeleça um horário fixo para dormir

      Você merece se sentir renovada e cheia de energia! Estou aqui para te apoiar nessa jornada.

      Que tal agendar uma consulta personalizada comigo?"
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
      const greeting = gender === 'masculino' ? 'Olá!' : gender === 'feminino' ? 'Olá, querida!' : 'Olá!'
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
      const greetingFallback = genderFallback === 'masculino' ? 'Olá!' : genderFallback === 'feminino' ? 'Querida,' : 'Olá,'
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
    
    // Se não encontrou produtos, usar produtos mockados
    if (!recommendedProducts || recommendedProducts.length === 0) {
      console.log('📦 Usando produtos mockados para demonstração...')
      recommendedProducts = [
        {
          name: 'NOW Foods Vitamin D3 5000 IU',
          asin: 'B0013OULJ4',
          price: '$12.99',
          rating: 4.8,
          imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
          detailPageURL: 'https://www.amazon.com/dp/B0013OULJ4?tag=portalsolutio-20',
          isValid: true,
          isBestSeller: true,
          isAmazonChoice: true,
          reviewCount: 15420,
          brand: 'NOW Foods',
          features: ['5000 IU Vitamin D3', 'Non-GMO', 'Gluten Free'],
          score: 85
        },
        {
          name: 'Thorne Magnesium Glycinate',
          asin: 'B0013OULJ5',
          price: '$18.99',
          rating: 4.9,
          imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
          detailPageURL: 'https://www.amazon.com/dp/B0013OULJ5?tag=portalsolutio-20',
          isValid: true,
          isBestSeller: false,
          isAmazonChoice: true,
          reviewCount: 8920,
          brand: 'Thorne',
          features: ['Magnesium Glycinate', 'High Quality', 'Lab Tested'],
          score: 82
        },
        {
          name: 'Nature Made Vitamin B12',
          asin: 'B0013OULJ6',
          price: '$8.99',
          rating: 4.6,
          imageUrl: 'https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg',
          detailPageURL: 'https://www.amazon.com/dp/B0013OULJ6?tag=portalsolutio-20',
          isValid: true,
          isBestSeller: true,
          isAmazonChoice: false,
          reviewCount: 12350,
          brand: 'Nature Made',
          features: ['Vitamin B12', 'Trusted Brand', 'Easy to Swallow'],
          score: 78
        }
      ]
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
      amazonUrl: product.detailPageURL || `https://www.amazon.com/dp/${product.asin}?tag=portalsolutio-20`,
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