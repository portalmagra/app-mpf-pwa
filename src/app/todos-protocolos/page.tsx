'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, Eye, Lock, CheckCircle, Star, Filter, Search } from 'lucide-react'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
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

  const categories = ['all', 'Canetas', 'Digestão', 'Energia', 'Musculação', 'Saúde', 'Hormonal', 'Beleza', 'Bem-estar', 'Fitness', 'Emagrecimento', 'Detox']

  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = protocol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         protocol.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || protocol.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
            📚 Todos os Protocolos
          </h1>
          <p className="text-brand-text2 text-sm">
            Protocolos especializados para brasileiras que usam canetas de emagrecimento
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar protocolos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-brand-green text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'Todos' : category}
                </button>
              ))}
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
                  <strong>Um único download</strong> - máxima conveniência
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-green-200 mr-2" />
                  <strong>55% de desconto</strong> - Economia de ${(protocols.length * 10) - 67}
                </li>
              </ul>
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
                🛒 Obter Pacote Completo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Protocols Grid */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="space-y-4">
            {filteredProtocols.map((protocol) => (
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

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-brand-green">${protocol.price}</span>
                  <button
                    onClick={() => handlePurchase(protocol.id)}
                    className="px-4 py-2 bg-brand-green text-white rounded-lg text-sm font-bold hover:bg-brand-greenDark transition-colors"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProtocols.length === 0 && (
            <div className="text-center py-8">
              <p className="text-brand-text2">Nenhum protocolo encontrado</p>
              <p className="text-xs text-brand-text2 mt-1">Tente ajustar os filtros</p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/todos-protocolos" />
    </div>
  )
}
