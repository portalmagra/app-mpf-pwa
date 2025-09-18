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

  // Função para buscar produtos com curadoria inteligente
  const searchWithCuration = async (query: string) => {
    if (!query || query.trim().length < 2) {
      return;
    }
    
    setIsLoading(true)
    setSearchMessage(`🤖 Nossa IA está selecionando os melhores produtos "${query}" para você...`)
    
    try {
      // Buscar produtos através da API route
      const response = await fetch('/api/search-real-amazon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          maxResults: 3
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.products && data.products.length > 0) {
        setCuratedProducts(data.products)
        setShowCuratedProducts(true)
        setSearchMessage(`✅ Encontramos ${data.products.length} produtos selecionados especialmente para você!`)
      } else {
        // Fallback para busca direta na Amazon
        const amazonSearchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query.trim())}&tag=portalsolutio-20`
        window.open(amazonSearchUrl, '_blank')
        setSearchMessage(`🔍 Redirecionando para Amazon com "${query}"...`)
      }
    } catch (error) {
      console.error('Erro na busca:', error)
      // Fallback para busca direta
      const amazonSearchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query.trim())}&tag=portalsolutio-20`
      window.open(amazonSearchUrl, '_blank')
      setSearchMessage(`🔍 Redirecionando para Amazon com "${query}"...`)
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
              <h1 className="text-lg font-bold text-brand-text">Portal Fit</h1>
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
              <p className="text-green-600 text-sm">Seleção Amazon por Inteligência Artificial conforme sua necessidade</p>
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
                🛒 Por Que Comprar na Amazon Através do Portal Fit?
              </h2>
              <p className="text-green-700 mb-4">
                Nossa seleção por Inteligência Artificial é <strong>100% gratuita</strong> para você!
              </p>
              
              {/* Benefícios */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h3 className="font-semibold text-green-900">Seleção por IA</h3>
                    <p className="text-sm text-green-700">
                      Nossa Inteligência Artificial seleciona apenas produtos de qualidade comprovada, testados por brasileiros nos EUA
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
                      Produtos que funcionam no clima americano e atendem necessidades específicas de brasileiros
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
                🚀 Pronto para Encontrar os Melhores Produtos?
              </h3>
              <p className="text-green-700 mb-4">
                Digite o que você procura e deixe nossa IA selecionar os melhores produtos para você!
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchMessage('');
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                🔍 Fazer Nova Busca
              </button>
            </div>
            )}

            {/* Produtos Selecionados pela IA */}
            {curatedProducts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-green-900 mb-4 text-center">
                  🤖 Produtos Selecionados pela Nossa IA
                </h3>
                <div className="space-y-4">
                  {curatedProducts.map((product, index) => (
                    <div key={product.asin} className="bg-white border-2 border-green-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={product.imageUrl || '/icons/amazon-logo-official.png'} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-900 text-sm mb-1">
                            {product.name}
                          </h4>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-yellow-500">⭐ {product.rating}</span>
                            <span className="text-green-600 font-bold">{product.price}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.benefits?.slice(0, 2).map((benefit, i) => (
                              <span key={i} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                {benefit}
                              </span>
                            ))}
                          </div>
                          <a
                            href={product.detailPageURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                          >
                            <span>🛒</span>
                            <span>Comprar na Amazon</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-green-700 text-sm">
                    ✨ Estes produtos foram selecionados pela nossa IA baseado em qualidade, marca e preço
                  </p>
                </div>
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
