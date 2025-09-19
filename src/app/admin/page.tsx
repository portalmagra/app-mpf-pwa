'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import AdminEbooks from '@/components/AdminEbooks'
import { productService, categoryService, recipeService, ebookService } from '@/lib/supabase'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showEbooksModal, setShowEbooksModal] = useState(false)
  const [stats, setStats] = useState({
    recipes: 0,
    products: 0,
    categories: 0,
    ebooks: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [recipes, products, categories, ebooks] = await Promise.all([
        recipeService.getAllRecipes(),
        productService.getAllProducts(),
        categoryService.getAllCategories(),
        ebookService.getAllEbooks()
      ])
      
      setStats({
        recipes: recipes.length,
        products: products.length,
        categories: categories.length,
        ebooks: ebooks.length
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const adminSections = [
    {
      id: 'receitas',
      title: '🍽️ Receitas',
      description: 'Gerencie receitas e protocolos nutricionais',
      href: '/admin-receitas',
      color: 'bg-green-500',
      stats: `${stats.recipes} receitas ativas`
    },
    {
      id: 'ebooks',
      title: '📚 eBooks',
      description: 'Gerencie eBooks de receitas e dietas',
      href: '#',
      color: 'bg-purple-500',
      stats: `${stats.ebooks} eBooks cadastrados`,
      onClick: () => setShowEbooksModal(true)
    },
    {
      id: 'produtos',
      title: '🛒 Produtos',
      description: 'Gerencie produtos e suplementos',
      href: '/admin-produtos',
      color: 'bg-blue-500',
      stats: `${stats.products} produtos cadastrados`
    },
    {
      id: 'protocolos',
      title: '📋 Protocolos',
      description: 'Gerencie protocolos nutricionais',
      href: '/admin-protocolos',
      color: 'bg-purple-500',
      stats: 'Em desenvolvimento'
    },
    {
      id: 'categorias',
      title: '🏷️ Categorias',
      description: 'Gerencie categorias de produtos',
      href: '/admin-categorias',
      color: 'bg-orange-500',
      stats: `${stats.categories} categorias ativas`
    },
    {
      id: 'usuarios',
      title: '👥 Usuários',
      description: 'Gerencie usuários e avaliações',
      href: '/admin-usuarios',
      color: 'bg-pink-500',
      stats: 'Em desenvolvimento'
    },
    {
      id: 'configuracoes',
      title: '⚙️ Configurações',
      description: 'Configurações gerais do sistema',
      href: '/admin-configuracoes',
      color: 'bg-gray-500',
      stats: 'Em desenvolvimento'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="horizontal" size="md" />
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-brand-green transition-colors">
                ← Voltar ao App
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">🎛️ Painel Administrativo</h1>
              <p className="text-gray-600">Gerencie todos os aspectos do MeuPortalFit</p>
            </div>
            <button
              onClick={loadStats}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <span className="mr-2">{loading ? '🔄' : '🔄'}</span>
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>

        {/* Quick Actions - MOVED TO TOP */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin-receitas"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
            >
              <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">➕</span>
              <div>
                <h3 className="font-medium text-gray-800">Nova Receita</h3>
                <p className="text-sm text-gray-600">Adicionar receita</p>
              </div>
            </Link>
            
            <Link
              href="/admin-produtos"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">🛒</span>
              <div>
                <h3 className="font-medium text-gray-800">Novo Produto</h3>
                <p className="text-sm text-gray-600">Adicionar produto</p>
              </div>
            </Link>
            
            <Link
              href="/admin-categorias"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
            >
              <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">🏷️</span>
              <div>
                <h3 className="font-medium text-gray-800">Nova Categoria</h3>
                <p className="text-sm text-gray-600">Criar categoria</p>
              </div>
            </Link>
            
            <button
              onClick={() => setShowEbooksModal(true)}
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group w-full text-left"
            >
              <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">📚</span>
              <div>
                <h3 className="font-medium text-gray-800">Novo eBook</h3>
                <p className="text-sm text-gray-600">Criar eBook</p>
              </div>
            </button>
            
            <Link
              href="/admin-protocolos"
              className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group"
            >
              <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">📋</span>
              <div>
                <h3 className="font-medium text-gray-800">Novo Protocolo</h3>
                <p className="text-sm text-gray-600">Criar protocolo</p>
              </div>
            </Link>
            
            <Link
              href="/admin-sync"
              className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors group"
            >
              <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">🔄</span>
              <div>
                <h3 className="font-medium text-gray-800">Sincronizar</h3>
                <p className="text-sm text-gray-600">Com MeuPortalFit</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">🍽️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Receitas</h3>
                <p className="text-2xl font-bold text-green-600">{stats.recipes}</p>
                <p className="text-sm text-gray-500">Ativas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">🛒</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Produtos</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.products}</p>
                <p className="text-sm text-gray-500">Cadastrados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">🏷️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Categorias</h3>
                <p className="text-2xl font-bold text-orange-600">{stats.categories}</p>
                <p className="text-sm text-gray-500">Ativas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">eBooks</h3>
                <p className="text-2xl font-bold text-purple-600">{stats.ebooks}</p>
                <p className="text-sm text-gray-500">Cadastrados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            if (section.onClick) {
              return (
                <button
                  key={section.id}
                  onClick={section.onClick}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 group w-full text-left"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 ${section.color} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                      <span className="text-white text-xl">{section.title.split(' ')[0]}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {section.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {section.stats}
                        </span>
                        <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            }
            
            return (
              <Link
                key={section.id}
                href={section.href}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 ${section.color} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                    <span className="text-white text-xl">{section.title.split(' ')[0]}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {section.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {section.stats}
                      </span>
                      <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>


        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📈 Resumo de Atividade</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">📊 Estatísticas Gerais</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Total de Receitas</span>
                  <span className="font-semibold text-green-600">{stats.recipes}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Total de Produtos</span>
                  <span className="font-semibold text-blue-600">{stats.products}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Total de Categorias</span>
                  <span className="font-semibold text-orange-600">{stats.categories}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Total de eBooks</span>
                  <span className="font-semibold text-purple-600">{stats.ebooks}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">🚀 Ações Mais Usadas</h3>
              <div className="space-y-2">
                <Link href="/admin-produtos" className="flex items-center p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
                  <span className="text-blue-600 mr-2">🛒</span>
                  <span className="text-sm text-gray-700">Gerenciar Produtos</span>
                </Link>
                <Link href="/admin-receitas" className="flex items-center p-2 bg-green-50 rounded hover:bg-green-100 transition-colors">
                  <span className="text-green-600 mr-2">🍽️</span>
                  <span className="text-sm text-gray-700">Gerenciar Receitas</span>
                </Link>
                <Link href="/admin-categorias" className="flex items-center p-2 bg-orange-50 rounded hover:bg-orange-100 transition-colors">
                  <span className="text-orange-600 mr-2">🏷️</span>
                  <span className="text-sm text-gray-700">Gerenciar Categorias</span>
                </Link>
                <button 
                  onClick={() => setShowEbooksModal(true)}
                  className="flex items-center p-2 bg-purple-50 rounded hover:bg-purple-100 transition-colors w-full text-left"
                >
                  <span className="text-purple-600 mr-2">📚</span>
                  <span className="text-sm text-gray-700">Gerenciar eBooks</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Status do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <h3 className="font-medium text-gray-800">Supabase</h3>
                <p className="text-sm text-gray-600">Conectado</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <h3 className="font-medium text-gray-800">API</h3>
                <p className="text-sm text-gray-600">Funcionando</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <h3 className="font-medium text-gray-800">PWA</h3>
                <p className="text-sm text-gray-600">Ativo</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Administração de eBooks */}
      {showEbooksModal && (
        <AdminEbooks onClose={() => setShowEbooksModal(false)} />
      )}
    </div>
  )
}