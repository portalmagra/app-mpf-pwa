'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Zap, Heart, Brain, Shield } from 'lucide-react'
import Link from 'next/link'
import { unitConfigs, convertWeight, convertHeight, convertWater, formatHeightInches, parseHeightInches } from '@/lib/units'

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    medication: '',
    duration: '',
    mainChallenge: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity: ''
  })
  const [showResults, setShowResults] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const getProtocolImageName = (protocolId: string) => {
    const imageMap: { [key: string]: string } = {
      'suporte-canetas-emagrecedoras': 'PROTOCOLO SUPORTE COM AS CANETAS EMAGRECEDORAS.jpeg',
      'pre-caneta': 'PROTOCOLO-PRE-CANETA.jpeg',
      'pos-caneta-manutencao': 'PROTOCOLO-POS-CANETA-MANUTENCAO.jpeg',
      'proteina-massa-magra': 'PROTOCOLO-PROTEINA-and-MASSA-MAGRA.jpeg',
      'intestino-livre': 'PROTOCOLO-INTESTINO-LIVRE.jpeg',
      'nausea-refluxo': 'PROTOCOLO-NAUSEA-and-REFLUXO.jpeg',
      'energia-imunidade': 'PROTOCOLO-ENERGIA-E-IMUNIDADE.jpeg',
      'imunidade-avancada': 'PROTOCOLO-IMUNIDADE-AVANCADA.jpeg',
      'detox-leve': 'PROTOCOLO-DETOX-LEVE.jpeg',
      'anti-inflamatorio': 'PROTOCOLO-ANTI-INFLAMATORIO.jpeg',
      'mulheres-40': 'PROTOCOLO-MULHERES-40.jpeg',
      'pele-cabelo-unhas': 'PROTOCOLO-PELE-CABELO-and-UNHAS.jpg',
      'sono-ansiedade': 'PROTOCOLO-SONO-and-ANSIEDADE.jpeg',
      'fitness-performance': 'PROTOCOLO-FITNESS-and-PERFORMANCE.jpeg',
      'alternativa-sem-caneta': 'PROTOCOLO ALTERNATIVA SEM CANETA.jpeg',
      'pacote-completo': 'Todos Protocolos.jpg'
    }
    return imageMap[protocolId] || protocolId
  }

  const steps = [
    {
      id: 'medication',
      title: 'Você usa medicação para emagrecimento?',
      subtitle: 'Canetas injetáveis, comprimidos orais ou outros inibidores de apetite',
      options: [
        { value: 'currently_using_injection', label: 'Estou usando caneta injetável', icon: Zap },
        { value: 'currently_using_pill', label: 'Estou usando comprimido oral', icon: CheckCircle },
        { value: 'currently_using_other', label: 'Estou usando outro inibidor de apetite', icon: Heart },
        { value: 'used_before', label: 'Usei antes mas parei', icon: ArrowRight },
        { value: 'planning_to_use', label: 'Pretendo usar', icon: Brain },
        { value: 'considering', label: 'Estou considerando', icon: Shield },
        { value: 'natural_alternative', label: 'Prefiro alternativas naturais', icon: Shield }
      ]
    },
    {
      id: 'duration',
      title: 'Há quanto tempo você está usando?',
      subtitle: 'Isso nos ajuda a entender suas necessidades atuais',
      options: [
        { value: 'less_than_1_month', label: 'Menos de 1 mês' },
        { value: '1_to_3_months', label: '1-3 meses' },
        { value: '3_to_6_months', label: '3-6 meses' },
        { value: 'more_than_6_months', label: 'Mais de 6 meses' },
        { value: 'not_applicable', label: 'Não se aplica' }
      ],
      showIf: ['currently_using']
    },
    {
      id: 'mainChallenge',
      title: 'Qual é seu maior desafio?',
      subtitle: 'Selecione o problema mais importante que você quer resolver',
      options: [
        { value: 'muscle_loss', label: 'Prevenção de perda muscular', icon: Zap },
        { value: 'digestive_issues', label: 'Problemas digestivos', icon: Heart },
        { value: 'low_energy', label: 'Baixa energia', icon: Brain },
        { value: 'nutrient_deficiency', label: 'Deficiências nutricionais', icon: Shield },
        { value: 'weight_plateau', label: 'Estagnação do peso', icon: ArrowRight }
      ]
    },
    {
      id: 'profile',
      title: 'Conte-nos sobre você',
      subtitle: 'Isso nos ajuda a calcular suas necessidades nutricionais específicas',
      fields: [
        { id: 'age', label: 'Idade', type: 'number', placeholder: 'ex: 35' },
        { id: 'weight', label: `Peso (${unitConfigs['pt'].weight.unit})`, type: 'number', placeholder: unitConfigs['pt'].weight.placeholder },
        { id: 'height', label: `Altura (${unitConfigs['pt'].height.unit})`, type: 'number', placeholder: unitConfigs['pt'].height.placeholder },
        { id: 'gender', label: 'Sexo', type: 'select', options: ['Masculino', 'Feminino', 'Outro'] },
        { id: 'activity', label: 'Nível de Atividade', type: 'select', options: ['Sedentário', 'Leve', 'Moderado', 'Ativo', 'Muito Ativo'] }
      ]
    }
  ]

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    
    // Auto-advance for single choice questions
    if (questionId !== 'profile') {
      setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
        }
      }, 500)
    }
  }

  const handleProfileSubmit = () => {
    // Validate profile data
    const { age, weight, height, gender, activity } = answers
    if (!age || !weight || !height || !gender || !activity) {
      alert('Por favor, preencha todas as informações do perfil')
      return
    }
    
    setShowResults(true)
  }

  const getPriceId = (protocolId: string) => {
    // Price IDs de TESTE para cada protocolo - compatíveis com chaves de teste
    const priceMap: { [key: string]: string } = {
      'suporte-canetas-emagrecedoras': 'price_1SBICPEVE42ibKnXwZFKpf4Y', // $10.00 - Protocolo Suporte
      'pre-caneta': 'price_1SBICQEVE42ibKnXBzBO15S3', // $10.00 - Protocolo Pré-Caneta
      'pos-caneta-manutencao': 'price_1SBICREVE42ibKnXxJ5AUlcl', // $10.00 - Protocolo Pós-Caneta
      'proteina-massa-magra': 'price_1SBICREVE42ibKnXIR1OGLRi', // $10.00 - Protocolo Proteína
      'intestino-livre': 'price_1SBICSEVE42ibKnX7p7HMpcn', // $10.00 - Protocolo Intestino
      'nausea-refluxo': 'price_1SBICTEVE42ibKnX1vKVHowV', // $10.00 - Protocolo Náusea
      'energia-imunidade': 'price_1SBICTEVE42ibKnXZPdB7ZIw', // $10.00 - Protocolo Energia
      'imunidade-avancada': 'price_1SBICUEVE42ibKnXSYe0WXbB', // $10.00 - Protocolo Imunidade Avançada
      'detox-leve': 'price_1SBICVEVE42ibKnX7BDCCjAc', // $10.00 - Protocolo Detox
      'anti-inflamatorio': 'price_1SBICVEVE42ibKnXphgIW8Ic', // $10.00 - Protocolo Anti-inflamatório
      'mulheres-40': 'price_1SBICWEVE42ibKnXJfgygNev', // $10.00 - Protocolo Mulheres 40+
      'pele-cabelo-unhas': 'price_1SBICXEVE42ibKnXl9Bs39rA', // $10.00 - Protocolo Pele/Cabelo
      'sono-ansiedade': 'price_1SBICYEVE42ibKnXK52I9iqq', // $10.00 - Protocolo Sono
      'fitness-performance': 'price_1SBICYEVE42ibKnXQgHoS6sK', // $10.00 - Protocolo Fitness
      'alternativa-sem-caneta': 'price_1SBICZEVE42ibKnXWZYcPlKj', // $10.00 - Protocolo Alternativa
      'pacote-completo': 'price_1SBICaEVE42ibKnXT3xArxV2' // $67.00 - Pacote Completo
    }
    return priceMap[protocolId] || 'price_1SBICSEVE42ibKnX7p7HMpcn' // Default Protocolo Intestino
  }

  const handlePurchase = async (protocolId: string) => {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          protocolId: protocolId,
          priceId: getPriceId(protocolId),
          quantity: 1,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao processar pagamento')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error processing purchase:', error)
      alert('Erro no processamento. Tente novamente.')
    }
  }

  const calculateResults = () => {
    const { age, weight, height, gender, activity, medication, duration, mainChallenge } = answers
    
    // Convert units to metric system for calculations
    const weightNum = parseFloat(weight)
    const heightNum = parseFloat(height)
    
    // Convert to kg and cm for calculations
    const weightKg = unitConfigs['pt'].weight.conversion.toKg(weightNum)
    const heightCm = unitConfigs['pt'].height.conversion.toCm(heightNum)
    
    // Calculate BMI
    const bmi = weightKg / ((heightCm / 100) * (heightCm / 100))
    
    // Calculate protein needs (higher for GLP-1 users)
    const baseProtein = weightKg * 0.8 // Standard (using kg)
    const glp1Multiplier = (medication === 'currently_using_injection' || medication === 'currently_using_pill' || medication === 'currently_using_other') ? 1.5 : 1.2
    const activityMultiplier = {
      'Sedentário': 1.0,
      'Leve': 1.1,
      'Moderado': 1.2,
      'Ativo': 1.3,
      'Muito Ativo': 1.4
    }[activity] || 1.2
    
    const proteinNeeds = baseProtein * glp1Multiplier * activityMultiplier
    
    // Calculate water needs (in ml)
    const waterNeedsMl = weightKg * 35 // ml per kg
    
    // Determine recommended protocols based on diagnosis
    const protocols = []
    
    // Protocolos para usuárias de canetas
    if (medication === 'currently_using_injection' || medication === 'currently_using_pill' || medication === 'currently_using_other') {
      protocols.push({
        id: 'suporte-canetas-emagrecedoras',
        name: 'Protocolo Suporte com Canetas Emagrecedoras',
        description: 'Suporte nutricional completo para usuárias de canetas',
        price: 10.00,
        features: ['Otimização de proteína', 'Prevenção de perda muscular', 'Suporte digestivo'],
        icon: '💉'
      })
      
      if (duration === 'less_than_1_month') {
        protocols.push({
          id: 'pre-caneta',
          name: 'Protocolo Pré-Caneta',
          description: 'Preparação antes de iniciar uso de canetas',
          price: 10.00,
          features: ['Preparação nutricional', 'Otimização metabólica', 'Suporte inicial'],
          icon: '🔄'
        })
      }
    }
    
    // Protocolos baseados no desafio principal
    if (mainChallenge === 'muscle_loss') {
      protocols.push({
        id: 'proteina-massa-magra',
        name: 'Protocolo Proteína e Massa Magra',
        description: 'Preservação e ganho de massa muscular',
        price: 10.00,
        features: ['Otimização de proteína', 'Guia de treino resistido', 'Protocolos de recuperação'],
        icon: '💪'
      })
    }
    
    if (mainChallenge === 'digestive_issues') {
      protocols.push({
        id: 'intestino-livre',
        name: 'Protocolo Intestino Livre',
        description: 'Saúde intestinal e digestão otimizada',
        price: 10.00,
        features: ['Otimização de fibras', 'Orientação probiótica', 'Enzimas digestivas'],
        icon: '🌿'
      })
      
      protocols.push({
        id: 'nausea-refluxo',
        name: 'Protocolo Náusea e Refluxo',
        description: 'Alívio de náuseas e problemas digestivos',
        price: 10.00,
        features: ['Alívio de náuseas', 'Controle de refluxo', 'Suporte digestivo'],
        icon: '🤢'
      })
    }
    
    if (mainChallenge === 'low_energy') {
      protocols.push({
        id: 'energia-imunidade',
        name: 'Protocolo Energia e Imunidade',
        description: 'Aumentar energia e apoiar função imunológica',
        price: 10.00,
        features: ['Otimização de vitaminas', 'Equilíbrio mineral', 'Protocolos de energia'],
        icon: '⚡'
      })
    }
    
    if (mainChallenge === 'nutrient_deficiency') {
      protocols.push({
        id: 'energia-imunidade',
        name: 'Protocolo Energia e Imunidade',
        description: 'Aumentar energia e apoiar função imunológica',
        price: 10.00,
        features: ['Otimização de vitaminas', 'Equilíbrio mineral', 'Protocolos de energia'],
        icon: '⚡'
      })
    }
    
    if (mainChallenge === 'weight_plateau') {
      protocols.push({
        id: 'detox-leve',
        name: 'Protocolo Detox Leve',
        description: 'Desintoxicação suave e natural do organismo',
        price: 10.00,
        features: ['Desintoxicação natural', 'Otimização metabólica', 'Quebra de platô'],
        icon: '🌿'
      })
    }
    
    // Protocolos adicionais baseados no perfil
    if (parseInt(age) >= 40) {
      protocols.push({
        id: 'mulheres-40',
        name: 'Protocolo Mulheres 40+',
        description: 'Cuidados específicos para mulheres após os 40',
        price: 10.00,
        features: ['Suporte hormonal', 'Otimização metabólica', 'Cuidados específicos'],
        icon: '👩'
      })
    }
    
    // Se não tem medicação, oferecer alternativa
    if (medication === 'natural_alternative' || medication === 'considering') {
      protocols.push({
        id: 'alternativa-sem-caneta',
        name: 'Protocolo Alternativa Sem Caneta',
        description: 'Alternativas naturais para emagrecimento sem medicação',
        price: 10.00,
        features: ['Alternativas naturais', 'Otimização metabólica', 'Suporte nutricional'],
        icon: '🌱'
      })
    }
    
    return {
      bmi: bmi.toFixed(1),
      bmiCategory: bmi < 18.5 ? 'Abaixo do peso' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Sobrepeso' : 'Obesidade',
      proteinNeeds: proteinNeeds.toFixed(1),
      waterNeeds: waterNeedsMl.toFixed(0),
      protocols,
      risks: [
        'Risco de perda de massa muscular',
        'Risco de deficiência nutricional',
        'Risco de problemas digestivos',
        'Risco de depleção energética'
      ]
    }
  }

  if (showResults) {
    const results = calculateResults()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-greenSoft to-brand-green">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <button
                onClick={() => setShowResults(false)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-brand-green to-brand-greenDark rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-brand-text">Seus Resultados</h1>
                  <p className="text-sm text-brand-text2">Recomendações personalizadas</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-brand-text mb-6">Seu Perfil Nutricional</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-brand-greenSoft rounded-lg p-6">
                <h3 className="font-semibold text-brand-text mb-2">IMC</h3>
                <p className="text-3xl font-bold text-brand-green">{results.bmi}</p>
                <p className="text-sm text-brand-text2">{results.bmiCategory}</p>
              </div>
              
              <div className="bg-brand-greenSoft rounded-lg p-6">
                <h3 className="font-semibold text-brand-text mb-2">Necessidade de Proteína</h3>
                <p className="text-3xl font-bold text-brand-green">{results.proteinNeeds}g</p>
                <p className="text-sm text-brand-text2">Necessidade diária</p>
              </div>
              
              <div className="bg-brand-greenSoft rounded-lg p-6">
                <h3 className="font-semibold text-brand-text mb-2">Necessidade de Água</h3>
                <p className="text-3xl font-bold text-brand-green">{convertWater(parseFloat(results.waterNeeds), 'pt', 'pt').toFixed(0)}{unitConfigs['pt'].water.unit}</p>
                <p className="text-sm text-brand-text2">Necessidade diária</p>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-yellow-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-brand-text mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                Riscos Potenciais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.risks.map((risk, index) => (
                  <div key={index} className="flex items-center text-sm text-brand-text2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    {risk}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Protocols */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-brand-text mb-6">Protocolos Recomendados</h2>
            <p className="text-brand-text2 mb-8">
              Com base no seu perfil, aqui estão os protocolos que vão ajudar você a manter a saúde ideal enquanto usa medicação para emagrecimento.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.protocols.map((protocol, index) => (
                <div key={index} className="border border-brand-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    {!imageErrors.has(protocol.id) ? (
                      <img 
                        src={`/images/protocolos/${getProtocolImageName(protocol.id)}`}
                        alt={protocol.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onLoad={() => {
                          console.log('Imagem carregada com sucesso:', protocol.name)
                        }}
                        onError={(e) => {
                          console.log('Erro ao carregar imagem:', protocol.name, 'URL:', e.currentTarget.src)
                          setImageErrors(prev => new Set(prev).add(protocol.id))
                        }}
                      />
                    ) : (
                      <div className="w-full h-32 bg-gradient-to-r from-brand-green to-brand-greenDark flex items-center justify-center text-white text-2xl font-bold rounded-lg mb-3">
                        {protocol.icon}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-brand-text mb-2">{protocol.name}</h3>
                  <p className="text-brand-text2 mb-4">{protocol.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-brand-text mb-2">Inclui:</h4>
                    <ul className="text-sm text-brand-text2 space-y-1">
                      {protocol.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-brand-green mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-brand-green">${protocol.price}</span>
                    <button 
                      onClick={() => handlePurchase(protocol.id)}
                      className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-greenDark transition-colors"
                    >
                      Obter Protocolo
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bundle Offer */}
            <div className="bg-gradient-to-r from-brand-green to-brand-greenDark rounded-lg p-8 text-white">
              <div className="flex items-center mb-4">
                <img 
                  src="/images/protocolos/Todos Protocolos.jpg"
                  alt="Pacote Completo"
                  className="w-20 h-20 object-cover rounded-lg mr-4"
                />
                <div>
                  <h3 className="text-2xl font-bold">Pacote Completo</h3>
                  <p className="text-green-100">
                    Acesse todos os 15 protocolos para quem faz uso de canetas emagrecedoras
                  </p>
                </div>
              </div>
              <p className="text-green-100 mb-4">
                Obtenha todos os 15 protocolos por apenas $67 (55% de desconto!)
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">$67<span className="text-lg font-normal"> (valor único)</span></p>
                  <p className="text-green-100">Acesso vitalício</p>
                </div>
                <button 
                  onClick={() => handlePurchase('pacote-completo')}
                  className="px-6 py-3 bg-white text-brand-green rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Obter Acesso Completo
                </button>
              </div>
            </div>

            {/* Link para ver todos os protocolos */}
            <div className="text-center mt-6">
              <Link 
                href="/todos-protocolos" 
                className="text-brand-green text-sm font-medium hover:underline"
              >
                Ver todos os protocolos disponíveis
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const currentStepData = steps[currentStep]
  const isProfileStep = currentStepData.id === 'profile'

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-greenSoft to-brand-green">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-brand-green to-brand-greenDark rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-brand-text">Avaliação de Saúde</h1>
                  <p className="text-sm text-brand-text2">Passo {currentStep + 1} de {steps.length}</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-brand-text2 mb-2">
            <span>Progresso</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-brand-border rounded-full h-2">
            <div 
              className="bg-brand-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-brand-text mb-4">{currentStepData.title}</h2>
          <p className="text-lg text-brand-text2 mb-8">{currentStepData.subtitle}</p>

          {isProfileStep ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentStepData.fields?.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-brand-text mb-2">
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={answers[field.id as keyof typeof answers]}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [field.id]: e.target.value }))}
                      className="w-full px-4 py-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    >
                      <option value="">Selecione {field.label}</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={answers[field.id as keyof typeof answers]}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStepData.options?.map((option) => {
                const IconComponent = 'icon' in option ? option.icon : null
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentStepData.id, option.value)}
                    className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                      answers[currentStepData.id as keyof typeof answers] === option.value
                        ? 'border-brand-green bg-brand-greenSoft'
                        : 'border-brand-border hover:border-brand-green hover:bg-brand-greenSoft'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {IconComponent && (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          answers[currentStepData.id as keyof typeof answers] === option.value
                            ? 'bg-brand-green'
                            : 'bg-brand-border'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            answers[currentStepData.id as keyof typeof answers] === option.value
                              ? 'text-white'
                              : 'text-brand-text2'
                          }`} />
                        </div>
                      )}
                      <span className="font-medium text-brand-text">{option.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-3 border border-brand-border text-brand-text rounded-lg hover:bg-brand-greenSoft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Anterior
            </button>
            
            {isProfileStep ? (
              <button
                onClick={handleProfileSubmit}
                className="px-6 py-3 bg-brand-green text-white rounded-lg hover:bg-brand-greenDark transition-colors"
              >
                Obter Meus Resultados
                <ArrowRight className="w-4 h-4 inline ml-2" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={!answers[currentStepData.id as keyof typeof answers]}
                className="px-6 py-3 bg-brand-green text-white rounded-lg hover:bg-brand-greenDark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próximo
                <ArrowRight className="w-4 h-4 inline ml-2" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
