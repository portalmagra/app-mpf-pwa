'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Download, Eye, Lock, CheckCircle, Star, ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'
import ProtocolPreview from '@/components/ProtocolPreview'

interface Protocol {
  id: string
  name: string
  description: string
  price: number
  purchased: boolean
  preview_url?: string
  download_url?: string
  category: string
}

export default function MeusProtocolos() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null)

  // Lista dos 16 protocolos disponíveis
  const availableProtocols: Protocol[] = [
    {
      id: 'alternativa-sem-caneta',
      name: 'Protocolo Alternativa Sem Caneta',
      description: 'Alternativas naturais para emagrecimento sem medicação',
      price: 10,
      purchased: false,
      category: 'Emagrecimento'
    },
    {
      id: 'suporte-canetas-emagrecedoras',
      name: 'Protocolo Suporte com Canetas Emagrecedoras',
      description: 'Suporte nutricional completo para usuárias de canetas',
      price: 10,
      purchased: false,
      category: 'Canetas'
    },
    {
      id: 'anti-inflamatorio',
      name: 'Protocolo Anti-inflamatório',
      description: 'Redução de inflamação e melhora da saúde geral',
      price: 10,
      purchased: false,
      category: 'Saúde'
    },
    {
      id: 'detox-leve',
      name: 'Protocolo Detox Leve',
      description: 'Desintoxicação suave e natural do organismo',
      price: 10,
      purchased: false,
      category: 'Detox'
    },
    {
      id: 'energia-imunidade',
      name: 'Protocolo Energia e Imunidade',
      description: 'Aumento de energia e fortalecimento do sistema imunológico',
      price: 10,
      purchased: false,
      category: 'Energia'
    },
    {
      id: 'fitness-performance',
      name: 'Protocolo Fitness e Performance',
      description: 'Otimização do desempenho físico e mental',
      price: 10,
      purchased: false,
      category: 'Fitness'
    },
    {
      id: 'imunidade-avancada',
      name: 'Protocolo Imunidade Avançada',
      description: 'Fortalecimento avançado do sistema imunológico',
      price: 10,
      purchased: false,
      category: 'Imunidade'
    },
    {
      id: 'intestino-livre',
      name: 'Protocolo Intestino Livre',
      description: 'Saúde intestinal e digestão otimizada',
      price: 10,
      purchased: false,
      category: 'Digestão'
    },
    {
      id: 'mulheres-40',
      name: 'Protocolo Mulheres 40+',
      description: 'Cuidados específicos para mulheres após os 40',
      price: 10,
      purchased: false,
      category: 'Hormonal'
    },
    {
      id: 'nausea-refluxo',
      name: 'Protocolo Náusea e Refluxo',
      description: 'Alívio de náuseas e problemas digestivos',
      price: 10,
      purchased: false,
      category: 'Digestão'
    },
    {
      id: 'pele-cabelo-unhas',
      name: 'Protocolo Pele, Cabelo e Unhas',
      description: 'Cuidados para beleza e saúde da pele, cabelo e unhas',
      price: 10,
      purchased: false,
      category: 'Beleza'
    },
    {
      id: 'pos-caneta-manutencao',
      name: 'Protocolo Pós-Caneta Manutenção',
      description: 'Manutenção dos resultados após uso de canetas',
      price: 10,
      purchased: false,
      category: 'Canetas'
    },
    {
      id: 'pre-caneta',
      name: 'Protocolo Pré-Caneta',
      description: 'Preparação antes de iniciar uso de canetas',
      price: 10,
      purchased: false,
      category: 'Canetas'
    },
    {
      id: 'proteina-massa-magra',
      name: 'Protocolo Proteína e Massa Magra',
      description: 'Preservação e ganho de massa muscular',
      price: 10,
      purchased: false,
      category: 'Musculação'
    },
    {
      id: 'sono-ansiedade',
      name: 'Protocolo Sono e Ansiedade',
      description: 'Melhora da qualidade do sono e redução da ansiedade',
      price: 10,
      purchased: false,
      category: 'Bem-estar'
    }
  ]

  useEffect(() => {
    // Simular carregamento dos protocolos comprados
    // Em produção, isso viria do Supabase
    setTimeout(() => {
      // Simular alguns protocolos comprados
      const purchasedProtocols = availableProtocols.map(protocol => ({
        ...protocol,
        purchased: Math.random() > 0.7 // Simular 30% comprados
      }))
      setProtocols(purchasedProtocols)
      setLoading(false)
    }, 1000)
  }, [])

  const handleDownload = async (protocol: Protocol) => {
    try {
      // Em produção, isso faria download do Supabase Storage
      console.log('Downloading protocol:', protocol.id)
      alert(`Download do protocolo "${protocol.name}" iniciado!`)
    } catch (error) {
      console.error('Error downloading protocol:', error)
      alert('Erro ao fazer download. Tente novamente.')
    }
  }

  const handlePreview = (protocol: Protocol) => {
    setSelectedProtocol(protocol)
  }

  const purchasedProtocols = protocols.filter(p => p.purchased)
  const availableToPurchase = protocols.filter(p => !p.purchased)

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream pb-16">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
            <p className="text-brand-text2">Carregando seus protocolos...</p>
          </div>
        </div>
      </div>
    )
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
            📚 Meus Protocolos
          </h1>
          <p className="text-brand-text2 text-sm">
            Acesse seus protocolos comprados e descubra novos
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-brand-green">{purchasedProtocols.length}</p>
                <p className="text-xs text-brand-text2">Comprados</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-text">{availableToPurchase.length}</p>
                <p className="text-xs text-brand-text2">Disponíveis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocolos Comprados */}
      {purchasedProtocols.length > 0 && (
        <section className="px-4 mb-6">
          <div className="max-w-sm mx-auto">
            <h2 className="text-lg font-bold text-brand-text mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-brand-green mr-2" />
              Seus Protocolos
            </h2>
            <div className="space-y-3">
              {purchasedProtocols.map((protocol) => (
                <div key={protocol.id} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-brand-text mb-1">{protocol.name}</h3>
                      <p className="text-xs text-brand-text2 mb-2">{protocol.description}</p>
                      <span className="inline-block bg-brand-greenSoft text-brand-green text-xs px-2 py-1 rounded-full">
                        {protocol.category}
                      </span>
                    </div>
                    <div className="flex space-x-2 ml-3">
                      <button
                        onClick={() => handlePreview(protocol)}
                        className="p-2 bg-brand-greenSoft text-brand-green rounded-lg hover:bg-brand-green hover:text-white transition-colors"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(protocol)}
                        className="p-2 bg-brand-green text-white rounded-lg hover:bg-brand-greenDark transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Protocolos Disponíveis */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <h2 className="text-lg font-bold text-brand-text mb-4 flex items-center">
            <Star className="w-5 h-5 text-brand-green mr-2" />
            Protocolos Disponíveis
          </h2>
          <div className="space-y-3">
            {availableToPurchase.slice(0, 6).map((protocol) => (
              <div key={protocol.id} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-brand-text mb-1">{protocol.name}</h3>
                    <p className="text-xs text-brand-text2 mb-2">{protocol.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {protocol.category}
                      </span>
                      <span className="text-sm font-bold text-brand-green">${protocol.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center ml-3">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {availableToPurchase.length > 6 && (
            <div className="text-center mt-4">
              <Link 
                href="/quiz" 
                className="text-brand-green text-sm font-medium hover:underline"
              >
                Ver todos os {availableToPurchase.length} protocolos disponíveis
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Bundle Offer */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-gradient-to-r from-brand-green to-brand-greenDark rounded-xl p-6 text-white text-center shadow-lg">
            <h3 className="text-xl font-bold mb-2">🎁 Oferta Especial</h3>
            <p className="text-sm mb-4">
              Obtenha todos os 16 protocolos por apenas $67
            </p>
            <p className="text-xs text-green-100 mb-4">
              Economia de $93 (58% de desconto!)
            </p>
            <Link 
              href="/quiz" 
              className="bg-white text-brand-green px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block"
            >
              Obter Pacote Completo
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/meus-protocolos" />

      {/* Protocol Preview Modal */}
      {selectedProtocol && (
        <ProtocolPreview
          protocol={selectedProtocol}
          onClose={() => setSelectedProtocol(null)}
          onDownload={() => handleDownload(selectedProtocol)}
        />
      )}
    </div>
  )
}