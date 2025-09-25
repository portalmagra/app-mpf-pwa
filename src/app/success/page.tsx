'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, ArrowRight } from 'lucide-react'

interface PurchaseData {
  sessionId: string
  protocolId: string
  protocolName: string
  customerEmail: string
  amount: number
  status: string
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      setError('ID da sessão não encontrado')
      setLoading(false)
      return
    }

    // Verificar dados da compra
    verifyPurchase(sessionId)
  }, [searchParams])

  const verifyPurchase = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`)
      
      if (!response.ok) {
        throw new Error('Erro ao verificar compra')
      }

      const data = await response.json()
      setPurchaseData(data)
      
      // Enviar e-mail de confirmação
      try {
        await fetch('/api/send-confirmation-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            protocolId: data.protocolId,
            protocolName: data.protocolName,
            customerEmail: data.customerEmail
          })
        })
        console.log('📧 E-mail de confirmação enviado!')
      } catch (emailError) {
        console.error('❌ Erro ao enviar e-mail:', emailError)
      }
      
      // Solicitar permissão para notificações
      requestNotificationPermission()
      
      // Iniciar download automático após 3 segundos
      setTimeout(() => {
        handleDownload(data.protocolId, sessionId)
      }, 3000)
      
    } catch (error) {
      console.error('Erro ao verificar compra:', error)
      setError('Erro ao verificar sua compra. Entre em contato conosco.')
    } finally {
      setLoading(false)
    }
  }

  const requestNotificationPermission = async () => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          console.log('🔔 Permissão para notificações concedida!')
          
          // Mostrar notificação de boas-vindas
          new Notification('🎉 Pagamento Aprovado!', {
            body: 'Seu protocolo está sendo baixado automaticamente!',
            icon: '/icons/logo-final-completo-192x192.png'
          })
        }
      }
    } catch (error) {
      console.error('❌ Erro ao solicitar permissão:', error)
    }
  }

  const handleDownload = async (protocolId: string, sessionId: string) => {
    try {
      console.log('🔄 Iniciando download automático...')
      const downloadUrl = `/api/protocols/download?protocol=${protocolId}&session=${sessionId}`
      
      // Criar link temporário para download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${protocolId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('✅ Download iniciado automaticamente!')
    } catch (error) {
      console.error('❌ Erro no download automático:', error)
    }
  }

  const getProtocolName = (protocolId: string) => {
    const protocolNames: { [key: string]: string } = {
      'suporte-canetas-emagrecedoras': 'Protocolo Suporte com Canetas Emagrecedoras',
      'pre-caneta': 'Protocolo Pré-Caneta',
      'pos-caneta-manutencao': 'Protocolo Pós-Caneta Manutenção',
      'proteina-massa-magra': 'Protocolo Proteína e Massa Magra',
      'intestino-livre': 'Protocolo Intestino Livre',
      'nausea-refluxo': 'Protocolo Náusea e Refluxo',
      'energia-imunidade': 'Protocolo Energia e Imunidade',
      'imunidade-avancada': 'Protocolo Imunidade Avançada',
      'detox-leve': 'Protocolo Detox Leve',
      'anti-inflamatorio': 'Protocolo Anti-inflamatório',
      'mulheres-40': 'Protocolo Mulheres 40+',
      'pele-cabelo-unhas': 'Protocolo Pele, Cabelo e Unhas',
      'sono-ansiedade': 'Protocolo Sono e Ansiedade',
      'fitness-performance': 'Protocolo Fitness e Performance',
      'alternativa-sem-caneta': 'Protocolo Alternativa Sem Caneta',
      'pacote-completo': 'Pacote Completo - Todos os Protocolos'
    }
    return protocolNames[protocolId] || protocolId
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-brand-text">Verificando sua compra...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <h1 className="text-xl font-bold text-red-800 mb-2">Erro na Verificação</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <Link 
              href="/todos-protocolos"
              className="inline-flex items-center px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-greenDark transition-colors"
            >
              Voltar aos Protocolos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!purchaseData) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-yellow-800 mb-2">Compra não encontrada</h1>
            <p className="text-yellow-600 mb-4">Não foi possível encontrar os dados da sua compra.</p>
            <Link 
              href="/todos-protocolos"
              className="inline-flex items-center px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-greenDark transition-colors"
            >
              Voltar aos Protocolos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold text-brand-text">✅ Compra Confirmada</h1>
            <Link href="/" className="text-brand-green text-sm font-medium">
              🏠 Início
            </Link>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text mb-2">
              Pagamento Aprovado!
            </h2>
            <p className="text-brand-text2">
              Sua compra foi processada com sucesso
            </p>
          </div>

          {/* Purchase Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-brand-text mb-3">Detalhes da Compra</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-text2">Produto:</span>
                <span className="font-medium text-brand-text">
                  {getProtocolName(purchaseData.protocolId)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text2">Valor:</span>
                <span className="font-medium text-brand-text">
                  ${purchaseData.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text2">Email:</span>
                <span className="font-medium text-brand-text">
                  {purchaseData.customerEmail}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text2">Status:</span>
                <span className="font-medium text-green-600">
                  {purchaseData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Download Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <Download className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-green-800">Download Automático</h3>
            </div>
            <p className="text-green-700 text-sm mb-3">
              Seu protocolo está sendo baixado automaticamente em alguns segundos...
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-600">📧 E-mail de confirmação enviado</span>
              <span className="text-xs text-green-600">🔔 Notificações ativadas</span>
            </div>
          </div>

          {/* App Download Suggestion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">📱</span>
              <h3 className="font-semibold text-blue-800">Baixe Nosso App!</h3>
            </div>
            <p className="text-blue-700 text-sm mb-3">
              Para uma experiência ainda melhor, baixe nosso app e receba notificações sobre novos protocolos!
            </p>
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                📲 Baixar App
              </button>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'MeuPortalFit - Protocolos Nutricionais',
                      text: 'Confira os melhores protocolos nutricionais para brasileiras nos EUA!',
                      url: window.location.origin
                    })
                  } else {
                    // Fallback para copiar link
                    navigator.clipboard.writeText(window.location.origin)
                    alert('Link copiado para a área de transferência!')
                  }
                }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                🔗 Compartilhar
              </button>
            </div>
          </div>

          {/* Bookmark Suggestion */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">⭐</span>
              <h3 className="font-semibold text-yellow-800">Salve Esta Página</h3>
            </div>
            <p className="text-yellow-700 text-sm mb-3">
              Adicione aos favoritos para acessar facilmente seus protocolos!
            </p>
            <button 
              onClick={() => {
                // Tentar adicionar aos favoritos
                if (window.sidebar && window.sidebar.addPanel) {
                  window.sidebar.addPanel(document.title, window.location.href, '')
                } else {
                  alert('Use Ctrl+D (Windows) ou Cmd+D (Mac) para adicionar aos favoritos!')
                }
              }}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
            >
              ⭐ Adicionar aos Favoritos
            </button>
          </div>

          {/* Download Section */}
          <div className="bg-brand-green/10 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-brand-text mb-3 flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Acesso aos Protocolos
            </h3>
            <p className="text-brand-text2 text-sm mb-4">
              Agora você tem acesso completo ao protocolo que comprou. 
              Clique no botão abaixo para baixar o PDF.
            </p>
            <Link
              href={`/protocolos/download?protocol=${purchaseData.protocolId}&session=${purchaseData.sessionId}`}
              className="w-full bg-brand-green text-white py-3 px-4 rounded-lg font-semibold hover:bg-brand-greenDark transition-colors flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Baixar Protocolo
            </Link>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">Próximos Passos</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">1.</span>
                Baixe o protocolo PDF usando o botão acima
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">2.</span>
                Leia atentamente todas as instruções
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">3.</span>
                Siga as recomendações nutricionais
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">4.</span>
                Entre em contato se tiver dúvidas
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/todos-protocolos"
              className="w-full bg-white border border-brand-green text-brand-green py-3 px-4 rounded-lg font-semibold hover:bg-brand-green/5 transition-colors flex items-center justify-center"
            >
              Ver Outros Protocolos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link
              href="/"
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="text-center">
          <p className="text-brand-text2 text-sm mb-2">
            Precisa de ajuda?
          </p>
          <a 
            href="mailto:suporte@meuportalfit.com"
            className="text-brand-green font-medium text-sm hover:underline"
          >
            Entre em contato conosco
          </a>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-brand-text">Carregando...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}