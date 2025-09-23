import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: null,
})

export async function POST(request: NextRequest) {
  try {
    const { answers, language = 'pt', detailed, userName } = await request.json()
    
    console.log('🎯 Iniciando análise personalizada da Dra. Ana Slim...')
    console.log('📊 Respostas:', answers)
    console.log('👤 Usuário:', userName)

    // Criar prompt personalizado para Dra. Ana Slim
    const prompt = `
Você é a Dra. Ana Slim, uma nutricionista brasileira especializada em bem-estar feminino. 
Analise as respostas do questionário e forneça uma análise personalizada e prática.

RESPOSTAS DO QUESTIONÁRIO:
${JSON.stringify(answers, null, 2)}

${detailed ? `DETALHES ADICIONAIS:
${JSON.stringify(detailed, null, 2)}` : ''}

${userName ? `NOME DO USUÁRIO: ${userName}` : ''}

INSTRUÇÕES:
1. Forneça uma análise personalizada baseada nas respostas específicas
2. Identifique as principais áreas de melhoria
3. Dê orientações práticas e específicas para a vida corrida
4. Use linguagem acolhedora e profissional
5. Foque em soluções práticas e sustentáveis
6. Inclua emojis para tornar mais visual e acolhedor
7. Inclua uma seção "**Soluções práticas:**" com 3-5 dicas específicas

FORMATO DE RESPOSTA:
**Análise Personalizada:**
[Sua análise detalhada e personalizada aqui]

**Soluções práticas:**
- [Dica 1 específica com emoji]
- [Dica 2 específica com emoji] 
- [Dica 3 específica com emoji]
- [Dica 4 específica com emoji]
- [Dica 5 específica com emoji]

Responda em português brasileiro, de forma acolhedora e profissional, com emojis.
`

    console.log('🤖 Enviando para OpenAI...')
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é a Dra. Ana Slim, uma nutricionista brasileira especializada em bem-estar feminino. Sempre responda em português brasileiro de forma acolhedora e profissional, com emojis para tornar mais visual."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const analysis = completion.choices[0]?.message?.content || 'Análise não disponível'
    console.log('✅ Análise personalizada gerada!')

    // Extrair orientações práticas
    const extractPracticalGuidance = (analysis: string): string => {
      console.log('🔍 Extraindo orientações práticas da análise...')
      
      const guidanceMatch = analysis.match(/\*\*Soluções práticas:\*\*([\s\S]*?)(?=\*\*|$)/i)
      if (guidanceMatch) {
        console.log('✅ Encontrou seção "Soluções práticas"')
        return guidanceMatch[1].trim()
      }
      
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
      
      console.log('⚠️ Usando análise completa como fallback')
      return analysis
    }

    const orientacoes = extractPracticalGuidance(analysis)

    // Gerar produtos recomendados baseados nas necessidades
    const generateRecommendedProducts = (answers: any[], detailed: any) => {
      const products = []
      
      // Analisar necessidades baseadas nas respostas e detalhes
      const needs = []
      
      if (detailed?.sleepQuality === 'Ruim' || detailed?.sleepTime) {
        needs.push('sono')
      }
      
      if (detailed?.improvementAreas?.includes('Ter mais energia') || detailed?.improvementAreas?.includes('Melhorar a concentração')) {
        needs.push('energia')
      }
      
      if (detailed?.mainConcern?.includes('peso') || detailed?.improvementAreas?.includes('Desinflamar o corpo')) {
        needs.push('emagrecimento')
      }
      
      if (detailed?.improvementAreas?.includes('Melhorar a concentração')) {
        needs.push('ansiedade')
      }
      
      // Se não identificou necessidades específicas, usar padrão
      if (needs.length === 0) {
        needs.push('energia', 'sono')
      }
      
      // Mapear necessidades para produtos
      const productMap = {
        'sono': {
          name: 'Melatonina Premium',
          description: 'Suplemento natural para melhorar a qualidade do sono',
          category: 'sono',
          benefits: ['Melhora do sono', 'Relaxamento', 'Qualidade do descanso'],
          price: '$24.99',
          rating: 4.7,
          savings: 25
        },
        'energia': {
          name: 'Complexo de Vitaminas B',
          description: 'Energia sustentável e foco mental',
          category: 'energia', 
          benefits: ['Mais energia', 'Foco mental', 'Metabolismo ativo'],
          price: '$19.99',
          rating: 4.5,
          savings: 20
        },
        'emagrecimento': {
          name: 'Termogênico Natural',
          description: 'Acelera o metabolismo e queima de gordura',
          category: 'emagrecimento',
          benefits: ['Acelera metabolismo', 'Queima gordura', 'Energia'],
          price: '$29.99',
          rating: 4.3,
          savings: 30
        },
        'ansiedade': {
          name: 'Ashwagandha Orgânico',
          description: 'Reduz estresse e melhora o bem-estar',
          category: 'ansiedade',
          benefits: ['Reduz estresse', 'Melhora humor', 'Bem-estar'],
          price: '$22.99',
          rating: 4.6,
          savings: 22
        }
      }
      
      // Adicionar produtos baseados nas necessidades (máximo 4)
      const uniqueNeeds = [...new Set(needs)].slice(0, 4)
      
      uniqueNeeds.forEach((need, index) => {
        if (productMap[need as keyof typeof productMap]) {
          const product = productMap[need as keyof typeof productMap]
          products.push({
            name: product.name,
            description: product.description,
            asin: `B00${1000 + index}`,
            price: product.price,
            rating: product.rating,
            category: product.category,
            benefits: product.benefits,
            amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(product.name)}&tag=portalsolutio-20`,
            detailPageURL: `/produtos/${product.category}`,
            source: 'categoria',
            savings: product.savings,
            imageUrl: `https://via.placeholder.com/300x300/4ade80/ffffff?text=${product.name.replace(' ', '+')}`,
            featured: index === 0,
            shortUrl: `meuportalfit.com/produtos/${product.category}`
          })
        }
      })
      
      // Se não tem produtos suficientes, adicionar produtos padrão
      while (products.length < 4) {
        const defaultProducts = [
          {
            name: 'Multivitamínico Completo',
            description: 'Suplemento completo para sua saúde',
            category: 'vitaminas',
            benefits: ['Saúde geral', 'Imunidade', 'Energia'],
            price: '$18.99',
            rating: 4.4,
            savings: 15
          },
          {
            name: 'Ômega 3 Premium',
            description: 'Ácidos graxos essenciais para o coração',
            category: 'omega3',
            benefits: ['Saúde cardiovascular', 'Anti-inflamatório', 'Cérebro'],
            price: '$26.99',
            rating: 4.8,
            savings: 28
          }
        ]
        
        const defaultProduct = defaultProducts[products.length - uniqueNeeds.length] as typeof defaultProducts[0] | undefined
        if (defaultProduct) {
          products.push({
            name: defaultProduct.name,
            description: defaultProduct.description,
            asin: `B00${2000 + products.length}`,
            price: defaultProduct.price,
            rating: defaultProduct.rating,
            category: defaultProduct.category,
            benefits: defaultProduct.benefits,
            amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(defaultProduct.name)}&tag=portalsolutio-20`,
            detailPageURL: `/produtos/${defaultProduct.category}`,
            source: 'categoria',
            savings: defaultProduct.savings,
            imageUrl: `https://via.placeholder.com/300x300/3b82f6/ffffff?text=${defaultProduct.name.replace(' ', '+')}`,
            featured: false,
            shortUrl: `meuportalfit.com/produtos/${defaultProduct.category}`
          })
        }
      }
      
      return products.slice(0, 4) // Garantir máximo de 4 produtos
    }

    const recommendedProducts = generateRecommendedProducts(answers, detailed)
    
    // Calcular estatísticas
    const totalSavings = recommendedProducts.reduce((sum, product) => sum + product.savings, 0)
    const averageRating = recommendedProducts.reduce((sum, product) => sum + product.rating, 0) / recommendedProducts.length

    const response = {
      analysis,
      orientacoes,
      recommendedProducts,
      totalSavings,
      averageRating,
      userName: userName || 'Usuário',
      language: language || 'pt'
    }

    console.log('🎉 Resposta personalizada gerada!')
    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Erro na análise:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
}
