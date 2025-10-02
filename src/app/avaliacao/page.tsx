'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import BottomNavigation from '@/components/BottomNavigation';
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
    question: "Qual sua idade?",
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
    question: "Qual seu estilo de vida atual?",
    options: [
      "Vida agitada",
      "Vida equilibrada",
      "Vida flexível",
      "Vida sedentária"
    ],
    values: [1, 2, 3, 4]
  },
  {
    id: 3,
    question: "Qual seu objetivo principal?",
    options: [
      "Perder peso",
      "Ganhar massa muscular",
      "Melhorar a saúde"
    ],
    values: [1, 2, 3]
  },
  {
    id: 4,
    question: "Em quanto tempo você quer ver resultados?",
    options: [
      "1-2 semanas",
      "1 mês",
      "3 meses",
      "6+ meses"
    ],
    values: [1, 2, 3, 4]
  },
];

/* const quizResults: Record<string, QuizResult> = {
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
}; */

export default function AvaliacaoPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [userGoals, setUserGoals] = useState('');
  const [showGoalsInput, setShowGoalsInput] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  
  // Novos estados para perguntas detalhadas
  const [wakeUpTime, setWakeUpTime] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [sleepQuality, setSleepQuality] = useState('');
  const [mainConcern, setMainConcern] = useState('');
  const [improvementAreas, setImprovementAreas] = useState<string[]>([]);
  const [usesMedication, setUsesMedication] = useState('');
  const [medicationDetails, setMedicationDetails] = useState('');
  const [healthIssues, setHealthIssues] = useState('');
  const [healthIssuesDetails, setHealthIssuesDetails] = useState('');
  const [foodRestrictions, setFoodRestrictions] = useState('');
  const [foodRestrictionsDetails, setFoodRestrictionsDetails] = useState('');
  const [usesSupplements, setUsesSupplements] = useState('');
  const [supplementsDetails, setSupplementsDetails] = useState('');
  
  // Estados para controlar fluxo
  const [showDetailedQuestions, setShowDetailedQuestions] = useState(false);
  const [currentDetailedQuestion, setCurrentDetailedQuestion] = useState(0);

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
      // Mostrar perguntas detalhadas
      setShowDetailedQuestions(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  // Funções para perguntas detalhadas
  const handleDetailedQuestionNext = () => {
    if (currentDetailedQuestion < 8) { // 9 perguntas detalhadas (0-8)
      setCurrentDetailedQuestion(currentDetailedQuestion + 1);
    } else {
      // Finalizar perguntas detalhadas e mostrar campo de objetivos
      setShowDetailedQuestions(false);
      setShowGoalsInput(true);
    }
  };

  const handleDetailedQuestionPrevious = () => {
    if (currentDetailedQuestion > 0) {
      setCurrentDetailedQuestion(currentDetailedQuestion - 1);
    } else {
      // Voltar para o quiz principal
      setShowDetailedQuestions(false);
      setCurrentQuestion(quizQuestions.length - 1);
    }
  };

  const handleImprovementAreaToggle = (area: string) => {
    setImprovementAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const generateResult = async () => {
    console.log('generateResult called');
    console.log('Current answers:', answers);
    console.log('Current userGoals:', userGoals);
    
    // Criar objeto com todos os dados detalhados
    const detailedData = {
      wakeUpTime,
      sleepTime,
      sleepQuality,
      mainConcern,
      improvementAreas,
      usesMedication,
      medicationDetails,
      healthIssues,
      healthIssuesDetails,
      foodRestrictions,
      foodRestrictionsDetails,
      usesSupplements,
      supplementsDetails
    };
    
    // Criar URL com parâmetros para a página de resultados
    const answersParam = encodeURIComponent(JSON.stringify(answers));
    const goalsParam = encodeURIComponent(userGoals);
    const nameParam = encodeURIComponent(userName);
    const detailedParam = encodeURIComponent(JSON.stringify(detailedData));
    
    const resultsUrl = `/resultados?answers=${answersParam}&comments=${goalsParam}&language=pt&userName=${nameParam}&detailed=${detailedParam}`;
    
    // Redirecionar para a página de resultados
    window.location.href = resultsUrl;
  };

  const handleGoalsSubmit = () => {
    console.log('handleGoalsSubmit called, userGoals:', userGoals);
    generateResult();
  };

  const generatePDF = async () => {
    try {
      // Track PDF download
      console.log('PDF Download initiated:', { userName, timestamp: new Date().toISOString() });
      
      // Abrir a apresentação baseada na página original em nova aba para impressão/salvamento como PDF
      const response = await fetch('/api/generate-presentation-original', {
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
        const htmlContent = await response.text();
        
        // Criar blob e abrir diretamente
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Abrir em nova aba sem pop-up blocker
        const newWindow = window.open(url, '_blank');
        if (newWindow) {
          // Aguardar carregamento e mostrar instruções de impressão
          setTimeout(() => {
            newWindow.print();
          }, 1000);
          
          // Track successful download
          console.log('PDF Download completed successfully');
        } else {
          // Fallback: redirecionar na mesma aba
          window.location.href = url;
        }
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
      
      // Mostrar loading
      const button = document.querySelector('[data-button="view-presentation"]') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.textContent = '⏳ Carregando...';
      }
      
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

      console.log('API Response status:', response.status);

      if (response.ok) {
        const html = await response.text();
        console.log('HTML received, length:', html.length);
        
        // Criar blob e abrir diretamente
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Abrir em nova aba sem pop-up blocker
        const newWindow = window.open(url, '_blank');
        if (newWindow) {
          // Track successful view
          console.log('Presentation view completed successfully');
        } else {
          // Fallback: redirecionar na mesma aba
          window.location.href = url;
        }
      } else {
        console.error('API Error:', response.status, response.statusText);
        alert('Erro ao carregar apresentação. Tente novamente.');
      }
    } catch (error) {
      console.error('Error generating presentation:', error);
      alert('Erro ao carregar apresentação. Verifique sua conexão.');
    } finally {
      // Restaurar botão
      const button = document.querySelector('[data-button="view-presentation"]') as HTMLButtonElement;
      if (button) {
        button.disabled = false;
        button.textContent = '📊 Ver Meus Resultados';
      }
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
              <Logo variant="horizontal" size="md" />
              <Link href="/">
                <button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-greenDark transition-colors">
                  🏠 Início
                </button>
              </Link>
            </div>
          </div>
        </header>

        <div className="px-4 py-6">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl mr-3">🧠</span>
                <h2 className="text-2xl font-bold text-brand-green">
                  Avaliação Gratuita
                </h2>
              </div>
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
                className="w-full bg-brand-greenLight text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
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
              <Logo variant="horizontal" size="md" />
              <Link href="/">
                <button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-greenDark transition-colors">
                  🏠 Início
                </button>
              </Link>
            </div>
          </div>
        </header>

        <div className="px-4 py-6">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl mr-3">💭</span>
                <h2 className="text-xl font-bold text-brand-green">
                  Conte-nos mais sobre você
                </h2>
              </div>
              <p className="text-brand-text2 text-sm mb-4">
                Conte seus objetivos, desafios e restrições alimentares
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-soft">
              <textarea
                value={userGoals}
                onChange={(e) => setUserGoals(e.target.value)}
                placeholder="Ex: Quero perder 10kg e ter mais energia. Tenho dificuldade para dormir e sou intolerante à lactose. Meu maior desafio é resistir aos doces à noite e não tenho tempo para cozinhar durante a semana..."
                className="w-full h-32 p-4 border border-brand-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              
              {/* Mensagem de orientação */}
              <div className="mt-3 p-3 bg-brand-greenSoft rounded-lg">
                <p className="text-brand-text text-xs">
                  💡 <strong>Dica:</strong> Mencione seus objetivos específicos (peso, energia, saúde), 
                  desafios que enfrenta (tempo, motivação, hábitos) e qualquer restrição alimentar 
                  (lactose, glúten, alergias) para uma avaliação mais personalizada.
                </p>
              </div>
              
              {/* Botões de navegação */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowGoalsInput(false)}
                  className="flex-1 bg-brand-greenSoft text-brand-text py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  ← Voltar
                </button>
                <button
                  onClick={handleGoalsSubmit}
                  className="flex-1 bg-brand-greenLight text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
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
              <Logo variant="horizontal" size="md" />
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
              {/* Mensagem de Parabéns - Simplificada */}
              <div className="bg-brand-greenSoft rounded-xl p-4 mb-4">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-16 h-16 bg-brand-greenLight rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-brand-text mb-1">Parabéns, {userName}!</h2>
                    <p className="text-brand-text2 text-sm">
                      Você completou sua avaliação personalizada!
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-white rounded-lg p-3 mb-4 shadow-soft">
                <p className="text-brand-text2 text-xs">
                  <span className="text-brand-green font-bold">+1.247 brasileiras</span> já transformaram suas vidas com nosso método
                </p>
              </div>

              {/* Progresso */}
              <div className="bg-brand-greenLight rounded-lg p-3 mb-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-white text-sm font-semibold">🎯 Você está no caminho certo!</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>
                <p className="text-green-100 text-xs mt-1">75% do seu plano personalizado está pronto</p>
              </div>

              {/* Preview do Conteúdo - Movido para cima */}
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
                
                <div className="mt-4 p-3 bg-brand-greenSoft rounded-lg text-center">
                  <p className="text-brand-text text-sm font-semibold">
                    + Receitas exclusivas e dicas de adaptação cultural! 🇧🇷
                  </p>
                </div>
              </div>

              {/* CTA Principal Melhorado */}
              <div className="bg-brand-greenLight rounded-xl p-4 mb-6 relative overflow-hidden">
                {/* Urgência */}
                <div className="absolute top-2 right-2 bg-brand-amber text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                  ⏰ 24h
                </div>
                
                <h3 className="font-bold text-white mb-2 text-xl">📥 Seu Plano Completo Está Pronto!</h3>
                <p className="text-green-100 text-sm mb-4">
                  Veja sua análise personalizada completa com recomendações, hábitos e produtos Amazon
                </p>
                
                {/* Botão Principal - Ver Resultados */}
                <button 
                  data-button="view-presentation"
                  onClick={() => viewPresentation()}
                  className="w-full bg-white text-brand-green px-6 py-4 rounded-lg font-bold hover:shadow-lg transition-all transform hover:scale-105 text-lg mb-3"
                >
                  📊 Ver Meus Resultados
                </button>
                
                {/* Botão Secundário - PDF */}
                <button 
                  onClick={() => generatePDF()}
                  className="w-full bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all mb-2"
                >
                  📄 Baixar PDF Completo
                </button>
                
                <div className="mt-3 p-2 bg-white bg-opacity-20 rounded-lg">
                  <p className="text-green-100 text-xs text-center">
                    ✨ Análise personalizada + Produtos Amazon + Receitas brasileiras
                  </p>
                </div>
              </div>
            </div>



            {/* Mensagem de Encorajamento */}
            {result.encouragement && (
              <div className="bg-brand-greenSoft rounded-xl p-4 mb-6 text-center">
                <p className="text-brand-text font-medium text-sm">{result.encouragement}</p>
              </div>
            )}

            {/* Promessa de Receitas */}
            {result.promise && (
              <div className="bg-brand-amber rounded-xl p-4 mb-6 text-center">
                <h3 className="font-bold text-white mb-2">🍽️ Receitas Exclusivas!</h3>
                <p className="text-amber-100 text-sm">{result.promise}</p>
              </div>
            )}

            {/* Testimonial */}
            <div className="bg-brand-greenSoft rounded-xl p-4 mb-6">
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
            <div className="bg-brand-blue rounded-xl p-4 text-center">
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
            <div className="bg-brand-amber rounded-xl p-4 text-center mt-6">
              <h3 className="font-bold text-white mb-2">💝 Compartilhe com uma amiga brasileira!</h3>
              <p className="text-amber-100 text-sm mb-3">
                Ajude outra brasileira nos Estados Unidos a transformar sua vida
              </p>
              <button 
                onClick={() => {
                  const shareMessage = `Olha que legal! Encontrei um app brasileiro incrível para quem vive nos Estados Unidos 🇧🇷🇺🇸 

✨ Você pode fazer sua avaliação gratuita por inteligência artificial - avaliação de bem-estar por inteligência artificial gratuita
🍽️ Receitas brasileiras 
🛒 Produtos para comprar direto na Amazon - produtos já selecionados que compra direto na Amazon
👩‍💻 E se quiser tem uma Coach brasileira especializada para ajudar

Baixe agora: https://meuportalfit.com

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

  // Tela de perguntas detalhadas
  if (showDetailedQuestions) {
    const detailedQuestions = [
      {
        id: 0,
        question: "Qual horário você costuma acordar?",
        type: "time",
        value: wakeUpTime,
        setValue: setWakeUpTime
      },
      {
        id: 1,
        question: "Qual horário você costuma dormir?",
        type: "time",
        value: sleepTime,
        setValue: setSleepTime
      },
      {
        id: 2,
        question: "Como você avalia a qualidade do seu sono?",
        type: "select",
        options: ["Boa", "Média", "Ruim"],
        value: sleepQuality,
        setValue: setSleepQuality
      },
      {
        id: 3,
        question: "O que mais te incomoda no momento?",
        type: "textarea",
        value: mainConcern,
        setValue: setMainConcern,
        placeholder: "Descreva seus principais incômodos, desafios ou preocupações..."
      },
      {
        id: 4,
        question: "O que você gostaria de melhorar? (Pode selecionar mais de uma opção)",
        type: "multiple",
        options: [
          "Perder peso",
          "Desinflamar o corpo",
          "Ter mais energia",
          "Melhorar o intestino",
          "Melhorar o sono",
          "Melhorar a concentração",
          "Reduzir o estresse",
          "Fortalecer o sistema imunológico"
        ],
        value: improvementAreas,
        setValue: setImprovementAreas
      },
      {
        id: 5,
        question: "Você utiliza algum medicamento?",
        type: "yesno",
        value: usesMedication,
        setValue: setUsesMedication,
        details: medicationDetails,
        setDetails: setMedicationDetails,
        placeholder: "Quais medicamentos você toma?"
      },
      {
        id: 6,
        question: "Você tem alguma alteração na sua saúde?",
        type: "yesno",
        value: healthIssues,
        setValue: setHealthIssues,
        details: healthIssuesDetails,
        setDetails: setHealthIssuesDetails,
        placeholder: "Descreva suas condições de saúde..."
      },
      {
        id: 7,
        question: "Você tem alguma restrição alimentar?",
        type: "yesno",
        value: foodRestrictions,
        setValue: setFoodRestrictions,
        details: foodRestrictionsDetails,
        setDetails: setFoodRestrictionsDetails,
        placeholder: "Descreva suas restrições alimentares..."
      },
      {
        id: 8,
        question: "Você já usa algum suplemento?",
        type: "yesno",
        value: usesSupplements,
        setValue: setUsesSupplements,
        details: supplementsDetails,
        setDetails: setSupplementsDetails,
        placeholder: "Quais suplementos você toma?"
      }
    ];

    const currentDetailedQ = detailedQuestions[currentDetailedQuestion];

    return (
      <div className="min-h-screen bg-brand-cream pb-16">
        {/* Header */}
        <header className="bg-white shadow-soft sticky top-0 z-50">
          <div className="max-w-sm mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Logo variant="horizontal" size="md" />
              <div className="text-sm text-brand-text2">
                {currentDetailedQuestion + 1}/9
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
                style={{ width: `${((currentDetailedQuestion + 1) / 9) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pergunta Detalhada */}
        <div className="px-4 py-6">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl mr-3">🔍</span>
                <h2 className="text-xl font-bold text-brand-green">
                  Perguntas Detalhadas
                </h2>
              </div>
              <p className="text-brand-text2 text-sm mb-2">
                Para uma avaliação mais precisa
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="font-bold text-lg text-brand-text mb-6">
                {currentDetailedQ.question}
              </h3>
              
              {/* Renderizar baseado no tipo */}
              {currentDetailedQ.type === "time" && (
                <div className="relative">
                  {/* Seletor de horário estilo picker */}
                  <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-2">
                    <div className="bg-white rounded-lg shadow-inner">
                      <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="py-2">
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0')
                            const time = `${hour}:00`
                            const isSelected = currentDetailedQ.value === time
                            return (
                              <button
                                key={time}
                                onClick={() => (currentDetailedQ.setValue as (value: string) => void)(time)}
                                className={`w-full py-4 px-6 text-center transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-brand-green text-white shadow-lg transform scale-105'
                                    : 'text-brand-text hover:bg-brand-greenSoft hover:text-brand-green'
                                }`}
                              >
                                <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-brand-text'}`}>
                                  {time}
                                </span>
                                {isSelected && (
                                  <div className="mt-1">
                                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                                      ✓ Selecionado
                                    </span>
                                  </div>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Indicador visual melhorado */}
                  <div className="mt-4 text-center">
                    <div className="bg-brand-greenSoft rounded-lg p-3">
                      <p className="text-sm text-brand-text font-medium mb-1">
                        📱 Toque no horário desejado
                      </p>
                      {currentDetailedQ.value ? (
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-2xl">🕐</span>
                          <span className="text-xl font-bold text-brand-green">
                            {currentDetailedQ.value}
                          </span>
                        </div>
                      ) : (
                        <p className="text-brand-text2 text-sm">
                          Escolha um horário acima
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentDetailedQ.type === "select" && currentDetailedQ.options && (
                <div className="space-y-3">
                  {currentDetailedQ.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => (currentDetailedQ.setValue as (value: string) => void)(option)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        currentDetailedQ.value === option
                          ? 'bg-brand-green text-white'
                          : 'bg-brand-greenSoft text-brand-text hover:shadow-lg'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {currentDetailedQ.type === "textarea" && (
                <textarea
                  value={currentDetailedQ.value as string}
                  onChange={(e) => (currentDetailedQ.setValue as (value: string) => void)(e.target.value)}
                  placeholder={currentDetailedQ.placeholder}
                  className="w-full h-32 p-4 border border-brand-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              )}

              {currentDetailedQ.type === "multiple" && currentDetailedQ.options && (
                <div className="space-y-3">
                  {currentDetailedQ.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleImprovementAreaToggle(option)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        (currentDetailedQ.value as string[]).includes(option)
                          ? 'bg-brand-green text-white'
                          : 'bg-brand-greenSoft text-brand-text hover:shadow-lg'
                      }`}
                    >
                      {(currentDetailedQ.value as string[]).includes(option) ? '✓ ' : ''}{option}
                    </button>
                  ))}
                </div>
              )}

              {currentDetailedQ.type === "yesno" && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => (currentDetailedQ.setValue as (value: string) => void)("Sim")}
                      className={`flex-1 p-3 rounded-lg transition-all ${
                        currentDetailedQ.value === "Sim"
                          ? 'bg-brand-green text-white'
                          : 'bg-brand-greenSoft text-brand-text hover:shadow-lg'
                      }`}
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => (currentDetailedQ.setValue as (value: string) => void)("Não")}
                      className={`flex-1 p-3 rounded-lg transition-all ${
                        currentDetailedQ.value === "Não"
                          ? 'bg-brand-green text-white'
                          : 'bg-brand-greenSoft text-brand-text hover:shadow-lg'
                      }`}
                    >
                      Não
                    </button>
                  </div>
                  
                  {currentDetailedQ.value === "Sim" && currentDetailedQ.setDetails && (
                    <textarea
                      value={currentDetailedQ.details}
                      onChange={(e) => currentDetailedQ.setDetails!(e.target.value)}
                      placeholder={currentDetailedQ.placeholder}
                      className="w-full h-24 p-3 border border-brand-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                  )}
                </div>
              )}

              {/* Navegação */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={handleDetailedQuestionPrevious}
                  className="px-4 py-2 bg-brand-greenSoft text-brand-text rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  ← Anterior
                </button>
                <button
                  onClick={handleDetailedQuestionNext}
                  disabled={
                    (currentDetailedQ.type === "time" && !currentDetailedQ.value) ||
                    (currentDetailedQ.type === "select" && !currentDetailedQ.value) ||
                    (currentDetailedQ.type === "textarea" && !(currentDetailedQ.value as string).trim()) ||
                    (currentDetailedQ.type === "multiple" && (currentDetailedQ.value as string[]).length === 0) ||
                    (currentDetailedQ.type === "yesno" && !currentDetailedQ.value)
                  }
                  className="px-4 py-2 bg-brand-greenLight text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {currentDetailedQuestion < 8 ? 'Próxima' : 'Finalizar'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <BottomNavigation currentPage="/avaliacao" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream pb-16">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
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
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl mr-3">🧠</span>
                <h2 className="text-2xl font-bold text-brand-green">
                  Avaliação Gratuita
                </h2>
              </div>
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
                  className="w-full bg-brand-greenSoft text-brand-text p-4 rounded-lg text-left hover:shadow-lg transition-all border border-brand-border hover:border-brand-green transform hover:scale-105"
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
                className="px-4 py-2 bg-brand-greenSoft text-brand-text rounded-lg font-semibold hover:shadow-lg transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
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
                className="px-4 py-2 bg-brand-greenLight text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                {currentQuestion < quizQuestions.length - 1 ? 'Próxima' : 'Próxima'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/avaliacao" />
    </div>
  );
}
