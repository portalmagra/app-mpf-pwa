'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useSavedRecipes } from '@/hooks/useSavedItems'

interface ReceitaSalva {
  id: number
  nome: string
  descricao: string
  categoria: string
  link_pdf: string
  data_salvamento: string
  emoji: string
}

// Função para gerar emoji baseado no nome da receita
const getRecipeEmoji = (nome: string, categoria: string): string => {
  const nomeLower = nome.toLowerCase()
  const categoriaLower = categoria.toLowerCase()
  
  if (categoriaLower.includes('shot')) return '💉'
  if (categoriaLower.includes('suco') || categoriaLower.includes('detox')) return '🥤'
  if (categoriaLower.includes('salada')) return '🥗'
  if (categoriaLower.includes('sopa')) return '🍲'
  if (categoriaLower.includes('doce')) return '🍰'
  if (categoriaLower.includes('low') || categoriaLower.includes('carb')) return '🥩'
  if (categoriaLower.includes('salgada')) return '🍽️'
  
  if (nomeLower.includes('smoothie') || nomeLower.includes('suco')) return '🥤'
  if (nomeLower.includes('salada') || nomeLower.includes('bowl')) return '🥗'
  if (nomeLower.includes('sopa')) return '🍲'
  if (nomeLower.includes('shot')) return '💉'
  if (nomeLower.includes('doce') || nomeLower.includes('sobremesa')) return '🍰'
  if (nomeLower.includes('frango') || nomeLower.includes('chicken')) return '🍗'
  if (nomeLower.includes('peixe') || nomeLower.includes('fish')) return '🐟'
  if (nomeLower.includes('carne') || nomeLower.includes('beef')) return '🥩'
  
  return '📄'
}

export default function MinhasReceitasPage() {
  const { receitasSalvas, removerReceita } = useSavedRecipes()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Simular loading para sincronizar com o hook
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [receitasSalvas])

  // Filtrar receitas baseado no termo de busca
  const filteredReceitas = receitasSalvas.filter(receita =>
    receita.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receita.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receita.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRemoverReceita = (id: number) => {
    removerReceita(id)
  }

  const handleCompartilharWhatsApp = (receita: ReceitaSalva) => {
    const mensagem = `🍽️ *${receita.nome}*\n\n${receita.descricao}\n\n📖 Veja a receita completa: ${receita.link_pdf}\n\n✨ Receita salva do Portal Fit`
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
  }

  const handleAcessarReceita = (receita: ReceitaSalva) => {
    window.open(receita.link_pdf, '_blank')
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
                ← Voltar
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
            📚 Minhas Receitas
          </h1>
          <p className="text-brand-text2 mt-2">
            Suas receitas favoritas salvas
          </p>
        </div>

        {/* Busca */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar nas suas receitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green mx-auto mb-4"></div>
            <p className="text-brand-text2">Carregando suas receitas...</p>
          </div>
        )}

        {/* Lista de Receitas Salvas */}
        {!loading && (
          <div className="space-y-4">
            {filteredReceitas.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-brand-text mb-2">
                  {searchTerm ? 'Nenhuma receita encontrada' : 'Nenhuma receita salva ainda'}
                </h3>
                <p className="text-brand-text2 mb-6">
                  {searchTerm 
                    ? 'Tente buscar com outros termos'
                    : 'Salve receitas que você gostar para acessá-las facilmente aqui'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/receitas">
                    <button className="bg-brand-green text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-greenDark transition-colors">
                      Explorar Receitas
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              filteredReceitas.map((receita) => (
                <div
                  key={receita.id}
                  className="bg-white rounded-xl p-4 shadow-soft border border-brand-border"
                >
                  <div className="flex items-start space-x-4">
                    {/* Emoji da Receita */}
                    <div className="text-3xl flex-shrink-0">
                      {getRecipeEmoji(receita.nome, receita.categoria)}
                    </div>

                    {/* Conteúdo da Receita */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-brand-text text-lg">
                          {receita.nome}
                        </h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-green text-white">
                          {receita.categoria}
                        </span>
                      </div>

                      <p className="text-brand-text2 text-sm mb-3 line-clamp-2">
                        {receita.descricao}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-brand-text2">
                          Salva em: {receita.data_salvamento}
                        </span>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcessarReceita(receita)}
                          className="flex-1 bg-brand-green text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-brand-greenDark transition-colors"
                        >
                          📖 Ver Receita
                        </button>
                        <button
                          onClick={() => handleCompartilharWhatsApp(receita)}
                          className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                          📱 WhatsApp
                        </button>
                        <button
                          onClick={() => handleRemoverReceita(receita.id)}
                          className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Estatísticas */}
        {!loading && receitasSalvas.length > 0 && (
          <div className="mt-8 p-4 bg-white rounded-xl shadow-soft border border-brand-border">
            <h3 className="font-semibold text-brand-text mb-2">📊 Suas Estatísticas</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-brand-green">{receitasSalvas.length}</div>
                <div className="text-sm text-brand-text2">Receitas Salvas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-purple">
                  {new Set(receitasSalvas.map(r => r.categoria)).size}
                </div>
                <div className="text-sm text-brand-text2">Categorias</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
