'use client';

import { useState } from 'react';
import { WHATSAPP_CONFIG, getWhatsAppUrl } from '@/config/whatsapp';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  values: number[];
}

interface QuizResult {
  title: string;
  description: string;
  plan?: string[];
  personalizedRecommendations?: string[];
  priorityAreas?: string[];
  riskFactors?: string[];
  newHabits?: string[];
  nextSteps?: string[];
  amazonProducts: {
    name: string;
    link: string;
    price: string;
    description?: string;
  }[];
  encouragement?: string;
  promise?: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Antes de começarmos, me conte um pouco sobre você:",
    options: [
      "18-25 anos",
      "26-35 anos", 
      "36-45 anos",
      "46+ anos"
    ],
    values: [1, 2, 3, 4]
  },
  {
    id: 2,
    question: "Quanto tempo você vive nos Estados Unidos?",
    options: [
      "Menos de 1 ano (Recém-chegado)",
      "1-3 anos (Estabelecido)",
      "3-5 anos (Adaptado)",
      "5+ anos (Veterano)"
    ],
    values: [1, 2, 3, 4]
  },
  {
    id: 3,
    question: "Qual seu estilo de vida atual?",
    options: [
      "Vida agitada (Muito trabalho, pouco tempo)",
      "Vida equilibrada (Tenta manter hábitos)",
      "Vida flexível (Adapta-se às mudanças)",
      "Vida sedentária (Pouca atividade física)"
    ],
    values: [1, 2, 3, 4]
  },
  {
    id: 4,
    question: "Qual seu objetivo principal? (Seja específico)",
    options: [
      "Perder peso (Já tentou dietas sem sucesso)",
      "Ganhar massa muscular (Quer se sentir forte)",
      "Melhorar o bem-estar geral (Quer mais qualidade de vida)",
      "Aumentar a performance (Quer ser melhor em tudo)"
    ],
    values: [1, 2, 3, 4]
  },
  {
    id: 5,
    question: "Quantas vezes você tentou e falhou? (Não se culpe)",
    options: [
      "1-2 vezes (Ainda acredita)",
      "3-5 vezes (Frustrado mas persistente)",
      "6-10 vezes (Quase desistindo)",
      "10+ vezes (Precisa de ajuda especializada)"
    ],
    values: [1, 2, 3, 4]
  },
  {
    id: 6,
    question: "Em quanto tempo você quer ver resultados?",
    options: [
      "1-2 semanas (Preciso de motivação rápida)",
      "1 mês (Quero ver mudanças consistentes)",
      "3 meses (Foco em transformação real)",
      "6+ meses (Quero mudança permanente)"
    ],
    values: [1, 2, 3, 4]
  },
  {
    id: 7,
    question: "O que você está disposto a fazer AGORA para mudar?",
    options: [
      "Mudar hábitos alimentares (Começar hoje)",
      "Adicionar exercícios (Sem desculpas)",
      "Suplementação inteligente (Apoio científico)",
      "Tudo junto (Transformação completa)"
    ],
    values: [1, 2, 3, 4]
  }
];

const quizResults: Record<string, QuizResult> = {
  newcomer: {
    title: "Brasileira Recém-Chegada - Adaptação Inteligente",
    description: "Você não está sozinha! Vamos te ajudar a se adaptar aos EUA com saúde e bem-estar.",
    plan: [
      "✅ Inclua vitaminas do complexo B na sua dieta - Essenciais para energia e foco",
      "✅ Experimente um adaptógeno natural - Ajuda com estresse e energia", 
      "✅ Priorize um sono de qualidade - Fundamental para adaptação",
      "✅ Regule seu ciclo de sono - Importante para mudanças de fuso horário",
      "✅ Crie uma rotina relaxante antes de dormir - Ajuda com o estresse"
    ],
    amazonProducts: [
      {
        name: "Complexo B Premium para Energia",
        link: "https://amzn.to/3x8K9mP",
        price: "$24.99",
        description: "Essencial para energia e foco durante a adaptação"
      },
      {
        name: "Ashwagandha - Adaptógeno Natural",
        link: "https://amzn.to/3x8K9mQ", 
        price: "$19.99",
        description: "Reduz estresse e melhora energia naturalmente"
      },
      {
        name: "Melatonina para Regular o Sono",
        link: "https://amzn.to/3x8K9mR",
        price: "$15.99",
        description: "Ajuda a regular o ciclo de sono nos EUA"
      }
    ],
    encouragement: "Você está fazendo o melhor por si mesma! Cada pequeno passo conta. 🇧🇷✨"
  },
  established: {
    title: "Brasileira Estabelecida - Otimização da Vida",
    description: "Perfeito! Você já se adaptou, agora vamos otimizar sua saúde e performance.",
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
        name: "Monitor de Sono Inteligente",
        link: "https://amzn.to/3x8K9mU",
        price: "$89.99",
        description: "Acompanha qualidade do sono e otimiza recuperação"
      }
    ],
    encouragement: "Você já conquistou tanto! Agora é hora de elevar sua performance ao próximo nível! 💪🇧🇷"
  },
  veteran: {
    title: "Brasileira Veterana - Performance Máxima",
    description: "Impressionante! Você é experiente, vamos levar sua saúde ao próximo nível.",
    plan: [
      "✅ Treino HIIT avançado 5x por semana (45-60 min)",
      "✅ Treino de força com periodização",
      "✅ Cardio intenso com variação de zonas",
      "✅ Macro nutrientes calculados e ajustados",
      "✅ Suplementação estratégica e cíclica"
    ],
    amazonProducts: [
      {
        name: "Kit Completo de Musculação Profissional",
        link: "https://amzn.to/3x8K9mV",
        price: "$299.99",
        description: "Equipamento completo para treinos avançados em casa"
      },
      {
        name: "Creatina Monohidratada Pura",
        link: "https://amzn.to/3x8K9mW",
        price: "$29.99",
        description: "Para força e performance máxima"
      },
      {
        name: "Balança Digital com Análise Corporal",
        link: "https://amzn.to/3x8K9mX",
        price: "$79.99",
        description: "Monitora composição corporal e progresso"
      }
    ],
    encouragement: "Você é uma inspiração! Sua experiência é seu maior ativo. Vamos maximizar seu potencial! 🚀🇧🇷"
  }
};

export default function AvaliacaoPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [userGoals, setUserGoals] = useState('');
  const [showGoalsInput, setShowGoalsInput] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  // const [userAge, setUserAge] = useState('');

  const handleNameSubmit = () => {
    if (userName.trim()) {
      setShowNameInput(false);
    }
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Mostrar campo de objetivos pessoais
      setShowGoalsInput(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const generateResult = async () => {
    console.log('generateResult called');
    console.log('Current answers:', answers);
    console.log('Current userGoals:', userGoals);
    
    try {
      // Chamar API para análise personalizada
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          userGoals,
          userName
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('API Response:', data);
        setResult(data.result);
        setShowResult(true);
        setShowGoalsInput(false);
        
        // Mostrar se é mock ou análise real
        if (data.isMock) {
          console.log('Using mock data - configure OPENAI_API_KEY for real analysis');
        } else {
          console.log('Using OpenAI analysis');
        }
      } else {
        throw new Error('API failed');
      }
    } catch (error) {
      console.error('Error calling analyze API:', error);
      
      // Fallback para resultado mock em caso de erro
      const timeInUSA = answers[1];
      let resultType: string;
      
      if (timeInUSA === 1) {
        resultType = 'newcomer';
      } else if (timeInUSA === 2 || timeInUSA === 3) {
        resultType = 'established';
      } else {
        resultType = 'veteran';
      }
      
      setResult(quizResults[resultType]);
      setShowResult(true);
      setShowGoalsInput(false);
    }
  };

  const handleGoalsSubmit = () => {
    console.log('handleGoalsSubmit called, userGoals:', userGoals);
    generateResult();
  };

  const generatePDF = async () => {
    try {
      // Track PDF download
      console.log('PDF Download initiated:', { userName, timestamp: new Date().toISOString() });
      
      // Chamar API para gerar PDF
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          userGoals,
          answers,
          result
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MeuPlanoPersonalizado-${userName}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Track successful download
        console.log('PDF Download completed successfully');
      } else {
        // Fallback: enviar via WhatsApp
        console.log('PDF generation failed, falling back to WhatsApp');
        sendViaWhatsApp();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback: enviar via WhatsApp
      sendViaWhatsApp();
    }
  };

  const viewPresentation = async () => {
    try {
      // Track presentation view
      console.log('Presentation view initiated:', { userName, timestamp: new Date().toISOString() });
      
      // Chamar API para gerar apresentação
      const response = await fetch('/api/generate-presentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          result
        }),
      });

      if (response.ok) {
        const html = await response.text();
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(html);
          newWindow.document.close();
          
          // Track successful view
          console.log('Presentation view completed successfully');
        }
      } else {
        // Fallback: enviar via WhatsApp
        console.log('Presentation generation failed, falling back to WhatsApp');
        sendViaWhatsApp();
      }
    } catch (error) {
      console.error('Error generating presentation:', error);
      // Fallback: enviar via WhatsApp
      sendViaWhatsApp();
    }
  };

  const sendViaWhatsApp = () => {
    // Track WhatsApp redirect
    console.log('WhatsApp redirect initiated:', { userName, timestamp: new Date().toISOString() });
    
    const whatsappUrl = getWhatsAppUrl(WHATSAPP_CONFIG.MESSAGES.PLAN);
    window.open(whatsappUrl, '_blank');
  };


  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setResult(null);
    setUserGoals('');
    setShowGoalsInput(false);
    setUserName('');
    setShowNameInput(true);
  };

  // Tela de nome
  if (showNameInput) {
    return (
      <div className="min-h-screen bg-brand-cream pb-16">
        <header className="bg-white shadow-soft sticky top-0 z-50">
          <div className="max-w-sm mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-green via-brand-green to-brand-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <h1 className="text-lg font-bold text-brand-text">MeuPortalFit</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-6">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-green via-brand-green to-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧠</span>
              </div>
              <h2 className="text-2xl font-bold text-brand-blue mb-2">
                Avaliação Gratuita
              </h2>
              <p className="text-brand-blue text-lg font-semibold mb-2">
                feita por Inteligência Artificial
              </p>
              <p className="text-brand-text2 text-sm">
                Descubra seu plano personalizado em 60 segundos ⏱️
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="font-bold text-lg text-brand-text mb-4">
                Antes de começarmos, me conte um pouco sobre você:
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Como você gostaria de ser chamado(a)?
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ex: João, Maria, Ana..."
                  className="w-full p-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              <button
                onClick={handleNameSubmit}
                disabled={!userName.trim()}
                className="w-full bg-gradient-to-b from-brand-green to-brand-blue text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de objetivos pessoais
  if (showGoalsInput) {
    return (
      <div className="min-h-screen bg-brand-cream pb-16">
        <header className="bg-white shadow-soft sticky top-0 z-50">
          <div className="max-w-sm mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-green via-brand-green to-brand-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <h1 className="text-lg font-bold text-brand-text">MeuPortalFit</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-6">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-green via-brand-green to-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💭</span>
              </div>
              <h2 className="text-xl font-bold text-brand-text mb-2">
                Conte-nos mais sobre você
              </h2>
              <p className="text-brand-text2 text-sm">
                O que você mais gostaria de conquistar?
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-soft">
              <textarea
                value={userGoals}
                onChange={(e) => setUserGoals(e.target.value)}
                placeholder="Ex: Quero perder 10kg, ter mais energia para brincar com meus filhos, me sentir mais confiante..."
                className="w-full h-32 p-4 border border-brand-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              
              {/* Botões de navegação */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowGoalsInput(false)}
                  className="flex-1 bg-gradient-to-r from-brand-blueSoft to-brand-greenSoft text-brand-text py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  ← Voltar
                </button>
                <button
                  onClick={handleGoalsSubmit}
                  className="flex-1 bg-gradient-to-b from-brand-green to-brand-blue text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  console.log('Render check - showResult:', showResult, 'result:', result);
  
  if (showResult && result) {
    return (
      <div className="min-h-screen bg-brand-cream pb-16">
        {/* Header */}
        <header className="bg-white shadow-soft sticky top-0 z-50">
          <div className="max-w-sm mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-green via-brand-green to-brand-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <h1 className="text-lg font-bold text-brand-text">MeuPortalFit</h1>
              </div>
              <button 
                onClick={resetQuiz}
                className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-greenDark transition-all"
              >
                Refazer
              </button>
            </div>
          </div>
        </header>

        {/* Resultado */}
        <div className="px-4 py-6">
          <div className="max-w-sm mx-auto">
            {/* Header Celebrativo */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-green via-brand-green to-brand-blue rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-4xl">🎉</span>
              </div>
              
              {/* Mensagem de Parabéns */}
              <div className="bg-gradient-to-r from-brand-greenSoft to-brand-blueSoft rounded-xl p-4 mb-4">
                <h2 className="text-xl font-bold text-brand-text mb-2">🎊 Parabéns, {userName}! 🎊</h2>
                <p className="text-brand-text2 text-sm">
                  Você completou sua avaliação personalizada! Seu plano está pronto.
                </p>
              </div>

              {/* Social Proof */}
              <div className="bg-white rounded-lg p-3 mb-4 shadow-soft">
                <p className="text-brand-text2 text-xs">
                  <span className="text-brand-green font-bold">+1.247 brasileiras</span> já transformaram suas vidas com nosso método
                </p>
              </div>

              {/* Progresso */}
              <div className="bg-gradient-to-r from-brand-green to-brand-blue rounded-lg p-3 mb-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-white text-sm font-semibold">🎯 Você está no caminho certo!</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>
                <p className="text-green-100 text-xs mt-1">75% do seu plano personalizado está pronto</p>
              </div>

              {/* CTA Principal Melhorado */}
              <div className="bg-gradient-to-r from-brand-green to-brand-blue rounded-xl p-4 mb-6 relative overflow-hidden">
                {/* Urgência */}
                <div className="absolute top-2 right-2 bg-brand-amber text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                  ⏰ 24h
                </div>
                
                <h3 className="font-bold text-white mb-2 text-xl">📥 Seu Plano Completo Está Pronto!</h3>
                <p className="text-green-100 text-sm mb-4">
                  Veja sua apresentação interativa ou baixe o PDF personalizado com análise completa, hábitos, produtos Amazon e receitas exclusivas
                </p>
                
                {/* Botão Principal - Apresentação */}
                <button 
                  onClick={() => viewPresentation()}
                  className="w-full bg-white text-brand-green px-6 py-4 rounded-lg font-bold hover:shadow-lg transition-all transform hover:scale-105 text-lg mb-3"
                >
                  🎨 Ver Minha Apresentação
                </button>
                
                {/* Botão Secundário - PDF */}
                <button 
                  onClick={() => generatePDF()}
                  className="w-full bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all mb-2"
                >
                  📄 Baixar PDF Completo
                </button>
                
                {/* Botão Terciário - WhatsApp */}
                <div className="text-center">
                  <button 
                    onClick={() => sendViaWhatsApp()}
                    className="text-green-100 text-sm underline hover:text-white transition-all"
                  >
                    📲 Ou receber via WhatsApp
                  </button>
                </div>
                
                <div className="mt-3 p-2 bg-white bg-opacity-20 rounded-lg">
                  <p className="text-green-100 text-xs text-center">
                    ✨ Apresentação interativa + PDF profissional + Receitas brasileiras + Dicas de adaptação
                  </p>
                </div>
              </div>
            </div>

            {/* Preview do Conteúdo */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-soft">
              <h3 className="font-bold text-lg text-brand-text mb-3 text-center">📋 O que você vai receber no seu PDF:</h3>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-brand-text2">Recomendações Personalizadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">⭐</span>
                  <span className="text-brand-text2">Áreas de Prioridade</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⚠️</span>
                  <span className="text-brand-text2">Fatores de Risco</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✔</span>
                  <span className="text-brand-text2">Checklist de Hábitos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">🚀</span>
                  <span className="text-brand-text2">Próximos Passos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">🛒</span>
                  <span className="text-brand-text2">Produtos Amazon</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gradient-to-r from-brand-greenSoft to-brand-blueSoft rounded-lg text-center">
                <p className="text-brand-text text-sm font-semibold">
                  + Receitas exclusivas e dicas de adaptação cultural! 🇧🇷
                </p>
              </div>
            </div>


            {/* Mensagem de Encorajamento */}
            {result.encouragement && (
              <div className="bg-gradient-to-r from-brand-greenSoft to-brand-blueSoft rounded-xl p-4 mb-6 text-center">
                <p className="text-brand-text font-medium text-sm">{result.encouragement}</p>
              </div>
            )}

            {/* Promessa de Receitas */}
            {result.promise && (
              <div className="bg-gradient-to-r from-brand-amber to-brand-amberDark rounded-xl p-4 mb-6 text-center">
                <h3 className="font-bold text-white mb-2">🍽️ Receitas Exclusivas!</h3>
                <p className="text-amber-100 text-sm">{result.promise}</p>
              </div>
            )}

            {/* Testimonial */}
            <div className="bg-gradient-to-r from-brand-greenSoft to-brand-blueSoft rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div>
                  <p className="text-brand-text text-sm italic mb-2">
                    &ldquo;O plano me ajudou a me adaptar aos EUA sem perder minha identidade brasileira. Recomendo!&rdquo;
                  </p>
                  <p className="text-brand-text2 text-xs font-semibold">- Maria, São Paulo → Miami</p>
                </div>
              </div>
            </div>

            {/* CTA Coach Melhorado */}
            <div className="bg-gradient-to-r from-brand-blue to-brand-blueDark rounded-xl p-4 text-center">
              <h3 className="font-bold text-white mb-2 text-lg">Quer aprofundar seu plano?</h3>
              <p className="text-green-100 text-sm mb-4">
                Converse com uma Coach Brasileira especializada
              </p>
              
              <a 
                href={getWhatsAppUrl(WHATSAPP_CONFIG.MESSAGES.COACH)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-brand-blue px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:scale-105"
              >
                Falar com Coach 👩‍💻
              </a>
              
              <p className="text-green-100 text-xs mt-2">
                ⚡ Resposta em até 2 horas
              </p>
            </div>

            {/* Viralização */}
            <div className="bg-gradient-to-r from-brand-amber to-brand-amberDark rounded-xl p-4 text-center mt-6">
              <h3 className="font-bold text-white mb-2">💝 Compartilhe com uma amiga brasileira!</h3>
              <p className="text-amber-100 text-sm mb-3">
                Ajude outra brasileira nos Estados Unidos a transformar sua vida
              </p>
              <button 
                onClick={() => {
                  const shareMessage = `Olha que legal! Encontrei um app brasileiro incrível para quem vive nos EUA 🇧🇷🇺🇸 

✨ Avaliação gratuita com IA
🍽️ Receitas brasileiras 
🛒 Produtos Amazon curados
👩‍💻 Coach brasileira especializada

Baixe agora: https://app.meuportalfit.com

#BrasileirasNosEUA #MeuPortalFit`;
                  
                  const whatsappUrl = getWhatsAppUrl(WHATSAPP_CONFIG.MESSAGES.SHARE, shareMessage);
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-white text-brand-amber px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                📤 Compartilhar Agora
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream pb-16">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-green via-brand-green to-brand-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-lg font-bold text-brand-text">MeuPortalFit</h1>
            </div>
            <div className="text-sm text-brand-text2">
              {currentQuestion + 1}/{quizQuestions.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-4 py-4">
        <div className="max-w-sm mx-auto">
          <div className="bg-brand-border rounded-full h-2">
            <div 
              className="bg-brand-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quiz */}
      <div className="px-4 py-6">
        <div className="max-w-sm mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-green via-brand-green to-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧠</span>
              </div>
              <h2 className="text-2xl font-bold text-brand-blue mb-2">
                Avaliação Gratuita
              </h2>
              <p className="text-brand-blue text-lg font-semibold mb-2">
                feita por Inteligência Artificial
              </p>
              <p className="text-brand-text2 text-sm mb-2">
                Descubra seu plano personalizado em 60 segundos ⏱️
              </p>
              <p className="text-brand-text2 text-xs">
                {currentQuestion + 1} de {quizQuestions.length}
              </p>
            </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <h3 className="font-bold text-lg text-brand-text mb-6">
              {quizQuestions[currentQuestion].question}
            </h3>
            
            <div className="space-y-3">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(quizQuestions[currentQuestion].values[index])}
                  className="w-full bg-gradient-to-r from-brand-greenSoft via-white to-brand-blueSoft text-brand-text p-4 rounded-lg text-left hover:shadow-lg transition-all border border-brand-border hover:border-brand-blue transform hover:scale-105"
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Navegação */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-4 py-2 bg-gradient-to-r from-brand-blueSoft to-brand-greenSoft text-brand-text rounded-lg font-semibold hover:shadow-lg transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              <button
                onClick={() => {
                  if (currentQuestion < quizQuestions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                  } else {
                    setShowGoalsInput(true);
                  }
                }}
                className="px-4 py-2 bg-gradient-to-b from-brand-green to-brand-blue text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                {currentQuestion < quizQuestions.length - 1 ? 'Próxima' : 'Próxima'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
