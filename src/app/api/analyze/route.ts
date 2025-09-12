import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase';
import { getProductsByASIN } from '@/lib/amazon-api';

// Configuração do OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
});

export async function POST(request: NextRequest) {
  try {
    const { answers, userGoals, userName } = await request.json();

    // Salvar avaliação no banco de dados
    const { data: evaluation, error: evalError } = await supabaseAdmin
      .from('user_evaluations')
      .insert({
        user_name: userName,
        user_age: answers.age || 'not_specified',
        answers: answers,
        comments: userGoals,
        language: 'pt'
      })
      .select()
      .single();

    if (evalError) {
      console.error('Erro ao salvar avaliação:', evalError);
    }

    // Se não há API key configurada, retorna resultado mock
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
      const mockResult = await getMockResult(answers, userGoals, userName);
      
      // Salvar resultado mock no banco
      if (evaluation) {
        await supabaseAdmin
          .from('analysis_results')
          .insert({
            evaluation_id: evaluation.id,
            personalized_recommendations: mockResult.personalizedRecommendations,
            priority_areas: mockResult.priorityAreas,
            risk_factors: mockResult.riskFactors,
            new_habits: mockResult.newHabits,
            next_steps: mockResult.nextSteps,
            amazon_products: mockResult.amazonProducts,
            encouragement: mockResult.encouragement,
            promise: mockResult.promise
          });
      }

      return NextResponse.json({
        success: true,
        result: mockResult,
        isMock: true,
        evaluationId: evaluation?.id
      });
    }

    // Análise com OpenAI
    const analysis = await analyzeWithOpenAI(answers, userGoals, userName);
    
    // Salvar resultado da análise no banco
    if (evaluation) {
      await supabaseAdmin
        .from('analysis_results')
        .insert({
          evaluation_id: evaluation.id,
          personalized_recommendations: analysis.personalizedRecommendations,
          priority_areas: analysis.priorityAreas,
          risk_factors: analysis.riskFactors,
          new_habits: analysis.newHabits,
          next_steps: analysis.nextSteps,
          amazon_products: analysis.amazonProducts,
          encouragement: analysis.encouragement,
          promise: analysis.promise
        });
    }
    
    return NextResponse.json({
      success: true,
      result: analysis,
      isMock: false,
      evaluationId: evaluation?.id
    });

  } catch (error) {
    console.error('Error in analyze API:', error);
    
    // Fallback para resultado mock em caso de erro
    const { answers, userGoals, userName } = await request.json();
    return NextResponse.json({
      success: true,
      result: await getMockResult(answers, userGoals, userName),
      isMock: true,
      error: 'OpenAI analysis failed, using mock data'
    });
  }
}

async function analyzeWithOpenAI(answers: number[], userGoals: string, userName: string) {
  const prompt = `
Analise o perfil de uma brasileira nos EUA baseado nas respostas do quiz:

Nome: ${userName}
Objetivos pessoais: ${userGoals || 'Não especificado'}

Respostas do quiz:
1. Tempo nos EUA: ${answers[1] === 1 ? 'Menos de 1 ano' : answers[1] === 2 ? '1-3 anos' : answers[1] === 3 ? '3-5 anos' : '5+ anos'}
2. Estilo de vida: ${answers[2] === 1 ? 'Vida agitada' : answers[2] === 2 ? 'Vida equilibrada' : answers[2] === 3 ? 'Vida flexível' : 'Vida sedentária'}
3. Objetivo principal: ${answers[3] === 1 ? 'Perder peso' : answers[3] === 2 ? 'Ganhar massa muscular' : answers[3] === 3 ? 'Melhorar bem-estar' : 'Aumentar performance'}
4. Tentativas anteriores: ${answers[4] === 1 ? '1-2 vezes' : answers[4] === 2 ? '3-5 vezes' : answers[4] === 3 ? '6-10 vezes' : '10+ vezes'}
5. Tempo para resultados: ${answers[5] === 1 ? '1-2 semanas' : answers[5] === 2 ? '1 mês' : answers[5] === 3 ? '3 meses' : '6+ meses'}
6. Disposição para mudar: ${answers[6] === 1 ? 'Mudar hábitos alimentares' : answers[6] === 2 ? 'Adicionar exercícios' : answers[6] === 3 ? 'Suplementação inteligente' : 'Tudo junto'}

Crie uma análise PERSONALIZADA e ÚNICA baseada no perfil específico. Evite mensagens genéricas como "entendo perfeitamente os desafios de se adaptar aos EUA".

Seja específica sobre:
- O tempo que ela está nos EUA e os desafios específicos dessa fase
- Seu estilo de vida atual e como isso afeta seus objetivos  
- Suas tentativas anteriores e o que isso revela sobre sua jornada
- Sua disposição para mudança e como trabalhar com isso

IMPORTANTE: 
- Use o nome ${userName} na mensagem de acolhimento
- Seja específica sobre adaptação cultural baseada no tempo nos EUA
- Mencione desafios específicos do estilo de vida dela
- Crie mensagens de encorajamento únicas baseadas no perfil

1. ACOLHIMENTO: Mensagem acolhedora PERSONALIZADA que mostra que entendeu o perfil específico
2. RECOMENDAÇÕES PERSONALIZADAS: 4 recomendações específicas baseadas no perfil
3. PRIORIDADES: 1-2 áreas de foco principal específicas para ela
4. FATORES DE RISCO: 2-3 alertas importantes para o perfil específico
5. NOVOS HÁBITOS: 5 hábitos específicos para implementar
6. PRÓXIMOS PASSOS: 4 ações concretas para começar
7. PRODUTOS AMAZON: 3 produtos com links reais e tag de afiliado

Responda em JSON com esta estrutura:
{
  "title": "Título personalizado motivacional",
  "description": "Mensagem de acolhimento que mostra compreensão",
  "personalizedRecommendations": [
    "Recomendação 1 específica",
    "Recomendação 2 específica", 
    "Recomendação 3 específica",
    "Recomendação 4 específica"
  ],
  "priorityAreas": [
    "Área de foco principal"
  ],
  "riskFactors": [
    "Fator de risco 1",
    "Fator de risco 2"
  ],
  "newHabits": [
    "Hábito 1 específico",
    "Hábito 2 específico",
    "Hábito 3 específico", 
    "Hábito 4 específico",
    "Hábito 5 específico"
  ],
  "nextSteps": [
    "Próximo passo 1",
    "Próximo passo 2",
    "Próximo passo 3",
    "Próximo passo 4"
  ],
  "amazonProducts": [
    {
      "name": "Nome do produto",
      "link": "https://amazon.com/dp/PRODUTO?tag=portalsolutio-20",
      "price": "$XX.XX",
      "description": "Por que este produto é ideal para você"
    }
  ],
  "encouragement": "Mensagem motivacional personalizada",
  "promise": "Promessa de receitas e dicas exclusivas"
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Você é uma coach brasileira especializada em ajudar mulheres brasileiras nos EUA. Seja acolhedora, prática e motivacional. Sempre inclua produtos Amazon reais."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1500
  });

  const response = completion.choices[0].message.content;
  return JSON.parse(response || '{}');
}

// Função para selecionar produtos baseados no perfil específico
function selectProductsForProfile(profile: {
  timeInUSA: number;
  lifestyle: number;
  mainGoal: number;
  previousAttempts: number;
  timeForResults: number;
  willingnessToChange: number;
}) {
  // Base de produtos disponíveis
  const productDatabase = {
    // Produtos para energia e adaptação
    energy: [
      {
        name: "Complexo B Premium para Energia",
        url: "https://amzn.to/3x8K9mP?tag=portalsolutio-20",
        price: "$24.99",
        description: "Essencial para energia e foco durante a adaptação"
      },
      {
        name: "Ashwagandha - Adaptógeno Natural",
        url: "https://amzn.to/3x8K9mQ?tag=portalsolutio-20",
        price: "$19.99",
        description: "Reduz estresse e melhora energia naturalmente"
      }
    ],
    // Produtos para sono
    sleep: [
      {
        name: "Melatonina para Regular o Sono",
        url: "https://amzn.to/3x8K9mR?tag=portalsolutio-20",
        price: "$15.99",
        description: "Ajuda a regular o ciclo de sono nos EUA"
      },
      {
        name: "Magnésio para Relaxamento",
        url: "https://amzn.to/3x8K9mS?tag=portalsolutio-20",
        price: "$22.99",
        description: "Promove relaxamento e qualidade do sono"
      }
    ],
    // Produtos para perda de peso
    weightLoss: [
      {
        name: "Proteína Whey Isolada",
        url: "https://amzn.to/3x8K9mT?tag=portalsolutio-20",
        price: "$34.99",
        description: "Apoia perda de peso e ganho de massa muscular"
      },
      {
        name: "Óleo de Coco Orgânico",
        url: "https://amzn.to/3x8K9mU?tag=portalsolutio-20",
        price: "$18.99",
        description: "Acelera metabolismo e queima de gordura"
      }
    ],
    // Produtos para ganho de massa
    muscleGain: [
      {
        name: "Creatina Monohidratada",
        url: "https://amzn.to/3x8K9mV?tag=portalsolutio-20",
        price: "$28.99",
        description: "Aumenta força e massa muscular"
      },
      {
        name: "BCAA para Recuperação",
        url: "https://amzn.to/3x8K9mW?tag=portalsolutio-20",
        price: "$25.99",
        description: "Melhora recuperação e crescimento muscular"
      }
    ],
    // Produtos para bem-estar geral
    wellness: [
      {
        name: "Multivitamínico Completo",
        url: "https://amzn.to/3x8K9mX?tag=portalsolutio-20",
        price: "$29.99",
        description: "Suporte nutricional completo para brasileiras nos EUA"
      },
      {
        name: "Ômega 3 Premium",
        url: "https://amzn.to/3x8K9mY?tag=portalsolutio-20",
        price: "$32.99",
        description: "Suporte para saúde cardiovascular e cerebral"
      }
    ]
  };

  const selectedProducts = [];

  // Lógica de seleção baseada no perfil
  if (profile.timeInUSA === 1) {
    // Recém-chegada: foco em adaptação e energia
    selectedProducts.push(productDatabase.energy[0]);
    selectedProducts.push(productDatabase.sleep[0]);
    selectedProducts.push(productDatabase.wellness[0]);
  } else if (profile.mainGoal === 1) {
    // Objetivo: Perder peso
    selectedProducts.push(productDatabase.weightLoss[0]);
    selectedProducts.push(productDatabase.energy[1]);
    selectedProducts.push(productDatabase.wellness[1]);
  } else if (profile.mainGoal === 2) {
    // Objetivo: Ganhar massa muscular
    selectedProducts.push(productDatabase.muscleGain[0]);
    selectedProducts.push(productDatabase.muscleGain[1]);
    selectedProducts.push(productDatabase.weightLoss[0]);
  } else if (profile.lifestyle === 1) {
    // Vida agitada: foco em energia e estresse
    selectedProducts.push(productDatabase.energy[0]);
    selectedProducts.push(productDatabase.energy[1]);
    selectedProducts.push(productDatabase.sleep[1]);
  } else if (profile.willingnessToChange === 3) {
    // Disposta a suplementação: produtos mais avançados
    selectedProducts.push(productDatabase.wellness[0]);
    selectedProducts.push(productDatabase.wellness[1]);
    selectedProducts.push(productDatabase.energy[1]);
  } else {
    // Perfil equilibrado: produtos gerais
    selectedProducts.push(productDatabase.wellness[0]);
    selectedProducts.push(productDatabase.sleep[0]);
    selectedProducts.push(productDatabase.energy[0]);
  }

  return selectedProducts;
}

// Função para buscar produtos reais da Amazon baseado no perfil
async function getRealAmazonProducts(profile: any) {
  try {
    const keywords = [];
    
    // Definir palavras-chave baseadas no perfil
    if (profile.timeInUSA === 1) {
      keywords.push('vitaminas', 'energia', 'adaptação', 'stress');
    } else if (profile.mainGoal === 1) {
      keywords.push('emagrecimento', 'queima gordura', 'metabolismo');
    } else if (profile.mainGoal === 2) {
      keywords.push('proteína', 'massa muscular', 'whey protein');
    } else if (profile.mainGoal === 3) {
      keywords.push('bem-estar', 'saúde', 'vitaminas', 'minerais');
    }

    // Buscar produtos na Amazon usando ASINs específicos
    const products = await getProductsByASIN([
      'B08N5WRWNW', // Vitamina D3
      'B07VJ7GMW7', // Whey Protein
      'B08K9K9K9K'  // Multivitamínico
    ]);

    // Converter para formato esperado
    return products.map((product: any) => ({
      name: product.ItemInfo?.Title?.DisplayValue || 'Produto Amazon',
      price: product.Offers?.Listings?.[0]?.Price?.DisplayAmount || '$19.99',
      description: product.ItemInfo?.Features?.DisplayValues?.[0] || 'Produto recomendado para brasileiras nos EUA',
      url: `https://amazon.com/dp/${product.ASIN}?tag=${process.env.AMAZON_ASSOCIATE_TAG}`
    }));
  } catch (error) {
    console.error('Erro ao buscar produtos Amazon:', error);
    return [];
  }
}

async function getMockResult(answers: number[], userGoals: string, userName: string) {
  // Lógica personalizada baseada nas respostas específicas
  const timeInUSA = answers[1];
  const lifestyle = answers[2];
  const mainGoal = answers[3];
  const previousAttempts = answers[4];
  const timeForResults = answers[5];
  const willingnessToChange = answers[6];
  
  let resultType: string;
  if (timeInUSA === 1) {
    resultType = 'newcomer';
  } else if (timeInUSA === 2 || timeInUSA === 3) {
    resultType = 'established';
  } else {
    resultType = 'veteran';
  }

  // Tentar buscar produtos reais da Amazon, senão usar mock
  let selectedProducts;
  try {
    selectedProducts = await getRealAmazonProducts({
      timeInUSA,
      lifestyle,
      mainGoal,
      previousAttempts,
      timeForResults,
      willingnessToChange
    });
    if (selectedProducts.length === 0) {
      selectedProducts = selectProductsForProfile({
        timeInUSA,
        lifestyle,
        mainGoal,
        previousAttempts,
        timeForResults,
        willingnessToChange
      });
    }
  } catch (error) {
    console.error('Erro ao buscar produtos reais, usando mock:', error);
    selectedProducts = selectProductsForProfile({
      timeInUSA,
      lifestyle,
      mainGoal,
      previousAttempts,
      timeForResults,
      willingnessToChange
    });
  }

  const mockResults = {
    newcomer: {
      title: `Olá ${userName}! Brasileira Recém-Chegada - Adaptação Inteligente`,
      description: "Entendo perfeitamente os desafios de se adaptar aos EUA. Você não está sozinha! Vamos criar um plano que respeita sua jornada única.",
      personalizedRecommendations: [
        "Foque na adaptação metabólica gradual - Seu corpo precisa de tempo",
        "Implemente rotina de gestão de estresse cultural",
        "Priorize qualidade do sono para recuperação",
        "Considere suplementação para deficiências comuns"
      ],
      priorityAreas: [
        "Adaptação cultural e bem-estar emocional"
      ],
      riskFactors: [
        "Alto nível de estresse pode impactar saúde geral",
        "Mudanças de fuso horário podem afetar energia e recuperação"
      ],
      newHabits: [
        "Inclua vitaminas do complexo B na sua dieta - Essenciais para energia e foco",
        "Experimente um adaptógeno natural - Ajuda com estresse e energia", 
        "Priorize um sono de qualidade - Fundamental para adaptação",
        "Regule seu ciclo de sono - Importante para mudanças de fuso horário",
        "Crie uma rotina relaxante antes de dormir - Ajuda com o estresse"
      ],
      nextSteps: [
        "Consulte um profissional sobre necessidades de suplementação",
        "Comece com a área de maior prioridade para máximo impacto",
        "Acompanhe progresso semanalmente para ajustar abordagem",
        "Considere plano abrangente de 30 dias para melhoria sistemática"
      ],
      amazonProducts: selectedProducts,
      encouragement: `${userName}, você está fazendo o melhor por si mesma! Cada pequeno passo conta. 🇧🇷✨`,
      promise: "Receba receitas brasileiras adaptadas para os EUA e dicas exclusivas de adaptação cultural!"
    },
    established: {
      title: `Perfeito ${userName}! Brasileira Estabelecida - Otimização da Vida`,
      description: "Você já se adaptou, agora vamos otimizar sua saúde e performance.",
      personalizedRecommendations: [
        "Foque na otimização metabólica e gestão sustentável de peso",
        "Implemente rotina diária de gestão de estresse",
        "Priorize melhoria da qualidade do sono",
        "Considere protocolo de suplementação direcionado"
      ],
      priorityAreas: [
        "Otimização metabólica e performance",
        "Gestão sustentável de peso",
        "Qualidade do sono e recuperação"
      ],
      riskFactors: [
        "Estresse crônico pode impactar metabolismo",
        "Má qualidade do sono afeta performance geral"
      ],
      newHabits: [
        "Inclua proteína whey isolada na sua rotina - Essencial para otimização muscular",
        "Experimente magnésio glicinato - Melhora qualidade do sono e reduz estresse",
        "Priorize ômega 3 premium - Suporte completo para saúde mental e física",
        "Crie rotina de gestão de estresse - Fundamental para performance",
        "Implemente controle de porções - Importante para gestão de peso"
      ],
      nextSteps: [
        "Comece com suplementação básica para otimização",
        "Implemente rotina de exercícios consistente",
        "Monitore progresso mensalmente",
        "Considere coaching personalizado para próximo nível"
      ],
      amazonProducts: selectedProducts,
      encouragement: `${userName}, você já conquistou tanto! Agora é hora de elevar sua performance ao próximo nível! 💪🇧🇷`,
      promise: "Receba receitas brasileiras adaptadas para os EUA e dicas exclusivas de otimização!"
    },
    veteran: {
      title: `Impressionante ${userName}! Brasileira Experiente - Mastery Total`,
      description: "Você é uma veterana! Vamos focar em mastery e otimização avançada.",
      personalizedRecommendations: [
        "Protocolo avançado de biohacking e otimização",
        "Gestão avançada de estresse e performance",
        "Otimização de sono e recuperação",
        "Suplementação estratégica e personalizada"
      ],
      priorityAreas: [
        "Biohacking e otimização avançada",
        "Performance e mastery",
        "Recuperação e longevidade"
      ],
      riskFactors: [
        "Over-training pode levar a burnout",
        "Suplementação excessiva pode ser contraproducente"
      ],
      newHabits: [
        "Inclua creatina monohidratada premium - Para performance e força máxima",
        "Experimente L-tirosina - Neurotransmissor para foco e energia mental",
        "Priorize ZMA para recuperação - Mineral essencial para recuperação otimizada",
        "Implemente protocolo de biohacking - Para mastery total",
        "Crie rotina de recuperação avançada - Fundamental para longevidade"
      ],
      nextSteps: [
        "Implemente protocolo avançado de suplementação",
        "Monitore biomarkers para otimização",
        "Considere coaching de elite para mastery",
        "Planeje estratégia de longevidade"
      ],
      amazonProducts: selectedProducts,
      encouragement: `${userName}, você é uma inspiração! Sua experiência é seu maior ativo. Vamos maximizar seu potencial! 🚀🇧🇷`,
      promise: "Receba receitas brasileiras adaptadas para os EUA e dicas exclusivas de mastery!"
    }
  };

  return mockResults[resultType as keyof typeof mockResults];
}
