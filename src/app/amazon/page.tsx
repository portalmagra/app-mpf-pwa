'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'

interface CuratedProduct {
  name: string
  asin: string
  price: string
  rating: number
  imageUrl: string
  detailPageURL: string
  category?: string
  benefits?: string[]
}

export default function AmazonPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchMessage, setSearchMessage] = useState('')
  const [curatedProducts, setCuratedProducts] = useState<CuratedProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCuratedProducts, setShowCuratedProducts] = useState(false)

  // Função para garantir tag de afiliado em URLs da Amazon
  const ensureAffiliateTag = (url: string): string => {
    if (!url) return url
    
    // Tag de afiliado
    const affiliateTag = 'portalsolutio-20'
    
    try {
      const urlObj = new URL(url)
      
      // Se já tem tag, substitui pela nossa
      if (urlObj.searchParams.has('tag')) {
        urlObj.searchParams.set('tag', affiliateTag)
      } else {
        // Adiciona nossa tag
        urlObj.searchParams.set('tag', affiliateTag)
      }
      
      return urlObj.toString()
    } catch (error) {
      // Se der erro na URL, tenta adicionar de forma simples
      if (url.includes('tag=')) {
        return url.replace(/tag=[^&]*/, `tag=${affiliateTag}`)
      } else {
        const separator = url.includes('?') ? '&' : '?'
        return `${url}${separator}tag=${affiliateTag}`
      }
    }
  }

  // Função para buscar produto específico na Amazon
  const searchSpecificProduct = async (asin: string) => {
    try {
      const response = await fetch('/api/search-real-amazon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: asin,
          maxResults: 1,
          specificProduct: true 
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.products.length > 0) {
        const product = data.products[0]
        const urlWithTag = ensureAffiliateTag(product.detailPageURL)
        window.open(urlWithTag, '_blank')
      } else {
        // Fallback: usar URL genérica com tag
        const fallbackUrl = `https://www.amazon.com/dp/${asin}?tag=portalsolutio-20`
        window.open(fallbackUrl, '_blank')
      }
    } catch (error) {
      console.error('Erro ao buscar produto específico:', error)
      // Fallback: usar URL genérica com tag
      const fallbackUrl = `https://www.amazon.com/dp/${asin}?tag=portalsolutio-20`
      window.open(fallbackUrl, '_blank')
    }
  }

  // Interceptar cliques em links da Amazon para garantir tag
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.href.includes('amazon.com')) {
        e.preventDefault()
        
        // Se é um link de produto específico (contém /dp/), buscar produto completo
        if (link.href.includes('/dp/')) {
          const asin = link.href.match(/\/dp\/([A-Z0-9]+)/)?.[1]
          if (asin) {
            searchSpecificProduct(asin)
            return
          }
        }
        
        // Para outros links, usar método normal
        const urlWithTag = ensureAffiliateTag(link.href)
        window.open(urlWithTag, '_blank')
      }
    }

    document.addEventListener('click', handleClick)
    
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  // Função para redirecionar diretamente para Amazon
  const searchWithCuration = async (query: string) => {
    if (!query || query.trim().length < 2) {
      return;
    }
    
    setIsLoading(true)
    setSearchMessage(`🔍 Redirecionando para Amazon...`)
    
    try {
      // Construir URL da Amazon com termo de busca e nossa tag de afiliado
      const searchQuery = encodeURIComponent(query.trim())
      const amazonSearchUrl = `https://www.amazon.com/s?k=${searchQuery}&tag=portalsolutio-20`
      
      // Redirecionar diretamente para Amazon
      window.open(amazonSearchUrl, '_blank')
      
      setSearchMessage(`✅ Redirecionado para Amazon com "${query}"`)
      
      // Limpar produtos e mostrar mensagem de sucesso
      setCuratedProducts([])
      setShowCuratedProducts(false)
      
    } catch (error) {
      console.error('Erro no redirecionamento:', error)
      setSearchMessage(`❌ Erro ao redirecionar. Tente novamente.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Não carregar produtos iniciais - página começa limpa

  // Buscar produtos quando o usuário pressionar Enter
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchWithCuration(searchTerm);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-brand-greenSoft border-b border-brand-border px-4 py-3">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
            <div>
              <h1 className="text-lg font-bold text-brand-text">MeuPortalFit</h1>
              <p className="text-xs text-brand-textLight">Brasileiros nos EUA</p>
            </div>
          </Link>
          <Link href="/" className="text-brand-textLight text-sm">
            ← Voltar ao App
          </Link>
        </div>
      </header>

      <main className="pb-20">
            {/* Hero Section Simplificado */}
        <section className="px-4 py-8">
          <div className="max-w-sm mx-auto text-center">
            {/* Amazon Logo Header */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <img 
                  src="/icons/amazon-logo-official.png" 
                  alt="Amazon" 
                  width="48" 
                  height="48"
                  className="object-contain"
                />
                <h2 className="text-2xl font-bold text-green-800">Busca Amazon</h2>
              </div>
              <p className="text-green-600 text-sm">Digite o produto e seja redirecionado para Amazon</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Digite o que você procura..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
              <button
                onClick={() => searchWithCuration(searchTerm)}
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-green text-white p-2 rounded-lg hover:bg-brand-greenDark transition-colors disabled:opacity-50"
              >
                {isLoading ? '⏳' : '🔍'}
              </button>
            </div>

            {/* Por Que Comprar Através do MeuPortalFit - Só mostra se não há produtos */}
            {curatedProducts.length === 0 && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 text-green-800 p-6 rounded-xl mb-6">
              <h2 className="text-xl font-bold mb-3 text-green-900">
                🛒 Por Que Comprar na Amazon Através do MeuPortalFit?
              </h2>
              <p className="text-green-700 mb-4">
                Digite qualquer produto e seja redirecionado diretamente para Amazon - <strong>100% gratuito</strong> para você!
              </p>
              
              {/* Benefícios */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <h3 className="font-semibold text-green-900">Redirecionamento Direto</h3>
                    <p className="text-sm text-green-700">
                      Digite qualquer produto e seja redirecionado diretamente para a página de busca da Amazon
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <h3 className="font-semibold text-green-900">Sem Custo Adicional</h3>
                    <p className="text-sm text-green-700">
                      Você paga o mesmo preço da Amazon. Nossa comissão vem da Amazon, não do seu bolso!
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🇧🇷</span>
                  <div>
                    <h3 className="font-semibold text-green-900">Feito para Brasileiros</h3>
                    <p className="text-sm text-green-700">
                      Interface em português e suporte para brasileiros nos EUA
                    </p>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Call-to-Action - Só mostra se não há produtos */}
            {curatedProducts.length === 0 && (
            <div className="bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-300 text-green-800 p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-2 text-green-900">
                🚀 Pronto para Ir para Amazon?
              </h3>
              <p className="text-green-700 mb-4">
                Digite o que você procura e seja redirecionado diretamente para Amazon!
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchMessage('');
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                🔍 Nova Busca
              </button>
            </div>
            )}


            {/* Mensagem de busca */}
            {searchMessage && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  {searchMessage}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/amazon" />
    </div>
  )
}
