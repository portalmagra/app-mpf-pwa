'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Download, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

interface ProtocolData {
  id: string
  name: string
  pdfUrl: string
  fileName: string
  size: string
}

export default function ProtocolDownloadPage() {
  const searchParams = useSearchParams()
  const [protocolData, setProtocolData] = useState<ProtocolData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const protocolId = searchParams.get('protocol')
    const sessionId = searchParams.get('session')
    
    if (!protocolId || !sessionId) {
      setError('Parâmetros de acesso não encontrados')
      setLoading(false)
      return
    }

    // Verificar acesso e obter dados do protocolo
    verifyAccess(protocolId, sessionId)
  }, [searchParams])

  const verifyAccess = async (protocolId: string, sessionId: string) => {
    try {
      const response = await fetch(`/api/protocols/verify-access?protocol=${protocolId}&session=${sessionId}`)
      
      if (!response.ok) {
        throw new Error('Acesso negado ou sessão inválida')
      }

      const data = await response.json()
      setProtocolData(data)
    } catch (error) {
      console.error('Erro ao verificar acesso:', error)
      setError('Não foi possível verificar seu acesso. Verifique se você completou o pagamento.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!protocolData) return

    setDownloading(true)
    try {
      const protocolId = searchParams.get('protocol')
      const sessionId = searchParams.get('session')
      
      // Criar link de download temporário
      const response = await fetch(`/api/protocols/download?protocol=${protocolId}&session=${sessionId}`)
      
      if (!response.ok) {
        throw new Error('Erro ao gerar link de download')
      }

      const blob = await response.blob()
      
      // Criar URL temporária para download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = protocolData.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Erro no download:', error)
      alert('Erro ao baixar o arquivo. Tente novamente.')
    } finally {
      setDownloading(false)
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
          <p className="text-brand-text">Verificando seu acesso...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-500 text-4xl mb-4">
              <AlertCircle className="w-12 h-12 mx-auto" />
            </div>
            <h1 className="text-xl font-bold text-red-800 mb-2">Acesso Negado</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-3">
              <Link 
                href="/todos-protocolos"
                className="block w-full bg-brand-green text-white py-3 px-4 rounded-lg font-semibold hover:bg-brand-greenDark transition-colors"
              >
                Ver Protocolos Disponíveis
              </Link>
              <Link 
                href="/success"
                className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Voltar ao Status da Compra
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!protocolData) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-yellow-800 mb-2">Protocolo não encontrado</h1>
            <p className="text-yellow-600 mb-4">Não foi possível encontrar os dados do protocolo.</p>
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
            <Link href="/success" className="text-brand-green text-sm font-medium flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar
            </Link>
            <h1 className="text-lg font-bold text-brand-text">📄 Download</h1>
            <Link href="/" className="text-brand-green text-sm font-medium">
              🏠 Início
            </Link>
          </div>
        </div>
      </header>

      {/* Download Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-brand-green" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text mb-2">
              {protocolData.name}
            </h2>
            <p className="text-brand-text2">
              Seu protocolo está pronto para download
            </p>
          </div>

          {/* Protocol Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-brand-text mb-3">Informações do Arquivo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-text2">Nome:</span>
                <span className="font-medium text-brand-text">
                  {protocolData.fileName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text2">Tamanho:</span>
                <span className="font-medium text-brand-text">
                  {protocolData.size}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text2">Formato:</span>
                <span className="font-medium text-brand-text">
                  PDF
                </span>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full bg-brand-green text-white py-4 px-6 rounded-lg font-semibold hover:bg-brand-greenDark transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Preparando Download...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Baixar Protocolo
              </>
            )}
          </button>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">Instruções Importantes</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                Salve o arquivo em um local seguro no seu dispositivo
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                Leia atentamente todas as instruções antes de começar
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                Consulte um profissional de saúde se tiver dúvidas
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                Mantenha o arquivo para referência futura
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Precisa de Ajuda?</h3>
            <p className="text-sm text-green-700 mb-3">
              Nossa equipe está aqui para ajudar você a obter os melhores resultados.
            </p>
            <a 
              href="mailto:suporte@meuportalfit.com"
              className="text-brand-green font-medium text-sm hover:underline"
            >
              Entre em contato conosco
            </a>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/todos-protocolos"
              className="w-full bg-white border border-brand-green text-brand-green py-3 px-4 rounded-lg font-semibold hover:bg-brand-green/5 transition-colors flex items-center justify-center"
            >
              Ver Outros Protocolos
            </Link>
            
            <Link
              href="/"
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
