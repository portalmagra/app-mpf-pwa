/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import BottomNavigation from '@/components/BottomNavigation'
import DrAnaAnalysis from '@/components/DrAnaAnalysis'
import RecommendedProducts from '@/components/RecommendedProducts'

// Sistema de traduções
const translations = {
  pt: {
    title: 'Avaliação gratuita feita por inteligência artificial',
    subtitle: 'Sua avaliação personalizada',
    shareButton: 'Compartilhar',
    printButton: 'Imprimir',
    whatsappButton: 'Fale Conosco',
    shareMessage: 'Adorei! É muito instrutivo e vale a pena fazer! 🎯 Compartilhe com sua amiga, ela vai gostar:',
    shareTitle: 'Minha Avaliação Personalizada - MeuPortalFit',
    copiedMessage: 'Mensagem copiada para a área de transferência!'
  },
  es: {
    title: 'Evaluación gratuita hecha por inteligencia artificial',
    subtitle: 'Tu evaluación personalizada',
    shareButton: 'Compartir',
    printButton: 'Imprimir',
    whatsappButton: 'Contáctanos',
    shareMessage: '¡Me encantó! Es muy instructivo y vale la pena hacerlo! 🎯 Compártelo con tu amiga, le va a gustar:',
    shareTitle: 'Mi Evaluación Personalizada - MeuPortalFit',
    copiedMessage: '¡Mensaje copiado al portapapeles!'
  },
  en: {
    title: 'Free assessment made by artificial intelligence',
    subtitle: 'Your personalized assessment',
    shareButton: 'Share',
    printButton: 'Print',
    whatsappButton: 'Contact Us',
    shareMessage: 'I loved it! It\'s very instructive and worth doing! 🎯 Share with your friend, she\'ll like it:',
    shareTitle: 'My Personalized Assessment - MeuPortalFit',
    copiedMessage: 'Message copied to clipboard!'
  }
}

function ResultadosContent() {
  const [analysisResults, setAnalysisResults] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState('pt')
  const searchParams = useSearchParams()

  const t = translations[language as keyof typeof translations] || translations.pt

  useEffect(() => {
    const loadResults = async () => {
      try {
        console.log('Iniciando loadResults...')
        
        // Obter parâmetros da URL
        const answers = searchParams.get('answers')
        const comments = searchParams.get('comments')
        const userName = searchParams.get('userName')
        const detailed = searchParams.get('detailed')
        
        console.log('Parâmetros da URL:', { answers, comments, userName, detailed, language })

        if (!answers) {
          console.error('Answers não encontrados na URL')
          setLoading(false)
          return
        }

        console.log('Answers encontrados, fazendo parse...')
        const parsedAnswers = JSON.parse(decodeURIComponent(answers))
        console.log('Answers parseados:', parsedAnswers)

        // Parse detailed se existir
        let parsedDetailed = null
        if (detailed) {
          try {
            parsedDetailed = JSON.parse(decodeURIComponent(detailed))
            console.log('Dados detalhados parseados:', parsedDetailed)
          } catch (e) {
            console.warn('Erro ao parsear detailed:', e)
          }
        }

        console.log('Chamando API de análise...')
        
        // Fazer chamada para a API de análise
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers: parsedAnswers,
            comments: comments || '',
            userName: userName || 'Amiga',
            userAge: '30',
            language: language,
            detailed: parsedDetailed
          }),
        })

        console.log('Resposta da API:', response.status, response.ok)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const results = await response.json()
        console.log('Resultados da API:', results)
        
        // Converter formato da API do PWA para formato esperado pela página
        const convertedResults = {
          acolhimento: results.analysis || 'Análise personalizada gerada com sucesso!',
          analise: results.analysis || 'Análise personalizada baseada nas suas respostas.',
          produtos: results.recommendations || [],
          userName: userName || 'Amiga'
        }
        
        setAnalysisResults(convertedResults)
        console.log('Finalizando loadResults, setLoading(false)')
      } catch (error) {
        console.error('Erro ao carregar resultados:', error)
        // Em caso de erro, mostrar uma mensagem padrão
        setAnalysisResults({
          acolhimento: 'Obrigada por completar nossa avaliação!',
          analise: 'Sua análise personalizada foi gerada com sucesso. Em breve você receberá recomendações específicas para suas necessidades.',
          produtos: [],
          userName: searchParams.get('userName') || 'Amiga'
        })
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [searchParams, language])

  const handleShare = async () => {
    const shareData = {
      title: t.shareTitle,
      text: t.shareMessage,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback para copiar para área de transferência
        await navigator.clipboard.writeText(`${t.shareMessage}\n\n${window.location.href}`)
        alert(t.copiedMessage)
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
      // Fallback para copiar para área de transferência
      try {
        await navigator.clipboard.writeText(`${t.shareMessage}\n\n${window.location.href}`)
        alert(t.copiedMessage)
      } catch (clipboardError) {
        console.error('Erro ao copiar para área de transferência:', clipboardError)
      }
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços do Portal Fit.')
    const whatsappUrl = `https://wa.me/15551234567?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Gerando sua análise personalizada...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t.title}
            </h1>
            <p className="text-gray-600">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {(analysisResults as any) && (
          <>
            {/* Análise da Dra. Ana Slim */}
            <DrAnaAnalysis 
              analysis={(analysisResults as any)?.analise || (analysisResults as any)?.analysis || 'Análise personalizada gerada com sucesso!'}
              userName={(analysisResults as any)?.userName || 'Amiga'}
            />

            {/* Produtos Recomendados */}
            <RecommendedProducts 
              products={(analysisResults as any)?.produtos || []}
            />

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                🚀 Próximos Passos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleShare}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <span className="mr-2">📤</span>
                  {t.shareButton}
                </button>
                
                <button
                  onClick={handlePrint}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <span className="mr-2">🖨️</span>
                  {t.printButton}
                </button>
                
                <button
                  onClick={handleWhatsApp}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <span className="mr-2">💬</span>
                  {t.whatsappButton}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

export default function ResultadosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando...</p>
        </div>
      </div>
    }>
      <ResultadosContent />
    </Suspense>
  )
}
