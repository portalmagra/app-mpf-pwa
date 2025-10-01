'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, Eye, Lock, CheckCircle, Star } from 'lucide-react'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'

interface Protocol {
  id: string
  name: string
  description: string
  price: number
  category: string
  icon: string
  features: string[]
  popular?: boolean
}

export default function TodosProtocolos() {
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

  const protocols: Protocol[] = [
    {
      id: 'suporte-canetas-emagrecedoras',
      name: 'Protocolo Suporte com Canetas Emagrecedoras',
      description: 'Suporte nutricional completo para usuárias de canetas',
      price: 10,
      category: 'Canetas',
      icon: '💉',
      features: ['Otimização de proteína', 'Prevenção de perda muscular', 'Suporte digestivo'],
      popular: true
    },
    {
      id: 'pre-caneta',
      name: 'Protocolo Pré-Caneta',
      description: 'Preparação antes de iniciar uso de canetas',
      price: 10,
      category: 'Canetas',
      icon: '🎯',
      features: ['Preparação nutricional', 'Otimização metabólica', 'Suporte inicial']
    },
    {
      id: 'pos-caneta-manutencao',
      name: 'Protocolo Pós-Caneta Manutenção',
      description: 'Manutenção dos resultados após uso de canetas',
      price: 10,
      category: 'Canetas',
      icon: '🔄',
      features: ['Manutenção de resultados', 'Prevenção de reganho', 'Transição suave']
    },
    {
      id: 'proteina-massa-magra',
      name: 'Protocolo Proteína e Massa Magra',
      description: 'Preservação e ganho de massa muscular',
      price: 10,
      category: 'Musculação',
      icon: '💪',
      features: ['Otimização de proteína', 'Guia de treino resistido', 'Protocolos de recuperação'],
      popular: true
    },
    {
      id: 'intestino-livre',
      name: 'Protocolo Intestino Livre',
      description: 'Saúde intestinal e digestão otimizada',
      price: 10,
      category: 'Digestão',
      icon: '🌱',
      features: ['Otimização de fibras', 'Orientação probiótica', 'Enzimas digestivas']
    },
    {
      id: 'nausea-refluxo',
      name: 'Protocolo Náusea e Refluxo',
      description: 'Alívio de náuseas e problemas digestivos',
      price: 10,
      category: 'Digestão',
      icon: '🤢',
      features: ['Alívio de náuseas', 'Controle de refluxo', 'Suporte digestivo']
    },
    {
      id: 'energia-imunidade',
      name: 'Protocolo Energia e Imunidade',
      description: 'Aumentar energia e apoiar função imunológica',
      price: 10,
      category: 'Energia',
      icon: '⚡',
      features: ['Otimização de vitaminas', 'Equilíbrio mineral', 'Protocolos de energia']
    },
    {
      id: 'imunidade-avancada',
      name: 'Protocolo Imunidade Avançada',
      description: 'Fortalecimento avançado do sistema imunológico',
      price: 10,
      category: 'Energia',
      icon: '🛡️',
      features: ['Imunidade avançada', 'Suporte antioxidante', 'Proteção celular']
    },
    {
      id: 'detox-leve',
      name: 'Protocolo Detox Leve',
      description: 'Desintoxicação suave e natural do organismo',
      price: 10,
      category: 'Detox',
      icon: '🧹',
      features: ['Desintoxicação natural', 'Otimização metabólica', 'Quebra de platô']
    },
    {
      id: 'anti-inflamatorio',
      name: 'Protocolo Anti-inflamatório',
      description: 'Redução de inflamação e melhora da saúde geral',
      price: 10,
      category: 'Saúde',
      icon: '🔥',
      features: ['Redução de inflamação', 'Suporte antioxidante', 'Saúde geral']
    },
    {
      id: 'mulheres-40',
      name: 'Protocolo Mulheres 40+',
      description: 'Cuidados específicos para mulheres após os 40',
      price: 10,
      category: 'Hormonal',
      icon: '🌸',
      features: ['Suporte hormonal', 'Otimização metabólica', 'Cuidados específicos']
    },
    {
      id: 'pele-cabelo-unhas',
      name: 'Protocolo Pele, Cabelo e Unhas',
      description: 'Cuidados para beleza e saúde da pele, cabelo e unhas',
      price: 10,
      category: 'Beleza',
      icon: '✨',
      features: ['Saúde da pele', 'Fortalecimento capilar', 'Unhas saudáveis']
    },
    {
      id: 'sono-ansiedade',
      name: 'Protocolo Sono e Ansiedade',
      description: 'Melhora da qualidade do sono e redução da ansiedade',
      price: 10,
      category: 'Bem-estar',
      icon: '😴',
      features: ['Qualidade do sono', 'Redução de ansiedade', 'Bem-estar mental']
    },
    {
      id: 'fitness-performance',
      name: 'Protocolo Fitness e Performance',
      description: 'Otimização do desempenho físico e mental',
      price: 10,
      category: 'Fitness',
      icon: '🏃‍♀️',
      features: ['Performance física', 'Otimização mental', 'Recuperação']
    },
    {
      id: 'alternativa-sem-caneta',
      name: 'Protocolo Alternativa Sem Caneta',
      description: 'Alternativas naturais para emagrecimento sem medicação',
      price: 10,
      category: 'Emagrecimento',
      icon: '🌿',
      features: ['Alternativas naturais', 'Otimização metabólica', 'Suporte nutricional']
    }
  ]

  const getProtocolArgument = (protocolId: string) => {
    const argumentMap: { [key: string]: { title: string, description: string } } = {
      'suporte-canetas-emagrecedoras': {
        title: 'Por que usar durante as canetas?',
        description: 'Evita perda muscular e mantém energia durante o tratamento'
      },
      'pre-caneta': {
        title: 'Por que preparar antes?',
        description: 'Otimiza metabolismo e reduz efeitos colaterais das canetas'
      },
      'pos-caneta-manutencao': {
        title: 'Por que manter depois?',
        description: 'Previne reganho e mantém resultados a longo prazo'
      },
      'proteina-massa-magra': {
        title: 'Por que preservar músculos?',
        description: 'Evita flacidez e mantém força durante emagrecimento'
      },
      'intestino-livre': {
        title: 'Por que cuidar do intestino?',
        description: 'Melhora absorção de nutrientes e resultados eficazes'
      },
      'nausea-refluxo': {
        title: 'Por que aliviar náuseas?',
        description: 'Reduz desconforto digestivo durante o tratamento'
      },
      'energia-imunidade': {
        title: 'Por que fortalecer imunidade?',
        description: 'Mantém energia e previne doenças durante emagrecimento'
      },
      'imunidade-avancada': {
        title: 'Por que imunidade avançada?',
        description: 'Proteção extra para brasileiras com sistema imunológico sensível'
      },
      'detox-leve': {
        title: 'Por que fazer detox?',
        description: 'Elimina toxinas e acelera resultados das canetas'
      },
      'anti-inflamatorio': {
        title: 'Por que reduzir inflamação?',
        description: 'Diminui inchaço e melhora resposta ao tratamento'
      },
      'mulheres-40': {
        title: 'Por que protocolo 40+?',
        description: 'Adaptado para mudanças hormonais e metabolismo feminino'
      },
      'pele-cabelo-unhas': {
        title: 'Por que cuidar da beleza?',
        description: 'Mantém pele, cabelo e unhas saudáveis durante emagrecimento'
      },
      'sono-ansiedade': {
        title: 'Por que melhorar o sono?',
        description: 'Qualidade do sono acelera resultados e reduz ansiedade'
      },
      'fitness-performance': {
        title: 'Por que combinar com exercícios?',
        description: 'Maximiza resultados e preserva massa muscular'
      },
      'alternativa-sem-caneta': {
        title: 'Por que alternativa natural?',
        description: 'Para quem prefere métodos naturais de emagrecimento'
      }
    }
    return argumentMap[protocolId] || { title: 'Protocolo Especializado', description: 'Desenvolvido para suas necessidades específicas' }
  }

  const getPriceId = (protocolId: string) => {
    // Price IDs de PRODUÇÃO para cada protocolo - compatíveis com chaves Live
    const priceMap: { [key: string]: string } = {
      'suporte-canetas-emagrecedoras': 'price_1SBE63EVE42ibKnXtcfzXnVB', // $10.00 - Protocolo Suporte
      'pre-caneta': 'price_1SBE63EVE42ibKnXldmfGtVs', // $10.00 - Protocolo Pré-Caneta
      'pos-caneta-manutencao': 'price_1SBE63EVE42ibKnX1XPtQNwx', // $10.00 - Protocolo Pós-Caneta
      'proteina-massa-magra': 'price_1SBE64EVE42ibKnXJDz09OjU', // $10.00 - Protocolo Proteína
      'intestino-livre': 'price_1SBE64EVE42ibKnXVmLnSTzL', // $10.00 - Protocolo Intestino
      'nausea-refluxo': 'price_1SBE64EVE42ibKnXivMrP8OX', // $10.00 - Protocolo Náusea
      'energia-imunidade': 'price_1SBE65EVE42ibKnXfc5aa4Xc', // $10.00 - Protocolo Energia
      'imunidade-avancada': 'price_1SBdfCEVE42ibKnXv0ylbGZK', // $10.00 - Protocolo Imunidade Avançada
      'detox-leve': 'price_1SBE65EVE42ibKnXZUi4WGSm', // $10.00 - Protocolo Detox
      'anti-inflamatorio': 'price_1SBE65EVE42ibKnXzy5HvJHz', // $10.00 - Protocolo Anti-inflamatório
      'mulheres-40': 'price_1SBE66EVE42ibKnXZj2xLerV', // $10.00 - Protocolo Mulheres 40+
      'pele-cabelo-unhas': 'price_1SBE66EVE42ibKnXJxm4ft2g', // $10.00 - Protocolo Pele/Cabelo
      'sono-ansiedade': 'price_1SBE66EVE42ibKnXQqRAf2nt', // $10.00 - Protocolo Sono
      'fitness-performance': 'price_1SBE67EVE42ibKnXOK0ECkaE', // $10.00 - Protocolo Fitness
      'alternativa-sem-caneta': 'price_1SBE67EVE42ibKnXj6hrH2cF', // $10.00 - Protocolo Alternativa
      'pacote-completo': 'price_1SBE67EVE42ibKnX8ddjXvxk' // $67.00 - Pacote Completo
    }
    return priceMap[protocolId] || 'price_1SBE64EVE42ibKnXVmLnSTzL' // Default Protocolo Intestino
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

  return (
    <div className="min-h-screen bg-brand-cream pb-16">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
            <Link href="/" className="text-brand-green text-sm font-medium">
              🏠 Início
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-6 text-center">
        <div className="max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-brand-text mb-2">
            📚 Protocolos Especializados
          </h1>
          <p className="text-brand-text2 text-sm mb-4">
            Desenvolvidos por especialistas brasileiros para brasileiras que usam canetas de emagrecimento
          </p>
        </div>
      </section>

      {/* Argumentos dos Protocolos */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4">
            <div className="flex items-center justify-center mb-3">
              <span className="text-2xl mr-2">🏥</span>
              <h3 className="font-bold text-brand-text text-sm">Por que cada protocolo é essencial?</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🎯</span>
                  <h4 className="font-bold text-xs text-brand-text">Pré-Caneta</h4>
                </div>
                <p className="text-xs text-brand-text2">
                  <strong>Por quê?</strong> Prepara seu corpo para receber a caneta, otimizando metabolismo e reduzindo efeitos colaterais
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">💉</span>
                  <h4 className="font-bold text-xs text-brand-text">Suporte com Canetas</h4>
                </div>
                <p className="text-xs text-brand-text2">
                  <strong>Por quê?</strong> Evita perda muscular e mantém energia durante o tratamento com canetas
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🔄</span>
                  <h4 className="font-bold text-xs text-brand-text">Pós-Caneta</h4>
                </div>
                <p className="text-xs text-brand-text2">
                  <strong>Por quê?</strong> Mantém os resultados e previne reganho de peso após parar as canetas
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">💪</span>
                  <h4 className="font-bold text-xs text-brand-text">Proteína e Massa Magra</h4>
                </div>
                <p className="text-xs text-brand-text2">
                  <strong>Por quê?</strong> Preserva músculos durante emagrecimento, evitando flacidez e mantendo força
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🌱</span>
                  <h4 className="font-bold text-xs text-brand-text">Intestino Livre</h4>
                </div>
                <p className="text-xs text-brand-text2">
                  <strong>Por quê?</strong> Melhora digestão e absorção de nutrientes, essencial para resultados eficazes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle Offer */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-gradient-to-r from-brand-green to-brand-greenDark rounded-xl p-6 text-white shadow-lg">
            {/* Imagem do Pacote */}
            <div className="flex items-center mb-4">
              <img 
                src="/images/protocolos/Todos Protocolos.jpg"
                alt="Pacote Completo - Todos os Protocolos"
                className="w-20 h-20 object-cover rounded-lg mr-4"
              />
              <div>
                <h3 className="text-xl font-bold">🎁 Pacote Completo</h3>
                <p className="text-sm text-green-100">Todos os {protocols.length} Protocolos</p>
              </div>
            </div>

            {/* Credibilidade Médica */}
            <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">🏥</span>
                <h4 className="font-bold text-sm">Desenvolvido por Especialistas Brasileiros</h4>
              </div>
              <p className="text-xs text-green-100">
                Protocolos personalizados para brasileiras
              </p>
            </div>

            {/* Argumentos de Venda */}
            <div className="mb-4">
              <h4 className="font-bold text-sm mb-2">✨ Por que escolher o pacote completo?</h4>
              <ul className="text-xs text-green-100 space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-green-200 mr-2" />
                  <strong>15 protocolos</strong> para diferentes necessidades com canetas
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-green-200 mr-2" />
                  <strong>Prevenção e manutenção</strong> completa
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-green-200 mr-2" />
                  <strong>Acesso imediato</strong> após o pagamento
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-green-200 mr-2" />
                  <strong>Economia de tempo e dinheiro</strong>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-green-200 mr-2" />
                  <strong>55% de desconto</strong> - Economia de ${(protocols.length * 10) - 67}
                </li>
              </ul>
            </div>

            {/* Social Proof */}
            <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">👥</span>
                <h4 className="font-bold text-sm">Depoimentos de Brasileiras Reais</h4>
              </div>
              <p className="text-xs text-green-100 italic">
                "Finalmente encontrei protocolos feitos especificamente para brasileiras nos EUA!" - Maria, FL
              </p>
            </div>

            {/* Preço e Botão */}
            <div className="text-center">
              <div className="mb-3">
                <span className="text-2xl font-bold">$67</span>
                <span className="text-sm text-green-100 ml-2">(valor único)</span>
              </div>
              <button 
                onClick={() => handlePurchase('pacote-completo')}
                className="bg-white text-brand-green px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block w-full"
              >
                🛒 Investir na Minha Saúde
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Protocols Grid */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="space-y-4">
            {protocols.map((protocol) => (
              <div key={protocol.id} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                {/* Protocol Image */}
                <div className="mb-4">
                  <div className="w-full h-32 rounded-lg overflow-hidden">
                    {!imageErrors.has(protocol.id) ? (
                <img 
                  src={`/images/protocolos/${getProtocolImageName(protocol.id)}`}
                  alt={protocol.name}
                  className="w-full h-full object-cover"
                  onLoad={() => {
                    console.log('Imagem carregada com sucesso:', protocol.name)
                  }}
                  onError={(e) => {
                    console.log('Erro ao carregar imagem:', protocol.name, 'URL:', e.currentTarget.src)
                    setImageErrors(prev => new Set(prev).add(protocol.id))
                  }}
                />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-brand-green to-brand-greenDark flex items-center justify-center text-white text-2xl font-bold">
                        {protocol.icon}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{protocol.icon}</span>
                    <div>
                      <h3 className="font-bold text-brand-text text-sm">{protocol.name}</h3>
                      <span className="inline-block bg-brand-greenSoft text-brand-green text-xs px-2 py-1 rounded-full mt-1">
                        {protocol.category}
                      </span>
                    </div>
                  </div>
                  {protocol.popular && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                      ⭐ Popular
                    </span>
                  )}
                </div>

                <p className="text-xs text-brand-text2 mb-3">{protocol.description}</p>

                {/* Argumento Específico */}
                <div className="bg-blue-50 rounded-lg p-2 mb-3">
                  <div className="flex items-center mb-1">
                    <span className="text-sm mr-1">🏥</span>
                    <span className="text-xs font-medium text-blue-800">{getProtocolArgument(protocol.id).title}</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    {getProtocolArgument(protocol.id).description}
                  </p>
                </div>

                <div className="mb-3">
                  <h4 className="text-xs font-medium text-brand-text mb-1">Inclui:</h4>
                  <ul className="text-xs text-brand-text2 space-y-1">
                    {protocol.features.slice(0, 2).map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-brand-green mr-2" />
                        {feature}
                      </li>
                    ))}
                    {protocol.features.length > 2 && (
                      <li className="text-gray-500">
                        +{protocol.features.length - 2} recursos adicionais
                      </li>
                    )}
                  </ul>
                </div>

                {/* Benefícios */}
                <div className="bg-green-50 rounded-lg p-2 mb-3">
                  <div className="flex items-center mb-1">
                    <span className="text-sm mr-1">⚡</span>
                    <span className="text-xs font-medium text-green-800">Acesso Imediato</span>
                  </div>
                  <p className="text-xs text-green-700">
                    Disponível após o pagamento
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-brand-green">${protocol.price}</span>
                  </div>
                  <button
                    onClick={() => handlePurchase(protocol.id)}
                    className="px-4 py-2 bg-brand-green text-white rounded-lg text-sm font-bold hover:bg-brand-greenDark transition-colors"
                  >
                    Investir na Saúde
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-brand-text mb-4 text-center">
              📊 Resultados Reais de Brasileiras
            </h3>
            
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <span className="text-sm mr-2">📈</span>
                  <span className="text-sm font-medium text-green-800">Maria, Florida</span>
                </div>
                <p className="text-xs text-green-700 italic">
                  "O protocolo de proteína me ajudou a manter minha massa muscular durante o emagrecimento. Aprendi muito sobre quando comer proteína!"
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <span className="text-sm mr-2">🔬</span>
                  <span className="text-sm font-medium text-blue-800">Ana, California</span>
                </div>
                <p className="text-xs text-blue-700 italic">
                  "O protocolo pré-caneta me ajudou muito com os efeitos colaterais. Aprendi sobre magnésio e minha digestão melhorou bastante."
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <span className="text-sm mr-2">⚡</span>
                  <span className="text-sm font-medium text-purple-800">Carla, Texas</span>
                </div>
                <p className="text-xs text-purple-700 italic">
                  "O protocolo de intestino melhorou muito minha energia. Perdi peso sem me sentir fraca. Os probióticos fizeram diferença!"
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <span className="text-sm mr-2">🏥</span>
                  <span className="text-sm font-medium text-orange-800">Patricia, New York</span>
                </div>
                <p className="text-xs text-orange-700 italic">
                  "O protocolo de suporte com canetas me ensinou muito! Aprendi sobre nutrientes que eu nem sabia que existiam. Melhorei minha energia!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/protocolos" />
    </div>
  )
}
