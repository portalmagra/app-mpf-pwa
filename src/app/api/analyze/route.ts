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

⚠️ INFORMAÇÕES CRÍTICAS PARA CONSIDERAR:

${detailed?.usesMedication === 'Sim' ? `
💊 MEDICAMENTOS EM USO:
- Status: ${detailed.usesMedication}
- Detalhes: ${detailed.medicationDetails || 'Não especificado'}
- ⚠️ CRÍTICO: Todas as recomendações devem ser compatíveis com os medicamentos
- ⚠️ CRÍTICO: Evitar interações medicamentosas perigosas
` : ''}

${detailed?.usesSupplements === 'Sim' ? `
💊 SUPLEMENTOS EM USO:
- Status: ${detailed.usesSupplements}
- Detalhes: ${detailed.supplementsDetails || 'Não especificado'}
- ⚠️ IMPORTANTE: Considerar suplementos já em uso para evitar duplicação
- ⚠️ IMPORTANTE: Verificar compatibilidade com novos suplementos
` : ''}

${detailed?.foodRestrictions === 'Sim' ? `
🚫 RESTRIÇÕES ALIMENTARES:
- Status: ${detailed.foodRestrictions}
- Detalhes: ${detailed.foodRestrictionsDetails || 'Não especificado'}
- ⚠️ OBRIGATÓRIO: Todas as recomendações devem respeitar essas restrições
- ⚠️ OBRIGATÓRIO: NÃO recomendar alimentos que violem as restrições
` : ''}

${detailed?.healthIssues === 'Sim' ? `
🏥 CONDIÇÕES DE SAÚDE:
- Status: ${detailed.healthIssues}
- Detalhes: ${detailed.healthIssuesDetails || 'Não especificado'}
- ⚠️ CRÍTICO: Todas as recomendações devem ser seguras para essas condições
- ⚠️ CRÍTICO: Considerar limitações e cuidados especiais
` : ''}

${detailed?.wakeUpTime || detailed?.sleepTime ? `
⏰ HORÁRIOS DE SONO:
- Acorda: ${detailed.wakeUpTime || 'Não informado'}
- Dorme: ${detailed.sleepTime || 'Não informado'}
- Qualidade: ${detailed.sleepQuality || 'Não informado'}
- 💡 IMPORTANTE: Personalizar recomendações baseadas nos horários
` : ''}

${detailed?.mainConcern ? `
🎯 PRINCIPAL PREOCUPAÇÃO:
- ${detailed.mainConcern}
- 💡 FOCO: Priorizar soluções para esta preocupação específica
` : ''}

${detailed?.improvementAreas?.length > 0 ? `
🎯 ÁREAS DE MELHORIA:
- ${detailed.improvementAreas.join(', ')}
- 💡 FOCO: Direcionar recomendações para essas áreas específicas
` : ''}

INSTRUÇÕES OBRIGATÓRIAS:
1. SEMPRE considere e respeite TODAS as restrições alimentares mencionadas
2. SEMPRE considere TODAS as condições de saúde mencionadas
3. SEMPRE considere medicamentos em uso para evitar interações
4. SEMPRE considere suplementos já em uso para evitar duplicação
5. SEMPRE personalize baseado nos horários de sono informados
6. SEMPRE foque nas áreas de melhoria específicas mencionadas
7. NÃO recomende nada que viole restrições ou cause interações
8. Forneça alternativas seguras para cada limitação
9. Use linguagem acolhedora e profissional
10. Inclua emojis para tornar mais visual e acolhedor
11. Inclua uma seção "**Soluções práticas:**" com 3-5 dicas específicas

FORMATO DE RESPOSTA:
**Análise Personalizada:**
[Sua análise detalhada e personalizada aqui, considerando TODAS as informações críticas acima]

**Soluções práticas:**
- [Dica 1 específica com emoji, respeitando todas as restrições]
- [Dica 2 específica com emoji, respeitando todas as restrições] 
- [Dica 3 específica com emoji, respeitando todas as restrições]
- [Dica 4 específica com emoji, respeitando todas as restrições]
- [Dica 5 específica com emoji, respeitando todas as restrições]

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
      let needs: string[] = []
      const restrictions: string[] = []
      const medications: string[] = []
      const supplements: string[] = []
      
      // === ANÁLISE DE NECESSIDADES ===
      
      // Sono - considerar horários e qualidade
      if (detailed?.sleepQuality === 'Ruim' || detailed?.sleepTime || detailed?.wakeUpTime) {
        needs.push('sono')
      }
      
      // Energia - considerar áreas de melhoria e preocupações
      if (detailed?.improvementAreas?.includes('Ter mais energia') || 
          detailed?.improvementAreas?.includes('Melhorar a concentração') ||
          detailed?.mainConcern?.toLowerCase().includes('cansaço') ||
          detailed?.mainConcern?.toLowerCase().includes('energia')) {
        needs.push('energia')
      }
      
      // Emagrecimento - considerar preocupações e áreas de melhoria
      if (detailed?.mainConcern?.toLowerCase().includes('peso') || 
          detailed?.improvementAreas?.includes('Perder peso') ||
          detailed?.improvementAreas?.includes('Desinflamar o corpo')) {
        needs.push('emagrecimento')
      }
      
      // Ansiedade/Estresse - considerar áreas de melhoria
      if (detailed?.improvementAreas?.includes('Reduzir o estresse') ||
          detailed?.improvementAreas?.includes('Melhorar a concentração') ||
          detailed?.mainConcern?.toLowerCase().includes('estresse') ||
          detailed?.mainConcern?.toLowerCase().includes('ansiedade')) {
        needs.push('ansiedade')
      }
      
      // Intestino - considerar áreas de melhoria
      if (detailed?.improvementAreas?.includes('Melhorar o intestino') ||
          detailed?.mainConcern?.toLowerCase().includes('intestino') ||
          detailed?.mainConcern?.toLowerCase().includes('digestão')) {
        needs.push('intestino')
      }
      
      // Imunidade - considerar áreas de melhoria
      if (detailed?.improvementAreas?.includes('Fortalecer o sistema imunológico') ||
          detailed?.mainConcern?.toLowerCase().includes('imunidade') ||
          detailed?.mainConcern?.toLowerCase().includes('gripe')) {
        needs.push('imunidade')
      }
      
      // === ANÁLISE DE RESTRIÇÕES E LIMITAÇÕES ===
      
      // Restrições alimentares
      if (detailed?.foodRestrictions === 'Sim' && detailed?.foodRestrictionsDetails) {
        const restrictionsText = detailed.foodRestrictionsDetails.toLowerCase()
        if (restrictionsText.includes('glúten') || restrictionsText.includes('gluten')) {
          restrictions.push('gluten-free')
        }
        if (restrictionsText.includes('lactose') || restrictionsText.includes('lácteo')) {
          restrictions.push('lactose-free')
        }
        if (restrictionsText.includes('vegano') || restrictionsText.includes('vegan')) {
          restrictions.push('vegan')
        }
        if (restrictionsText.includes('vegetariano') || restrictionsText.includes('vegetarian')) {
          restrictions.push('vegetarian')
        }
      }
      
      // Medicamentos em uso
      if (detailed?.usesMedication === 'Sim' && detailed?.medicationDetails) {
        const medsText = detailed.medicationDetails.toLowerCase()
        if (medsText.includes('anticoagulante') || medsText.includes('warfarina') || medsText.includes('aspirina')) {
          medications.push('anticoagulant')
        }
        if (medsText.includes('diabetes') || medsText.includes('metformina') || medsText.includes('insulina')) {
          medications.push('diabetes')
        }
        if (medsText.includes('pressão') || medsText.includes('hipertensão') || medsText.includes('losartan')) {
          medications.push('hypertension')
        }
        if (medsText.includes('colesterol') || medsText.includes('estatina') || medsText.includes('sinvastatina')) {
          medications.push('cholesterol')
        }
      }
      
      // Suplementos já em uso
      if (detailed?.usesSupplements === 'Sim' && detailed?.supplementsDetails) {
        const suppsText = detailed.supplementsDetails.toLowerCase()
        if (suppsText.includes('vitamina d') || suppsText.includes('vitamin d')) {
          supplements.push('vitamin-d')
        }
        if (suppsText.includes('magnésio') || suppsText.includes('magnesium')) {
          supplements.push('magnesium')
        }
        if (suppsText.includes('b12') || suppsText.includes('vitamina b')) {
          supplements.push('vitamin-b')
        }
        if (suppsText.includes('ômega') || suppsText.includes('omega')) {
          supplements.push('omega-3')
        }
      }
      
      // === FILTRAR NECESSIDADES BASEADO EM RESTRIÇÕES ===
      
      // Remover necessidades que conflitam com medicamentos
      if (medications.includes('anticoagulant')) {
        needs = needs.filter(need => !['emagrecimento'].includes(need)) // Evitar termogênicos
      }
      
      if (medications.includes('diabetes')) {
        needs = needs.filter(need => !['emagrecimento'].includes(need)) // Evitar termogênicos
      }
      
      // Se não identificou necessidades específicas, usar padrão seguro
      if (needs.length === 0) {
        needs.push('energia', 'sono')
      }
      
      // Mapear necessidades para produtos (considerando restrições)
      const productMap = {
        'sono': {
          name: 'Melatonina Premium',
          description: 'Suplemento natural para melhorar a qualidade do sono',
          category: 'sono',
          benefits: ['Melhora do sono', 'Relaxamento', 'Qualidade do descanso'],
          price: '$24.99',
          rating: 4.7,
          savings: 25,
          restrictions: [], // Sem restrições
          medications: [] // Sem interações conhecidas
        },
        'energia': {
          name: 'Complexo de Vitaminas B',
          description: 'Energia sustentável e foco mental',
          category: 'energia', 
          benefits: ['Mais energia', 'Foco mental', 'Metabolismo ativo'],
          price: '$19.99',
          rating: 4.5,
          savings: 20,
          restrictions: [], // Sem restrições
          medications: [] // Sem interações conhecidas
        },
        'emagrecimento': {
          name: 'Termogênico Natural',
          description: 'Acelera o metabolismo e queima de gordura',
          category: 'emagrecimento',
          benefits: ['Acelera metabolismo', 'Queima gordura', 'Energia'],
          price: '$29.99',
          rating: 4.3,
          savings: 30,
          restrictions: [], // Sem restrições
          medications: ['anticoagulant', 'diabetes', 'hypertension'] // Interações conhecidas
        },
        'ansiedade': {
          name: 'Ashwagandha Orgânico',
          description: 'Reduz estresse e melhora o bem-estar',
          category: 'ansiedade',
          benefits: ['Reduz estresse', 'Melhora humor', 'Bem-estar'],
          price: '$22.99',
          rating: 4.6,
          savings: 22,
          restrictions: [], // Sem restrições
          medications: ['hypertension'] // Interação com pressão arterial
        },
        'intestino': {
          name: 'Probióticos Premium',
          description: 'Suplemento para saúde intestinal e digestão',
          category: 'intestino',
          benefits: ['Saúde intestinal', 'Digestão', 'Imunidade'],
          price: '$34.99',
          rating: 4.4,
          savings: 28,
          restrictions: ['lactose-free'], // Pode conter lactose
          medications: [] // Sem interações conhecidas
        },
        'imunidade': {
          name: 'Vitamina D3 + C',
          description: 'Fortalecimento do sistema imunológico',
          category: 'imunidade',
          benefits: ['Imunidade', 'Saúde óssea', 'Energia'],
          price: '$27.99',
          rating: 4.8,
          savings: 25,
          restrictions: [], // Sem restrições
          medications: ['cholesterol'] // Interação com estatinas
        }
      }
      
      // Adicionar produtos baseados nas necessidades (máximo 4)
      const uniqueNeeds = [...new Set(needs)].slice(0, 4)
      
      uniqueNeeds.forEach((need, index) => {
        if (productMap[need as keyof typeof productMap]) {
          const product = productMap[need as keyof typeof productMap]
          
          // Verificar se o produto é compatível com restrições e medicamentos
          let isCompatible = true
          let compatibilityReason = ''
          
          // Verificar restrições alimentares
          if (product.restrictions && product.restrictions.length > 0) {
            for (const restriction of product.restrictions) {
              if (restrictions.includes(restriction)) {
                isCompatible = false
                compatibilityReason = `Incompatível com restrição: ${restriction}`
                break
              }
            }
          }
          
          // Verificar interações medicamentosas
          if (product.medications && product.medications.length > 0) {
            for (const medication of product.medications) {
              if (medications.includes(medication)) {
                isCompatible = false
                compatibilityReason = `Interação medicamentosa: ${medication}`
                break
              }
            }
          }
          
          // Verificar se já usa o suplemento
          if (supplements.includes(need.replace('-', '_'))) {
            isCompatible = false
            compatibilityReason = 'Já está usando este suplemento'
          }
          
          // Adicionar produto se for compatível
          if (isCompatible) {
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
              shortUrl: `meuportalfit.com/produtos/${product.category}`,
              compatibility: {
                isCompatible: true,
                reason: 'Compatível com seu perfil'
              }
            })
          } else {
            console.log(`⚠️ Produto ${product.name} não adicionado: ${compatibilityReason}`)
          }
        }
      })
      
      // Se não tem produtos suficientes, adicionar produtos padrão seguros
      while (products.length < 4) {
        const defaultProducts = [
          {
            name: 'Multivitamínico Completo',
            description: 'Suplemento completo para sua saúde',
            category: 'vitaminas',
            benefits: ['Saúde geral', 'Imunidade', 'Energia'],
            price: '$18.99',
            rating: 4.4,
            savings: 15,
            restrictions: [], // Sem restrições
            medications: [] // Sem interações conhecidas
          },
          {
            name: 'Ômega 3 Premium',
            description: 'Ácidos graxos essenciais para o coração',
            category: 'omega3',
            benefits: ['Saúde cardiovascular', 'Anti-inflamatório', 'Cérebro'],
            price: '$26.99',
            rating: 4.8,
            savings: 28,
            restrictions: [], // Sem restrições
            medications: ['anticoagulant'] // Interação com anticoagulantes
          },
          {
            name: 'Magnésio Glicinato',
            description: 'Relaxamento muscular e qualidade do sono',
            category: 'sono',
            benefits: ['Relaxamento', 'Sono', 'Músculos'],
            price: '$21.99',
            rating: 4.6,
            savings: 22,
            restrictions: [], // Sem restrições
            medications: [] // Sem interações conhecidas
          },
          {
            name: 'Vitamina C Natural',
            description: 'Antioxidante para imunidade e energia',
            category: 'imunidade',
            benefits: ['Imunidade', 'Antioxidante', 'Energia'],
            price: '$16.99',
            rating: 4.5,
            savings: 18,
            restrictions: [], // Sem restrições
            medications: [] // Sem interações conhecidas
          }
        ]
        
        const defaultProduct = defaultProducts[products.length - uniqueNeeds.length] as typeof defaultProducts[0] | undefined
        if (defaultProduct) {
          // Verificar compatibilidade do produto padrão
          let isCompatible = true
          let compatibilityReason = ''
          
          // Verificar restrições alimentares
          if (defaultProduct.restrictions && defaultProduct.restrictions.length > 0) {
            for (const restriction of defaultProduct.restrictions) {
              if (restrictions.includes(restriction)) {
                isCompatible = false
                compatibilityReason = `Incompatível com restrição: ${restriction}`
                break
              }
            }
          }
          
          // Verificar interações medicamentosas
          if (defaultProduct.medications && defaultProduct.medications.length > 0) {
            for (const medication of defaultProduct.medications) {
              if (medications.includes(medication)) {
                isCompatible = false
                compatibilityReason = `Interação medicamentosa: ${medication}`
                break
              }
            }
          }
          
          // Adicionar produto se for compatível
          if (isCompatible) {
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
              shortUrl: `meuportalfit.com/produtos/${defaultProduct.category}`,
              compatibility: {
                isCompatible: true,
                reason: 'Compatível com seu perfil'
              }
            })
          } else {
            console.log(`⚠️ Produto padrão ${defaultProduct.name} não adicionado: ${compatibilityReason}`)
          }
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
