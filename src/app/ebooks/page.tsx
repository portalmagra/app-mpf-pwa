'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'
import { ebookService, Ebook } from '@/lib/supabase'

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [featuredEbooks, setFeaturedEbooks] = useState<Ebook[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadEbooks = async () => {
      try {
        console.log('🔄 Carregando eBooks...')
        const [allEbooks, featured] = await Promise.all([
          ebookService.getActiveEbooks(),
          ebookService.getFeaturedEbooks()
        ])
        
        console.log('📦 eBooks carregados:', allEbooks.length)
        setEbooks(allEbooks)
        setFeaturedEbooks(featured)
        setLoading(false)
      } catch (error) {
        console.error('❌ Erro ao carregar eBooks:', error)
        setLoading(false)
      }
    }

    loadEbooks()
  }, [])

  // Filtrar eBooks por termo de busca
  const filteredEbooks = ebooks.filter(ebook =>
    ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ebook.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Separar eBooks por categoria
  const recipeEbooks = filteredEbooks.filter(ebook => ebook.category === 'receitas')
  const dietEbooks = filteredEbooks.filter(ebook => ebook.category === 'dietas')

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuito'
    return `$${price.toFixed(2)}`
  }

  const getCategoryEmoji = (category: string) => {
    return category === 'receitas' ? '🍽️' : '📚'
  }

  const getCategoryColor = (category: string) => {
    return category === 'receitas' 
      ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300' 
      : 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-brand-text">Carregando eBooks...</p>
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
            <Link href="/receitas">
              <button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-greenDark transition-colors">
                🍽️ Receitas
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
            📚 eBooks
          </h1>
          <p className="text-brand-textSoft mt-2">
            Coleções completas de receitas e guias de dietas
          </p>
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar eBooks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        {/* eBooks em Destaque */}
        {featuredEbooks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-brand-text mb-4">⭐ Em Destaque</h2>
            <div className="space-y-4">
              {featuredEbooks.map((ebook) => (
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
                          className="w-16 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">{getCategoryEmoji(ebook.category)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-brand-text text-sm leading-tight">
                          {ebook.title}
                        </h3>
                        <span className="text-xs bg-brand-green text-white px-2 py-1 rounded-full ml-2">
                          ⭐ Destaque
                        </span>
                      </div>
                      <p className="text-brand-textSoft text-xs mb-2 line-clamp-2">
                        {ebook.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-brand-textSoft">
                          {ebook.pages} páginas • {ebook.author}
                        </span>
                        <span className="font-bold text-brand-green">
                          {formatPrice(ebook.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categorias de eBooks */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-brand-text mb-4">Escolha a categoria:</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/ebooks/receitas" 
              className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-orange-300 transform hover:scale-105"
            >
              <div className="text-center">
                <span className="text-3xl block mb-2">🍽️</span>
                <h3 className="font-bold text-sm">Receitas</h3>
                <p className="text-xs text-brand-textSoft mt-1">
                  {recipeEbooks.length} eBooks
                </p>
              </div>
            </Link>
            
            <Link 
              href="/ebooks/dietas" 
              className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-blue-300 transform hover:scale-105"
            >
              <div className="text-center">
                <span className="text-3xl block mb-2">📚</span>
                <h3 className="font-bold text-sm">Dietas</h3>
                <p className="text-xs text-brand-textSoft mt-1">
                  {dietEbooks.length} eBooks
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Todos os eBooks */}
        {filteredEbooks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-brand-text mb-4">
              Todos os eBooks ({filteredEbooks.length})
            </h2>
            <div className="space-y-3">
              {filteredEbooks.map((ebook) => (
                <Link
                  key={ebook.id}
                  href={`/ebooks/${ebook.id}`}
                  className="block bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all border border-gray-200"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      {ebook.cover_image_url ? (
                        <img
                          src={ebook.cover_image_url}
                          alt={ebook.title}
                          className="w-12 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-lg">{getCategoryEmoji(ebook.category)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-brand-text text-sm leading-tight">
                          {ebook.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ml-2 ${getCategoryColor(ebook.category)}`}>
                          {ebook.category === 'receitas' ? '🍽️' : '📚'}
                        </span>
                      </div>
                      <p className="text-brand-textSoft text-xs mb-2 line-clamp-2">
                        {ebook.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-brand-textSoft">
                          {ebook.pages} páginas
                        </span>
                        <span className="font-bold text-brand-green">
                          {formatPrice(ebook.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem quando não há eBooks */}
        {filteredEbooks.length === 0 && !loading && (
          <div className="text-center py-8">
            <span className="text-4xl block mb-4">📚</span>
            <h3 className="text-lg font-semibold text-brand-text mb-2">
              Nenhum eBook encontrado
            </h3>
            <p className="text-brand-textSoft text-sm">
              {searchTerm ? 'Tente buscar por outros termos' : 'Em breve teremos novos eBooks disponíveis'}
            </p>
          </div>
        )}

      </main>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/ebooks" />
    </div>
  )
}
