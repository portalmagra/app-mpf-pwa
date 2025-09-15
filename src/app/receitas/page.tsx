'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { recipeService, Recipe } from '@/lib/supabase'

interface Receita {
  id: number
  nome: string
  descricao: string
  tipo: 'gratuita' | 'paga'
  preco: number
  link_pdf: string
  status: 'ativa' | 'inativa'
  data_criacao: string
  imagem?: string
}

// Função para gerar emoji baseado no nome da receita
const getRecipeEmoji = (nome: string): string => {
  const nomeLower = nome.toLowerCase()
  
  // Mapear palavras-chave para emojis específicos
  if (nomeLower.includes('smoothie') || nomeLower.includes('bebida') || nomeLower.includes('suco')) {
    return '🥤'
  }
  if (nomeLower.includes('sopa') || nomeLower.includes('caldo')) {
    return '🍲'
  }
  if (nomeLower.includes('salada') || nomeLower.includes('verde')) {
    return '🥗'
  }
  if (nomeLower.includes('bowl') || nomeLower.includes('tigela')) {
    return '🍽️'
  }
  if (nomeLower.includes('pão') || nomeLower.includes('bread')) {
    return '🍞'
  }
  if (nomeLower.includes('doce') || nomeLower.includes('açúcar') || nomeLower.includes('sweet')) {
    return '🍰'
  }
  if (nomeLower.includes('quinoa') || nomeLower.includes('grão')) {
    return '🌾'
  }
  if (nomeLower.includes('shot') || nomeLower.includes('energético')) {
    return '⚡'
  }
  if (nomeLower.includes('anti-inflamatória') || nomeLower.includes('detox')) {
    return '🌿'
  }
  
  // Emoji padrão para comida saudável
  return '🥗'
}

// Função para gerar cor de fundo baseada no emoji
const getRecipeBgColor = (emoji: string): string => {
  const colorMap: { [key: string]: string } = {
    '🥤': 'bg-gradient-to-br from-green-400 to-green-600',
    '🍲': 'bg-gradient-to-br from-orange-400 to-orange-600', 
    '🥗': 'bg-gradient-to-br from-green-300 to-green-500',
    '🍽️': 'bg-gradient-to-br from-amber-400 to-amber-600',
    '🍞': 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    '🍰': 'bg-gradient-to-br from-pink-400 to-pink-600',
    '🌾': 'bg-gradient-to-br from-yellow-500 to-yellow-700',
    '⚡': 'bg-gradient-to-br from-yellow-300 to-yellow-500',
    '🌿': 'bg-gradient-to-br from-green-500 to-green-700'
  }
  
  return colorMap[emoji] || 'bg-gradient-to-br from-green-400 to-green-600'
}

export default function ReceitasPage() {
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [filteredReceitas, setFilteredReceitas] = useState<Receita[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'todas' | 'gratuitas' | 'pagas'>('todas')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Carregar receitas do Supabase
    const loadRecipes = async () => {
      try {
        console.log('🔄 Carregando receitas do Supabase...')
        const supabaseRecipes = await recipeService.getActiveRecipes()
        console.log('📦 Receitas carregadas do Supabase:', supabaseRecipes)
        
        // Converter formato do Supabase para formato da página de receitas
        const convertedRecipes: Receita[] = supabaseRecipes.map((recipe: Recipe) => ({
          id: recipe.id,
          nome: recipe.name,
          descricao: recipe.description || '',
          tipo: recipe.price === 0 ? 'gratuita' : 'paga',
          preco: recipe.price,
          link_pdf: recipe.pdf_link,
          status: recipe.status === 'active' ? 'ativa' : 'inativa',
          data_criacao: recipe.created_at.split('T')[0],
          imagem: recipe.image_url
        }))
        
        console.log('✅ Receitas convertidas:', convertedRecipes)
        setReceitas(convertedRecipes)
        setFilteredReceitas(convertedRecipes)
        setLoading(false)
      } catch (error) {
        console.error('❌ Erro ao carregar receitas do Supabase:', error)
        
        // Fallback para dados padrão em caso de erro
        const mockReceitas: Receita[] = [
          {
            id: 1,
            nome: "Shot de Curcuma",
            descricao: "Shot anti-inflamatório com curcuma, limão e pimenta-do-reino",
            tipo: "gratuita",
            preco: 0,
            link_pdf: "https://drive.google.com/file/d/curcuma-shot/view",
            status: "ativa",
            data_criacao: "2024-01-15"
          },
          {
            id: 2,
            nome: "Smoothie Verde Detox",
            descricao: "Bebida refrescante rica em clorofila e antioxidantes para desintoxicar o organismo",
            tipo: "gratuita",
            preco: 0,
            link_pdf: "https://drive.google.com/file/d/smoothie-verde/view",
            status: "ativa",
            data_criacao: "2024-01-16"
          }
        ]
        
        setReceitas(mockReceitas)
        setFilteredReceitas(mockReceitas)
        setLoading(false)
      }
    }

    loadRecipes()

    // Verificar atualizações a cada 30 segundos
    const interval = setInterval(loadRecipes, 30000)
    
    return () => {
      clearInterval(interval)
    }
  }, [])

  // Filtrar receitas baseado no filtro ativo e termo de busca
  useEffect(() => {
    let filtered = receitas

    // Aplicar filtro por tipo
    if (activeFilter === 'gratuitas') {
      filtered = filtered.filter(receita => receita.tipo === 'gratuita')
    } else if (activeFilter === 'pagas') {
      filtered = filtered.filter(receita => receita.tipo === 'paga')
    }

    // Aplicar busca por nome ou descrição
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(receita => 
        receita.nome.toLowerCase().includes(term) ||
        receita.descricao.toLowerCase().includes(term)
      )
    }

    setFilteredReceitas(filtered)
  }, [receitas, activeFilter, searchTerm])

  const handleComprarReceita = (receita: Receita) => {
    const mensagem = `Oi! Quero comprar a receita "${receita.nome}" por $${receita.preco.toFixed(2)}`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleAcessarReceita = (receita: Receita) => {
    if (receita.tipo === 'gratuita') {
      window.open(receita.link_pdf, '_blank')
    } else {
      handleComprarReceita(receita)
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
            <Link href="/">
              <button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-greenDark transition-colors">
                🏠 Início
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-sm mx-auto px-4 py-6">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-text mb-2">
            🍽️ Receitas & Protocolos
          </h1>
          <p className="text-brand-textLight text-sm">
            Receitas saudáveis e protocolos nutricionais personalizados para brasileiros nos EUA
          </p>
        </div>

        {/* Busca */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 O que você quer cozinhar hoje?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-brand-green/20 rounded-xl text-brand-text placeholder-brand-textLight focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button 
              onClick={() => setActiveFilter('todas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === 'todas' 
                  ? 'bg-brand-green text-white' 
                  : 'bg-white border border-brand-green/20 text-brand-text hover:bg-brand-green/5'
              }`}
            >
              Todas ({receitas.length})
            </button>
            <button 
              onClick={() => setActiveFilter('gratuitas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === 'gratuitas' 
                  ? 'bg-brand-green text-white' 
                  : 'bg-white border border-brand-green/20 text-brand-text hover:bg-brand-green/5'
              }`}
            >
              Gratuitas ({receitas.filter(r => r.tipo === 'gratuita').length})
            </button>
            <button 
              onClick={() => setActiveFilter('pagas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === 'pagas' 
                  ? 'bg-brand-green text-white' 
                  : 'bg-white border border-brand-green/20 text-brand-text hover:bg-brand-green/5'
              }`}
            >
              Pagas ({receitas.filter(r => r.tipo === 'paga').length})
            </button>
          </div>
        </div>

        {/* Lista de Receitas */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-soft overflow-hidden animate-pulse">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                </div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReceitas.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-brand-text mb-2">
                  Nenhuma receita encontrada
                </h3>
                <p className="text-brand-textLight text-sm">
                  Tente ajustar os filtros ou termo de busca
                </p>
              </div>
            ) : (
              filteredReceitas.map((receita) => (
              <div key={receita.id} className="bg-white rounded-xl shadow-soft overflow-hidden">
                {/* Imagem ou Emoji da Receita */}
                <div className="relative h-48 w-full overflow-hidden">
                  {receita.imagem ? (
                    <img
                      src={receita.imagem}
                      alt={receita.nome}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`w-full h-full ${getRecipeBgColor(getRecipeEmoji(receita.nome))} flex items-center justify-center`}>
                      <span className="text-8xl drop-shadow-lg">
                        {getRecipeEmoji(receita.nome)}
                      </span>
                    </div>
                  )}
                  {receita.tipo === 'gratuita' && (
                    <span className="absolute top-3 right-3 bg-brand-green text-white px-3 py-1 rounded-lg text-xs font-medium">
                      GRÁTIS
                    </span>
                  )}
                  {receita.tipo === 'paga' && (
                    <span className="absolute top-3 right-3 bg-brand-amber text-white px-3 py-1 rounded-lg text-xs font-medium">
                      ${receita.preco.toFixed(2)}
                    </span>
                  )}
                </div>
                
                {/* Conteúdo da Receita */}
                <div className="p-4">
                  <h3 className="font-bold text-brand-text text-lg mb-2">
                    {receita.nome}
                  </h3>
                  <p className="text-brand-textLight text-sm leading-relaxed mb-4">
                    {receita.descricao}
                  </p>

                  <button
                    onClick={() => handleAcessarReceita(receita)}
                    className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                      receita.tipo === 'gratuita'
                        ? 'bg-brand-green text-white hover:bg-brand-greenDark'
                        : 'bg-brand-amber text-white hover:bg-brand-amberDark'
                    }`}
                  >
                    {receita.tipo === 'gratuita' ? 'Ver Receita' : 'Comprar Receita'}
                  </button>
                </div>
              </div>
              ))
            )}
          </div>
        )}

        {/* CTA Final */}
        <div className="mt-8 bg-brand-green rounded-xl p-6 text-center text-white">
          <div className="flex items-center justify-center mb-3">
            <span className="text-2xl mr-2">🎯</span>
            <h3 className="font-bold text-lg">
              Protocolos Nutricionais Completos
            </h3>
          </div>
          <p className="text-sm mb-4 opacity-90">
            Planos de 7, 14 ou 30 dias com receitas, cardápios e acompanhamento personalizado
          </p>
          <button
            onClick={() => {
              const mensagem = "Oi! Quero saber mais sobre os protocolos nutricionais completos"
              const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`
              window.open(whatsappUrl, '_blank')
            }}
            className="bg-white text-brand-green px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Conhecer Protocolos
          </button>
        </div>
      </main>
    </div>
  )
}
