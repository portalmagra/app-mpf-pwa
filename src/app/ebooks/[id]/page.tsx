'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'
import { ebookService, Ebook } from '@/lib/supabase'

export default function EbookDetailPage() {
  const params = useParams()
  const [ebook, setEbook] = useState<Ebook | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedEbooks, setRelatedEbooks] = useState<Ebook[]>([])

  useEffect(() => {
    const loadEbook = async () => {
      try {
        const ebookId = parseInt(params.id as string)
        console.log('🔄 Carregando eBook:', ebookId)
        
        const [ebookData, allEbooks] = await Promise.all([
          ebookService.getEbookById(ebookId),
          ebookService.getActiveEbooks()
        ])
        
        if (ebookData) {
          setEbook(ebookData)
          
          // Buscar eBooks relacionados (mesma categoria, excluindo o atual)
          const related = allEbooks
            .filter(e => e.category === ebookData.category && e.id !== ebookData.id)
            .slice(0, 3)
          setRelatedEbooks(related)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('❌ Erro ao carregar eBook:', error)
        setLoading(false)
      }
    }

    if (params.id) {
      loadEbook()
    }
  }, [params.id])

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuito'
    return `$${price.toFixed(2)}`
  }

  const getCategoryEmoji = (category: string) => {
    return category === 'receitas' ? '🍽️' : '📚'
  }

  const getCategoryName = (category: string) => {
    return category === 'receitas' ? 'Receitas' : 'Dietas'
  }

  const handlePurchase = async () => {
    if (!ebook) return

    if (ebook.price === 0) {
      // eBook gratuito - redirecionar para PDF
      window.open(ebook.pdf_link, '_blank')
      return
    }

    // eBook pago - redirecionar para WhatsApp
    const message = `Olá! Gostaria de comprar o eBook "${ebook.title}" por $${ebook.price.toFixed(2)}.`
    const whatsappUrl = `https://wa.me/17862535032?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-brand-text">Carregando eBook...</p>
        </div>
      </div>
    )
  }

  if (!ebook) {
    return (
      <div className="min-h-screen bg-brand-cream">
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
        
        <main className="max-w-sm mx-auto px-4 py-6">
          <div className="text-center py-8">
            <span className="text-4xl block mb-4">📚</span>
            <h3 className="text-lg font-semibold text-brand-text mb-2">
              eBook não encontrado
            </h3>
            <p className="text-brand-textSoft text-sm mb-4">
              O eBook que você está procurando não existe ou foi removido.
            </p>
            <Link 
              href="/ebooks"
              className="inline-flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-greenDark transition-colors"
            >
              ← Voltar para eBooks
            </Link>
          </div>
        </main>
        
        <BottomNavigation currentPage="/ebooks" />
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
            <Link href={`/ebooks/${ebook.category}`}>
              <button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-greenDark transition-colors">
                {getCategoryEmoji(ebook.category)} {getCategoryName(ebook.category)}
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-sm mx-auto px-4 py-6">
        {/* Capa do eBook */}
        <div className="text-center mb-6">
          {ebook.cover_image_url ? (
            <img
              src={ebook.cover_image_url}
              alt={ebook.title}
              className="w-48 h-64 object-cover rounded-xl shadow-lg mx-auto mb-4"
            />
          ) : (
            <div className="w-48 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-6xl">{getCategoryEmoji(ebook.category)}</span>
            </div>
          )}
          
          {ebook.featured && (
            <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
              ⭐ eBook em Destaque
            </span>
          )}
        </div>

        {/* Informações do eBook */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h1 className="text-xl font-bold text-brand-text mb-2">
            {ebook.title}
          </h1>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm bg-brand-greenSoft text-brand-green px-2 py-1 rounded-full">
              {getCategoryEmoji(ebook.category)} {getCategoryName(ebook.category)}
            </span>
            <span className="text-sm text-brand-textSoft">
              por {ebook.author}
            </span>
          </div>

          <p className="text-brand-textSoft text-sm mb-4 leading-relaxed">
            {ebook.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-brand-textSoft">
              <span className="block">📄 {ebook.pages} páginas</span>
              <span className="block">🌐 {ebook.language}</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-brand-green">
                {formatPrice(ebook.price)}
              </span>
              {ebook.price > 0 && (
                <p className="text-xs text-brand-textSoft">
                  Acesso imediato
                </p>
              )}
            </div>
          </div>

          {/* Botão de ação */}
          <button
            onClick={handlePurchase}
            className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
              ebook.price === 0
                ? 'bg-brand-green hover:bg-brand-greenDark'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            }`}
          >
            {ebook.price === 0 ? '📖 Baixar Gratuitamente' : '💬 Comprar via WhatsApp'}
          </button>
        </div>

        {/* Preview do eBook */}
        {ebook.preview_images && ebook.preview_images.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-lg font-bold text-brand-text mb-4">
              📖 Preview do eBook
            </h2>
            <div className="space-y-3">
              {ebook.preview_images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full rounded-lg shadow-sm"
                />
              ))}
            </div>
          </div>
        )}

        {/* eBooks Relacionados */}
        {relatedEbooks.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-lg font-bold text-brand-text mb-4">
              📚 eBooks Relacionados
            </h2>
            <div className="space-y-3">
              {relatedEbooks.map((relatedEbook) => (
                <Link
                  key={relatedEbook.id}
                  href={`/ebooks/${relatedEbook.id}`}
                  className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {relatedEbook.cover_image_url ? (
                    <img
                      src={relatedEbook.cover_image_url}
                      alt={relatedEbook.title}
                      className="w-12 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{getCategoryEmoji(relatedEbook.category)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-brand-text text-sm leading-tight mb-1">
                      {relatedEbook.title}
                    </h3>
                    <p className="text-brand-textSoft text-xs mb-2 line-clamp-2">
                      {relatedEbook.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-brand-textSoft">
                        {relatedEbook.pages} páginas
                      </span>
                      <span className="font-bold text-brand-green text-sm">
                        {formatPrice(relatedEbook.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Links de navegação */}
        <div className="space-y-3">
          <Link 
            href={`/ebooks/${ebook.category}`}
            className="block w-full text-center bg-white text-brand-green border border-brand-green py-3 rounded-lg font-medium hover:bg-brand-greenSoft transition-colors"
          >
            ← Ver mais eBooks de {getCategoryName(ebook.category)}
          </Link>
          
          <Link 
            href="/ebooks"
            className="block w-full text-center bg-brand-greenSoft text-brand-green py-3 rounded-lg font-medium hover:bg-brand-greenSoftDark transition-colors"
          >
            📚 Ver todos os eBooks
          </Link>
        </div>

      </main>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/ebooks" />
    </div>
  )
}
