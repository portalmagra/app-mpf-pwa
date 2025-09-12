import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configuração do OpenAI (você precisará adicionar OPENAI_API_KEY no .env.local)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
});

export async function POST(request: NextRequest) {
  try {
    const { answers, userGoals, userName } = await request.json();

    // Se não há API key configurada, retorna resultado mock
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
      return NextResponse.json({
        success: true,
        result: getMockResult(answers, userGoals, userName),
        isMock: true
      });
    }

    // Análise com OpenAI
    const analysis = await analyzeWithOpenAI(answers, userGoals, userName);
    
    return NextResponse.json({
      success: true,
      result: analysis,
      isMock: false
    });

  } catch (error) {
    console.error('Error in analyze API:', error);
    
    // Fallback para resultado mock em caso de erro
    const { answers, userGoals, userName } = await request.json();
    return NextResponse.json({
      success: true,
      result: getMockResult(answers, userGoals, userName),
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

Crie uma análise completa com estrutura profissional:

1. ACOLHIMENTO: Mensagem acolhedora que mostra que entendeu o perfil
2. RECOMENDAÇÕES PERSONALIZADAS: 4 recomendações específicas baseadas no perfil
3. PRIORIDADES: 1-2 áreas de foco principal
4. FATORES DE RISCO: 2-3 alertas importantes para o perfil
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
      "link": "https://amazon.com/dp/PRODUTO?tag=meuportalfit-20",
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

function getMockResult(answers: number[], userGoals: string, userName: string) {
  // Lógica baseada nas respostas (como estava antes)
  const timeInUSA = answers[1];
  
  let resultType: string;
  if (timeInUSA === 1) {
    resultType = 'newcomer';
  } else if (timeInUSA === 2 || timeInUSA === 3) {
    resultType = 'established';
  } else {
    resultType = 'veteran';
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
      amazonProducts: [
        {
          name: "Complexo B Premium para Energia",
          link: "https://amzn.to/3x8K9mP?tag=meuportalfit-20",
          price: "$24.99",
          description: "Essencial para energia e foco durante a adaptação"
        },
        {
          name: "Ashwagandha - Adaptógeno Natural",
          link: "https://amzn.to/3x8K9mQ?tag=meuportalfit-20", 
          price: "$19.99",
          description: "Reduz estresse e melhora energia naturalmente"
        },
        {
          name: "Melatonina para Regular o Sono",
          link: "https://amzn.to/3x8K9mR?tag=meuportalfit-20",
          price: "$15.99",
          description: "Ajuda a regular o ciclo de sono nos EUA"
        }
      ],
      encouragement: `${userName}, você está fazendo o melhor por si mesma! Cada pequeno passo conta. 🇧🇷✨`,
      promise: "Receba receitas brasileiras adaptadas para os EUA e dicas exclusivas de adaptação cultural!"
    },
    established: {
      title: `Perfeito ${userName}! Brasileira Estabelecida - Otimização da Vida`,
      description: "Você já se adaptou, agora vamos otimizar sua saúde e performance.",
      plan: [
        "✅ Foque na otimização metabólica e gestão sustentável de peso",
        "✅ Implemente rotina diária de gestão de estresse",
        "✅ Priorize melhoria da qualidade do sono",
        "✅ Considere protocolo de suplementação direcionado",
        "✅ Planejamento nutricional e controle de porções"
      ],
      amazonProducts: [
        {
          name: "Proteína Whey Isolada Premium",
          link: "https://amzn.to/3x8K9mS",
          price: "$39.99",
          description: "Proteína de alta qualidade para otimização muscular"
        },
        {
          name: "Magnésio Glicinato para Relaxamento",
          link: "https://amzn.to/3x8K9mT",
          price: "$22.99",
          description: "Melhora qualidade do sono e reduz estresse"
        },
        {
          name: "Ômega 3 Premium para Saúde Cerebral",
          link: "https://amzn.to/3x8K9mU",
          price: "$29.99",
          description: "Suporte completo para saúde mental e física"
        }
      ],
      encouragement: `${userName}, você já conquistou tanto! Agora é hora de elevar sua performance ao próximo nível! 💪🇧🇷`
    },
    veteran: {
      title: `Impressionante ${userName}! Brasileira Experiente - Mastery Total`,
      description: "Você é uma veterana! Vamos focar em mastery e otimização avançada.",
      plan: [
        "✅ Protocolo avançado de biohacking e otimização",
        "✅ Gestão avançada de estresse e performance",
        "✅ Otimização de sono e recuperação",
        "✅ Suplementação estratégica e personalizada",
        "✅ Planejamento nutricional de alta performance"
      ],
      amazonProducts: [
        {
          name: "Creatina Monohidratada Premium",
          link: "https://amzn.to/3x8K9mV",
          price: "$34.99",
          description: "Para performance e força máxima"
        },
        {
          name: "L-Tirosina para Foco e Energia",
          link: "https://amzn.to/3x8K9mW",
          price: "$18.99",
          description: "Neurotransmissor para foco e energia mental"
        },
        {
          name: "ZMA para Recuperação e Sono",
          link: "https://amzn.to/3x8K9mX",
          price: "$24.99",
          description: "Mineral essencial para recuperação otimizada"
        }
      ],
      encouragement: `${userName}, você é uma inspiração! Sua experiência é seu maior ativo. Vamos maximizar seu potencial! 🚀🇧🇷`
    }
  };

  return mockResults[resultType as keyof typeof mockResults];
}
