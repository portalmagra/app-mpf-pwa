'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Download, CheckCircle, Calendar, FileText, ArrowLeft, RefreshCw } from 'lucide-react'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'

interface PurchasedProtocol {
  id: string
  protocol_id: string
  protocol_name: string
  purchase_date: string
  status: string
  amount: number
  customer_email: string
}

export default function MeusProtocolos() {
  const [protocols, setProtocols] = useState<PurchasedProtocol[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simular busca de protocolos comprados (em produção, viria do Supabase)
  useEffect(() => {
    const fetchPurchasedProtocols = async () => {
      try {
        setLoading(true)
        
        // Por enquanto, simular dados (em produção, buscar do Supabase)
        const mockProtocols: PurchasedProtocol[] = [
          {
            id: '1',
            protocol_id: 'nausea-refluxo',
            protocol_name: 'Protocolo Náusea e Refluxo',
            purchase_date: '2025-01-25T10:30:00Z',
            status: 'completed',
            amount: 10.00,
            customer_email: 'usuario@exemplo.com'
          },
          {
            id: '2',
            protocol_id: 'intestino-livre',
            protocol_name: 'Protocolo Intestino Livre',
            purchase_date: '2025-01-24T15:45:00Z',
            status: 'completed',
            amount: 10.00,
            customer_email: 'usuario@exemplo.com'
          }
        ]
        
        setProtocols(mockProtocols)
        setError(null)
      } catch (err) {
        setError('Erro ao carregar protocolos comprados')
        console.error('Erro:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPurchasedProtocols()
  }, [])

  const handleDownload = async (protocolId: string, protocolName: string) => {
    try {
      // Simular session ID (em produção, usar session real)
      const sessionId = 'cs_live_b1vLq9yOkDV5lniwF0uoLCQafrXZM1H66AHW3YZyWgdIVPBX0fUYm'
      
      const downloadUrl = `/api/protocols/download?protocol=${protocolId}&session=${sessionId}`
      
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

  const getProtocolIcon = (protocolId: string) => {
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
    return iconMap[protocolId] || '📄'
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
            📚 Meus Protocolos
          </h1>
          <p className="text-brand-text2 text-sm">
            Acesse seus protocolos comprados a qualquer momento
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="px-4">
        <div className="max-w-sm mx-auto">
          {loading ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <RefreshCw className="w-8 h-8 text-brand-green mx-auto mb-4 animate-spin" />
              <p className="text-brand-text2">Carregando seus protocolos...</p>
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
          ) : protocols.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-text mb-2">Nenhum protocolo comprado</h3>
              <p className="text-brand-text2 mb-6">
                Você ainda não comprou nenhum protocolo. Explore nossa seleção!
              </p>
              <Link 
                href="/todos-protocolos"
                className="px-6 py-3 bg-brand-green text-white rounded-lg font-semibold hover:bg-brand-greenDark transition-colors inline-block"
              >
                Ver Protocolos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {protocols.map((protocol) => (
                <div key={protocol.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{getProtocolIcon(protocol.protocol_id)}</span>
                      <div>
                        <h3 className="font-bold text-brand-text text-lg">{protocol.protocol_name}</h3>
                        <div className="flex items-center text-sm text-brand-text2 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(protocol.purchase_date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-brand-green">${protocol.amount}</span>
                      <div className="flex items-center text-sm text-green-600 mt-1">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Pago
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-greenSoft rounded-lg p-4 mb-4">
                    <div className="flex items-center text-sm text-brand-text">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="font-medium">Arquivo disponível para download</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(protocol.protocol_id, protocol.protocol_name)}
                    className="w-full px-4 py-3 bg-brand-green text-white rounded-lg font-semibold hover:bg-brand-greenDark transition-colors flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar Protocolo
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Link para comprar mais */}
          {protocols.length > 0 && (
            <div className="mt-6 text-center">
              <Link 
                href="/todos-protocolos"
                className="text-brand-green text-sm font-medium hover:underline"
              >
                Ver mais protocolos disponíveis
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