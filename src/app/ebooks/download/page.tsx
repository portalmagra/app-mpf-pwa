'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'
import { Download, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

interface EbookData {
  id: number
  title: string
  description: string
  category: string
  price: number
  pdf_link: string
  cover_image_url: string
  author: string
  pages: number
  language: string
  fileName: string
  size: string
}

function EbookDownloadContent() {
  const searchParams = useSearchParams()
  const [ebookData, setEbookData] = useState<EbookData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const ebookId = searchParams.get('ebook')
    const sessionId = searchParams.get('session')
    
    if (!ebookId || !sessionId) {
      setError('Parâmetros de acesso não encontrados')
      setLoading(false)
      return
    }

    // Verificar acesso e obter dados do eBook
    verifyAccess(ebookId, sessionId)
  }, [searchParams])

  const verifyAccess = async (ebookId: string, sessionId: string) => {
    try {
      const response = await fetch(`/api/ebooks/verify-access?ebook=${ebookId}&session=${sessionId}`)
      
      if (!response.ok) {
        throw new Error('Acesso negado ou sessão inválida')
      }

      const data = await response.json()
      setEbookData(data)
    } catch (error) {
      console.error('Erro ao verificar acesso:', error)
      setError('Não foi possível verificar seu acesso. Verifique se você completou o pagamento.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!ebookData) return

    setDownloading(true)
    try {
      // Redirecionar para o link do PDF
      window.open(ebookData.pdf_link, '_blank')
    } catch (error) {
      console.error('Erro ao fazer download:', error)
      alert('Erro ao fazer download. Tente novamente.')
    } finally {
      setDownloading(false)
    }
  }

  const getCategoryEmoji = (category: string) => {
    return category === 'receitas' ? '🍽️' : '📚'
  }

  const getCategoryName = (category: string) => {
    return category === 'receitas' ? 'Receitas' : 'Dietas'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-brand-text">Verificando acesso...</p>
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
                href="/ebooks"
                className="block w-full bg-brand-green text-white py-3 px-4 rounded-lg font-semibold hover:bg-brand-greenDark transition-colors"
              >
                Ver eBooks Disponíveis
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

  if (!ebookData) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-text">Carregando dados do eBook...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
            <Link href="/ebooks">
              <button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-greenDark transition-colors">
                📚 eBooks
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-sm mx-auto px-4 py-6">
        {/* Status de Sucesso */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
          <div className="text-green-500 text-4xl mb-4">
            <CheckCircle className="w-12 h-12 mx-auto" />
          </div>
          <h1 className="text-xl font-bold text-green-800 mb-2">
            Compra Confirmada!
          </h1>
          <p className="text-green-600 text-sm">
            Seu eBook está pronto para download
          </p>
        </div>

        {/* Informações do eBook */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="text-center mb-4">
            {ebookData.cover_image_url ? (
              <img
                src={ebookData.cover_image_url}
                alt={ebookData.title}
                className="w-32 h-40 object-cover rounded-lg shadow-md mx-auto mb-4"
              />
            ) : (
              <div className="w-32 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">{getCategoryEmoji(ebookData.category)}</span>
              </div>
            )}
          </div>

          <h2 className="text-lg font-bold text-brand-text mb-2 text-center">
            {ebookData.title}
          </h2>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm bg-brand-greenSoft text-brand-green px-2 py-1 rounded-full">
              {getCategoryEmoji(ebookData.category)} {getCategoryName(ebookData.category)}
            </span>
            <span className="text-sm text-brand-textSoft">
              por {ebookData.author}
            </span>
          </div>

          <p className="text-brand-textSoft text-sm mb-4 text-center leading-relaxed">
            {ebookData.description}
          </p>

          <div className="flex items-center justify-center gap-4 mb-6 text-sm text-brand-textSoft">
            <span>📄 {ebookData.pages} páginas</span>
            <span>🌐 {ebookData.language}</span>
          </div>

          {/* Botão de Download */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full bg-brand-green text-white py-3 px-4 rounded-lg font-bold hover:bg-brand-greenDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Preparando Download...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Baixar eBook
              </>
            )}
          </button>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-brand-text mb-4">
            📋 Informações do Arquivo
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-textSoft">Nome do arquivo:</span>
              <span className="text-brand-text font-medium">{ebookData.fileName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-textSoft">Tamanho:</span>
              <span className="text-brand-text font-medium">{ebookData.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-textSoft">Formato:</span>
              <span className="text-brand-text font-medium">PDF</span>
            </div>
          </div>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3">
            💡 Como usar seu eBook
          </h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">1.</span>
              <span>Clique no botão "Baixar eBook" acima</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">2.</span>
              <span>O arquivo PDF será baixado para seu dispositivo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">3.</span>
              <span>Abra o arquivo com qualquer leitor de PDF</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">4.</span>
              <span>Desfrute do seu novo eBook!</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={`/ebooks/${ebookData.category}`}
            className="w-full bg-white border border-brand-green text-brand-green py-3 px-4 rounded-lg font-semibold hover:bg-brand-green/5 transition-colors flex items-center justify-center"
          >
            Ver Outros eBooks de {getCategoryName(ebookData.category)}
          </Link>
          
          <Link
            href="/ebooks"
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos eBooks
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/ebooks" />
    </div>
  )
}

export default function EbookDownloadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-brand-text">Carregando...</p>
        </div>
      </div>
    }>
      <EbookDownloadContent />
    </Suspense>
  )
}
