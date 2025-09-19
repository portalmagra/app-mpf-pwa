'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'
import { recipeService, Recipe } from '@/lib/supabase'
import { useSavedRecipes } from '@/hooks/useSavedItems'

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
  categoria?: string
}

// Função para gerar emoji baseado no nome da receita
const getRecipeEmoji = (nome: string): string => {
  const nomeLower = nome.toLowerCase()
  
  if (nomeLower.includes('salada') || nomeLower.includes('salad')) return '🥗'
  if (nomeLower.includes('bowl') || nomeLower.includes('tigela')) return '🍽️'
  if (nomeLower.includes('quinoa')) return '🌾'
  if (nomeLower.includes('frango') || nomeLower.includes('chicken')) return '🍗'
  if (nomeLower.includes('peixe') || nomeLower.includes('fish')) return '🐟'
  if (nomeLower.includes('abacate') || nomeLower.includes('avocado')) return '🥑'
  if (nomeLower.includes('tomate') || nomeLower.includes('tomato')) return '🍅'
  if (nomeLower.includes('cenoura') || nomeLower.includes('carrot')) return '🥕'
  if (nomeLower.includes('brócolis') || nomeLower.includes('broccoli')) return '🥦'
  if (nomeLower.includes('espinafre') || nomeLower.includes('spinach')) return '🥬'
  
  return '🥗'
}

// Função para gerar cor de fundo baseada no tipo
const getRecipeBgColor = (tipo: string): string => {
  switch (tipo) {
    case 'gratuita':
      return 'bg-brand-greenSoft'
    case 'paga':
      return 'bg-brand-purpleSoft'
    default:
      return 'bg-brand-neutral'
  }
}

export default function SaladasPage() {
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [filteredReceitas, setFilteredReceitas] = useState<Receita[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'todas' | 'gratuitas' | 'pagas'>('todas')
  const [searchTerm, setSearchTerm] = useState('')
  const { salvarReceita, isReceitaSalva } = useSavedRecipes()

  useEffect(() => {
    // Carregar receitas do Supabase filtradas por categoria
    const loadRecipes = async () => {
      try {
        console.log('🔄 Carregando receitas Saladas do Supabase...')
        const supabaseRecipes = await recipeService.getActiveRecipes()
        console.log('📦 Receitas carregadas do Supabase:', supabaseRecipes)
        
        // Converter formato do Supabase para formato da página de receitas
        const convertedRecipes: Receita[] = supabaseRecipes
          .filter((recipe: Recipe) => 
            recipe.type?.toLowerCase() === 'saladas' ||
            recipe.category?.toLowerCase().includes('salada') || 
            recipe.name.toLowerCase().includes('salada') ||
            recipe.name.toLowerCase().includes('bowl') ||
            recipe.name.toLowerCase().includes('salad')
          )
          .map((recipe: Recipe) => ({
            id: recipe.id,
            nome: recipe.name,
            descricao: recipe.description || '',
            tipo: recipe.price === 0 ? 'gratuita' : 'paga',
            preco: recipe.price,
            link_pdf: recipe.pdf_link,
            status: recipe.status === 'active' ? 'ativa' : 'inativa',
            data_criacao: recipe.created_at.split('T')[0],
            imagem: recipe.image_url,
            categoria: recipe.category
          }))
        
        console.log('✅ Receitas Saladas convertidas:', convertedRecipes)
        setReceitas(convertedRecipes)
        setFilteredReceitas(convertedRecipes)
        setLoading(false)
      } catch (error) {
        console.error('❌ Erro ao carregar receitas Saladas do Supabase:', error)
        
        // Fallback para dados padrão em caso de erro
        const mockReceitas: Receita[] = [
          {
            id: 1,
            nome: "Bowl Energético com Quinoa",
            descricao: "Refeição completa e nutritiva perfeita para dar energia durante o dia",
            tipo: "gratuita",
            preco: 0,
            link_pdf: "https://drive.google.com/file/d/bowl-quinoa/view",
            status: "ativa",
            data_criacao: "2024-01-15",
            categoria: "saladas"
          },
          {
            id: 2,
            nome: "Salada de Frango com Abacate",
            descricao: "Salada rica em proteínas e gorduras boas para uma refeição equilibrada",
            tipo: "gratuita",
            preco: 0,
            link_pdf: "https://drive.google.com/file/d/salada-frango/view",
            status: "ativa",
            data_criacao: "2024-01-16",
            categoria: "saladas"
          },
          {
            id: 3,
            nome: "Salada Verde Detox",
            descricao: "Salada refrescante com vegetais verdes e molho especial",
            tipo: "gratuita",
            preco: 0,
            link_pdf: "https://drive.google.com/file/d/salada-verde/view",
            status: "ativa",
            data_criacao: "2024-01-17",
            categoria: "saladas"
          }
        ]
        
        setReceitas(mockReceitas)
        setFilteredReceitas(mockReceitas)
        setLoading(false)
      }
    }

    loadRecipes()
  }, [])

  // Filtrar receitas baseado no filtro ativo e termo de busca
  useEffect(() => {
    let filtered = receitas

    // Aplicar filtro de tipo
    if (activeFilter === 'gratuitas') {
      filtered = filtered.filter(receita => receita.tipo === 'gratuita')
    } else if (activeFilter === 'pagas') {
      filtered = filtered.filter(receita => receita.tipo === 'paga')
    }

    // Aplicar busca por texto
    if (searchTerm) {
      filtered = filtered.filter(receita =>
        receita.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receita.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredReceitas(filtered)
  }, [receitas, activeFilter, searchTerm])

  const handleComprarReceita = (receita: Receita) => {
    // Simular processo de compra
    alert(`Compra da receita "${receita.nome}" por $${receita.preco} realizada com sucesso!`)
  }

  const handleAcessarReceita = (receita: Receita) => {
    if (receita.tipo === 'gratuita') {
      window.open(receita.link_pdf, '_blank')
    } else {
      handleComprarReceita(receita)
    }
  }

  const handleSalvarReceita = (receita: Receita) => {
    salvarReceita({
      nome: receita.nome,
      descricao: receita.descricao,
      categoria: 'saladas',
      link_pdf: receita.link_pdf,
      emoji: getRecipeEmoji(receita.nome)
    })
    alert(`Receita "${receita.nome}" adicionada aos Favoritos! ❤️`)
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
            🥗 Saladas
          </h1>
          <p className="text-brand-text2 mt-2">
            Refeições frescas e nutritivas
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveFilter('todas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'todas'
                  ? 'bg-brand-green text-white'
                  : 'bg-white text-brand-text border border-brand-border'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setActiveFilter('gratuitas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'gratuitas'
                  ? 'bg-brand-green text-white'
                  : 'bg-white text-brand-text border border-brand-border'
              }`}
            >
              Gratuitas
            </button>
            <button
              onClick={() => setActiveFilter('pagas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'pagas'
                  ? 'bg-brand-green text-white'
                  : 'bg-white text-brand-text border border-brand-border'
              }`}
            >
              Pagas
            </button>
          </div>

          {/* Busca */}
          <input
            type="text"
            placeholder="Buscar saladas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green mx-auto mb-4"></div>
            <p className="text-brand-text2">Carregando saladas...</p>
          </div>
        )}

        {/* Lista de Receitas */}
        {!loading && (
          <div className="space-y-4">
            {filteredReceitas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-brand-text2">Nenhuma salada encontrada.</p>
              </div>
            ) : (
              filteredReceitas.map((receita) => (
                <div
                  key={receita.id}
                  className={`${getRecipeBgColor(receita.tipo)} rounded-xl p-4 shadow-soft border border-brand-border`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Emoji da Receita */}
                    <div className="text-3xl flex-shrink-0">
                      {getRecipeEmoji(receita.nome)}
                    </div>

                    {/* Conteúdo da Receita */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-brand-text text-lg">
                          {receita.nome}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          receita.tipo === 'gratuita'
                            ? 'bg-brand-green text-white'
                            : 'bg-brand-purple text-white'
                        }`}>
                          {receita.tipo === 'gratuita' ? 'Gratuita' : `$${receita.preco}`}
                        </span>
                      </div>

                      <p className="text-brand-text2 text-sm mb-3 line-clamp-2">
                        {receita.descricao}
                      </p>

                      {/* Imagem da Receita */}
                      {receita.imagem && (
                        <div className="mb-3">
                          <img
                            src={`${receita.imagem}?t=${Date.now()}`}
                            alt={receita.nome}
                            className="w-full h-32 object-cover rounded-lg"
                            loading="lazy"
                            onError={(e) => {
                              console.log('❌ Erro ao carregar imagem:', receita.imagem)
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-brand-text2">
                          {receita.data_criacao}
                        </span>
                        <button
                          onClick={() => handleAcessarReceita(receita)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            receita.tipo === 'gratuita'
                              ? 'bg-brand-green text-white hover:bg-brand-greenDark'
                              : 'bg-brand-purple text-white hover:bg-brand-purpleDark'
                          }`}
                        >
                          {receita.tipo === 'gratuita' ? 'Ver Salada' : 'Comprar'}
                        </button>
                      </div>

                      {/* Botão Salvar */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleSalvarReceita(receita)}
                          disabled={isReceitaSalva(receita.nome)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isReceitaSalva(receita.nome)
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                        >
                          {isReceitaSalva(receita.nome) ? '✅ Salva' : '💾 Salvar Receita'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/receitas" />
    </div>
  )
}
