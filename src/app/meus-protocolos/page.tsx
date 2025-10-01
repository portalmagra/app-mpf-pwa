'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Download, CheckCircle, Calendar, FileText, ArrowLeft, RefreshCw, BookOpen } from 'lucide-react'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'

interface PurchasedItem {
  id: string
  item_id: string
  item_name: string
  item_type: 'protocol' | 'ebook'
  purchase_date: string
  status: string
  amount: number
  customer_email: string
}

export default function MeusProtocolos() {
  const [items, setItems] = useState<PurchasedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simular busca de itens comprados (protocolos + eBooks)
  useEffect(() => {
    const fetchPurchasedItems = async () => {
      try {
        setLoading(true)
        
        // Por enquanto, simular dados (em produção, buscar do Supabase)
        const mockItems: PurchasedItem[] = [
          {
            id: '1',
            item_id: 'nausea-refluxo',
            item_name: 'Protocolo Náusea e Refluxo',
            item_type: 'protocol',
            purchase_date: '2025-01-25T10:30:00Z',
            status: 'completed',
            amount: 10.00,
            customer_email: 'usuario@exemplo.com'
          },
          {
            id: '2',
            item_id: 'intestino-livre',
            item_name: 'Protocolo Intestino Livre',
            item_type: 'protocol',
            purchase_date: '2025-01-24T15:45:00Z',
            status: 'completed',
            amount: 10.00,
            customer_email: 'usuario@exemplo.com'
          },
          {
            id: '3',
            item_id: 'ebook-fit-doces',
            item_name: 'eBook Fit Doces',
            item_type: 'ebook',
            purchase_date: '2025-01-23T09:15:00Z',
            status: 'completed',
            amount: 15.00,
            customer_email: 'usuario@exemplo.com'
          },
          {
            id: '4',
            item_id: 'ebook-saladas-funcionais',
            item_name: 'eBook Saladas Funcionais',
            item_type: 'ebook',
            purchase_date: '2025-01-22T14:20:00Z',
            status: 'completed',
            amount: 12.00,
            customer_email: 'usuario@exemplo.com'
          }
        ]
        
        setItems(mockItems)
        setError(null)
      } catch (err) {
        setError('Erro ao carregar itens comprados')
        console.error('Erro:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPurchasedItems()
  }, [])

  const handleDownload = async (itemId: string, itemName: string, itemType: 'protocol' | 'ebook') => {
    try {
      // Simular session ID (em produção, usar session real)
      const sessionId = 'cs_live_b1vLq9yOkDV5lniwF0uoLCQafrXZM1H66AHW3YZyWgdIVPBX0fUYm'
      
      let downloadUrl: string
      
      if (itemType === 'protocol') {
        downloadUrl = `/api/protocols/download?protocol=${itemId}&session=${sessionId}`
      } else {
        downloadUrl = `/api/ebooks/download?ebook=${itemId}&session=${sessionId}`
      }
      
      // Abrir download em nova aba
      window.open(downloadUrl, '_blank')
      
    } catch (error) {
      console.error('Erro ao fazer download:', error)
      alert('Erro ao fazer download. Tente novamente.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getItemIcon = (itemId: string, itemType: 'protocol' | 'ebook') => {
    if (itemType === 'ebook') {
      return '📖'
    }
    
    const iconMap: { [key: string]: string } = {
      'suporte-canetas-emagrecedoras': '💉',
      'pre-caneta': '🎯',
      'pos-caneta-manutencao': '🔄',
      'proteina-massa-magra': '💪',
      'intestino-livre': '🌱',
      'nausea-refluxo': '🤢',
      'energia-imunidade': '⚡',
      'detox-leve': '🧹',
      'anti-inflamatorio': '🔥',
      'mulheres-40': '🌸',
      'pele-cabelo-unhas': '✨',
      'sono-ansiedade': '😴',
      'fitness-performance': '🏃‍♀️',
      'alternativa-sem-caneta': '🌿',
      'pacote-completo': '📚'
    }
    return iconMap[itemId] || '📄'
  }

  const getItemTypeLabel = (itemType: 'protocol' | 'ebook') => {
    return itemType === 'protocol' ? 'Protocolo' : 'eBook'
  }

  const getItemTypeColor = (itemType: 'protocol' | 'ebook') => {
    return itemType === 'protocol' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
  }

  return (
    <div className="min-h-screen bg-brand-cream pb-16">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="mr-3 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <Logo variant="horizontal" size="md" />
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-6 text-center">
        <div className="max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-brand-text mb-2">
            👤 Meus Conteúdos
          </h1>
          <p className="text-brand-text2 text-sm">
            Tudo que você baixou, comprou ou favoritou em um só lugar
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="px-4">
        <div className="max-w-sm mx-auto">
          {loading ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <RefreshCw className="w-8 h-8 text-brand-green mx-auto mb-4 animate-spin" />
              <p className="text-brand-text2">Carregando seus itens...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-text mb-2">Erro ao carregar</h3>
              <p className="text-brand-text2 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-greenDark transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-text mb-2">Nenhum conteúdo ainda</h3>
              <p className="text-brand-text2 mb-6">
                Você ainda não baixou ou comprou nenhum conteúdo. Explore nossa seleção!
              </p>
              <div className="space-y-3">
                <Link 
                  href="/protocolos"
                  className="block px-6 py-3 bg-brand-green text-white rounded-lg font-semibold hover:bg-brand-greenDark transition-colors"
                >
                  Ver Protocolos
                </Link>
                <Link 
                  href="/ebooks"
                  className="block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Ver eBooks
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{getItemIcon(item.item_id, item.item_type)}</span>
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="font-bold text-brand-text text-lg mr-2">{item.item_name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getItemTypeColor(item.item_type)}`}>
                            {getItemTypeLabel(item.item_type)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-brand-text2">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(item.purchase_date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-brand-green">${item.amount}</span>
                      <div className="flex items-center text-sm text-green-600 mt-1">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Pago
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-lg p-4 mb-4 ${item.item_type === 'protocol' ? 'bg-brand-greenSoft' : 'bg-purple-50'}`}>
                    <div className="flex items-center text-sm text-brand-text">
                      {item.item_type === 'protocol' ? (
                        <FileText className="w-4 h-4 mr-2" />
                      ) : (
                        <BookOpen className="w-4 h-4 mr-2" />
                      )}
                      <span className="font-medium">Arquivo disponível para download</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(item.item_id, item.item_name, item.item_type)}
                    className={`w-full px-4 py-3 text-white rounded-lg font-semibold transition-colors flex items-center justify-center ${
                      item.item_type === 'protocol' 
                        ? 'bg-brand-green hover:bg-brand-greenDark' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar {getItemTypeLabel(item.item_type)}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Links para comprar mais */}
          {items.length > 0 && (
            <div className="mt-6 text-center space-y-2">
              <Link 
                href="/todos-protocolos"
                className="block text-brand-green text-sm font-medium hover:underline"
              >
                Ver mais protocolos disponíveis
              </Link>
              <Link 
                href="/ebooks"
                className="block text-purple-600 text-sm font-medium hover:underline"
              >
                Ver mais eBooks disponíveis
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/meus-protocolos" />
    </div>
  )
}