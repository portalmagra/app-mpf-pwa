'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'
import { ebookService, Ebook } from '@/lib/supabase'

export default function EbooksReceitasPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'todos' | 'gratuitos' | 'pagos'>('todos')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadEbooks = async () => {
      try {
        console.log('🔄 Carregando eBooks de Receitas...')
        const receitasEbooks = await ebookService.getEbooksByCategory('receitas')
        
        console.log('📦 eBooks de Receitas carregados:', receitasEbooks.length)
        setEbooks(receitasEbooks)
        setLoading(false)
      } catch (error) {
        console.error('❌ Erro ao carregar eBooks de Receitas:', error)
        setLoading(false)
      }
    }

    loadEbooks()
  }, [])

  // Filtrar eBooks
  const filteredEbooks = ebooks.filter(ebook => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ebook.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = activeFilter === 'todos' ||
                         (activeFilter === 'gratuitos' && ebook.price === 0) ||
                         (activeFilter === 'pagos' && ebook.price > 0)
    
    return matchesSearch && matchesFilter
  })

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuito'
    return `$${price.toFixed(2)}`
  }

  const getRecipeEmoji = (title: string) => {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('low carb')) return '🥑'
    if (titleLower.includes('detox')) return '🥤'
    if (titleLower.includes('smoothie')) return '🥤'
    if (titleLower.includes('sopa')) return '🍲'
    if (titleLower.includes('salada')) return '🥗'
    if (titleLower.includes('doce')) return '🍰'
    if (titleLower.includes('fit')) return '💪'
    return '🍽️'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-brand-text">Carregando eBooks de Receitas...</p>
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
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-text">
            🍽️ eBooks de Receitas
          </h1>
          <p className="text-brand-textSoft mt-2">
            Coleções completas de receitas saudáveis
          </p>
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar eBooks de receitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'todos'
                  ? 'bg-brand-green text-white'
                  : 'bg-white text-brand-text border border-brand-border'
              }`}
            >
              Todos ({ebooks.length})
            </button>
            <button
              onClick={() => setActiveFilter('gratuitos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'gratuitos'
                  ? 'bg-brand-green text-white'
                  : 'bg-white text-brand-text border border-brand-border'
              }`}
            >
              Gratuitos ({ebooks.filter(e => e.price === 0).length})
            </button>
            <button
              onClick={() => setActiveFilter('pagos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'pagos'
                  ? 'bg-brand-green text-white'
                  : 'bg-white text-brand-text border border-brand-border'
              }`}
            >
              Pagos ({ebooks.filter(e => e.price > 0).length})
            </button>
          </div>
        </div>

        {/* Lista de eBooks */}
        {filteredEbooks.length > 0 ? (
          <div className="space-y-4">
            {filteredEbooks.map((ebook) => (
              <Link
                key={ebook.id}
                href={`/ebooks/${ebook.id}`}
                className="block bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all border border-gray-200"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {ebook.cover_image_url ? (
                      <img
                        src={ebook.cover_image_url}
                        alt={ebook.title}
                        className="w-20 h-28 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-28 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <span className="text-3xl">{getRecipeEmoji(ebook.title)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-brand-text text-base leading-tight">
                        {ebook.title}
                      </h3>
                      {ebook.featured && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">
                          ⭐ Destaque
                        </span>
                      )}
                    </div>
                    <p className="text-brand-textSoft text-sm mb-3 line-clamp-3">
                      {ebook.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-brand-textSoft">
                        <span className="block">📄 {ebook.pages} páginas</span>
                        <span className="block">👤 {ebook.author}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-brand-green text-lg">
                          {formatPrice(ebook.price)}
                        </span>
                        {ebook.price > 0 && (
                          <p className="text-xs text-brand-textSoft">
                            Acesso imediato
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-4xl block mb-4">🍽️</span>
            <h3 className="text-lg font-semibold text-brand-text mb-2">
              Nenhum eBook encontrado
            </h3>
            <p className="text-brand-textSoft text-sm">
              {searchTerm || activeFilter !== 'todos' 
                ? 'Tente ajustar os filtros ou termo de busca' 
                : 'Em breve teremos novos eBooks de receitas disponíveis'
              }
            </p>
          </div>
        )}

        {/* Link para voltar */}
        <div className="mt-8 text-center">
          <Link 
            href="/ebooks"
            className="inline-flex items-center gap-2 text-brand-green hover:text-brand-greenDark font-medium"
          >
            ← Voltar para todos os eBooks
          </Link>
        </div>

      </main>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/ebooks" />
    </div>
  )
}
