'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import AdminEbooks from '@/components/AdminEbooks'
import NotificationPanel from '@/components/NotificationPanel'
import { productService, categoryService, recipeService, ebookService, Product, Category } from '@/lib/supabase'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showEbooksModal, setShowEbooksModal] = useState(false)
  const [showNotificationsModal, setShowNotificationsModal] = useState(false)
  const [showCuratedProductModal, setShowCuratedProductModal] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [operationStatus, setOperationStatus] = useState('')
  const [stats, setStats] = useState({
    recipes: 0,
    products: 0,
    categories: 0,
    ebooks: 0
  })
  const [loading, setLoading] = useState(true)

  const [newCuratedProduct, setNewCuratedProduct] = useState({
    name: '',
    description: '',
    category_id: '',
    amazon_url: '',
    current_price: '',
    image_url: '',
    benefits: [] as string[],
    features: [] as string[],
    is_mentoria: false,
    is_curated: true,
    quiz_keywords: [] as string[],
    priority_score: 50,
    multiple_categories: [] as string[] // Categorias adicionais (sintomas)
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [recipes, products, categoriesData, ebooks] = await Promise.all([
        recipeService.getAllRecipes(),
        productService.getAllProducts(),
        categoryService.getAllCategories(),
        ebookService.getAllEbooks()
      ])
      
      setStats({
        recipes: recipes.length,
        products: products.length,
        categories: categoriesData.length,
        ebooks: ebooks.length
      })
      
      setCategories(categoriesData)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const extractAsinFromUrl = (url: string): string | null => {
    if (!url) return null
    
    // Regex para extrair ASIN de URLs da Amazon
    const patterns = [
      /\/dp\/([A-Z0-9]{10})/,
      /\/product\/([A-Z0-9]{10})/,
      /\/gp\/product\/([A-Z0-9]{10})/,
      /\/exec\/obidos\/ASIN\/([A-Z0-9]{10})/,
      /\/o\/ASIN\/([A-Z0-9]{10})/,
      /\/dp\/[^\/]*\/([A-Z0-9]{10})/,
      /\/[^\/]*\/([A-Z0-9]{10})(?:\/|$|\?)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }
    
    return null
  }

  const handleCreateCuratedProduct = async () => {
    if (!newCuratedProduct.name || !newCuratedProduct.category_id) {
      setOperationStatus('❌ Nome e categoria são obrigatórios')
      return
    }

    try {
      setOperationStatus('⏳ Criando produto curado...')
      
      // Extrair ASIN da URL da Amazon se fornecida
      const asin = extractAsinFromUrl(newCuratedProduct.amazon_url)
      const finalAmazonUrl = asin ? `https://meuportalfit.com/link/${asin}` : newCuratedProduct.amazon_url
      
      const productToCreate = {
        ...newCuratedProduct,
        id: `curated_${Date.now()}`, // Gerar ID único
        amazon_url: finalAmazonUrl, // Usar nosso sistema de redirecionamento
        slug: newCuratedProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') // Gerar slug automaticamente
      }
      
      const success = await productService.createProduct(productToCreate)
      
      if (success) {
        setOperationStatus('✅ Produto curado criado com sucesso!')
        setNewCuratedProduct({
          name: '',
          description: '',
          category_id: '',
          amazon_url: '',
          current_price: '',
          image_url: '',
          benefits: [],
          features: [],
          is_mentoria: false,
          is_curated: true,
          quiz_keywords: [],
          priority_score: 50,
          multiple_categories: []
        })
        setShowCuratedProductModal(false)
        loadStats() // Recarregar estatísticas
      } else {
        setOperationStatus('❌ Erro ao criar produto curado')
      }
    } catch (error) {
      console.error('Erro ao criar produto curado:', error)
      setOperationStatus('❌ Erro ao criar produto curado')
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
      id: 'notifications',
      title: '🔔 Notificações',
      description: 'Envie notificações push para usuários',
      href: '#',
      color: 'bg-blue-500',
      stats: 'Push notifications',
      onClick: () => setShowNotificationsModal(true)
    },
    {
      id: 'produtos',
      title: '🛒 Produtos',
      description: 'Gerencie produtos e suplementos',
      href: '/admin-produtos',
      color: 'bg-blue-500',
      stats: `${stats.products} produtos cadastrados`,
      actionButton: {
        text: '⭐ Criar Produto Curado',
        onClick: () => setShowCuratedProductModal(true)
      }
    },
    {
      id: 'importacao-massa',
      title: '📦 Importação em Massa',
      description: 'Importe produtos da Amazon em lote para produtos curados',
      href: '/admin-bulk-import',
      color: 'bg-purple-500',
      stats: 'Importação automática'
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
            
            <button
              onClick={() => setShowCuratedProductModal(true)}
              className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors group w-full text-left"
            >
              <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">⭐</span>
              <div>
                <h3 className="font-medium text-gray-800">Produto Curado</h3>
                <p className="text-sm text-gray-600">Para recomendações</p>
              </div>
            </button>
            
            <Link
              href="/admin-bulk-import"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
            >
              <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">📦</span>
              <div>
                <h3 className="font-medium text-gray-800">Importação em Massa</h3>
                <p className="text-sm text-gray-600">Produtos da Amazon</p>
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
                      <div className="flex items-center space-x-2">
                        {section.actionButton && (
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              section.actionButton?.onClick()
                            }}
                            className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors"
                          >
                            {section.actionButton.text}
                          </button>
                        )}
                        <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                          →
                        </span>
                      </div>
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
                <Link href="/admin-bulk-import" className="flex items-center p-2 bg-purple-50 rounded hover:bg-purple-100 transition-colors">
                  <span className="text-purple-600 mr-2">📦</span>
                  <span className="text-sm text-gray-700">Importação em Massa</span>
                </Link>
                <Link href="/admin-manual-bulk-import" className="flex items-center p-2 bg-orange-50 rounded hover:bg-orange-100 transition-colors">
                  <span className="text-orange-600 mr-2">📝</span>
                  <span className="text-sm text-gray-700">Cadastro Manual</span>
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

      {/* Modal de Notificações */}
      {showNotificationsModal && (
        <NotificationPanel onClose={() => setShowNotificationsModal(false)} />
      )}

      {/* Modal de Produto Curado */}
      {showCuratedProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">⭐ Criar Produto Curado</h2>
                <button
                  onClick={() => setShowCuratedProductModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Status */}
              {operationStatus && (
                <div className={`mb-4 p-3 rounded-lg ${
                  operationStatus.includes('✅') ? 'bg-green-100 text-green-800' :
                  operationStatus.includes('❌') ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {operationStatus}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    value={newCuratedProduct.name}
                    onChange={(e) => setNewCuratedProduct({...newCuratedProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: NOW Foods Vitamin D3 5000 IU"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria Principal *
                  </label>
                  <select
                    value={newCuratedProduct.category_id}
                    onChange={(e) => setNewCuratedProduct({...newCuratedProduct, category_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sintomas Adicionais (Múltiplas categorias)
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newCuratedProduct.multiple_categories.includes(category.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewCuratedProduct({
                                ...newCuratedProduct,
                                multiple_categories: [...newCuratedProduct.multiple_categories, category.id]
                              })
                            } else {
                              setNewCuratedProduct({
                                ...newCuratedProduct,
                                multiple_categories: newCuratedProduct.multiple_categories.filter(id => id !== category.id)
                              })
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selecione outros sintomas que este produto também pode ajudar
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL da Amazon
                  </label>
                  <input
                    type="url"
                    value={newCuratedProduct.amazon_url}
                    onChange={(e) => setNewCuratedProduct({...newCuratedProduct, amazon_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cole a URL da Amazon (será convertida automaticamente)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Atual
                  </label>
                  <input
                    type="text"
                    value={newCuratedProduct.current_price}
                    onChange={(e) => setNewCuratedProduct({...newCuratedProduct, current_price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="$29.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Palavras-chave do Quiz
                  </label>
                  <input
                    type="text"
                    value={newCuratedProduct.quiz_keywords.join(', ')}
                    onChange={(e) => setNewCuratedProduct({...newCuratedProduct, quiz_keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="energia, vitamina d, imunidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score de Prioridade
                  </label>
                  <input
                    type="number"
                    value={newCuratedProduct.priority_score}
                    onChange={(e) => setNewCuratedProduct({...newCuratedProduct, priority_score: parseInt(e.target.value) || 50})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  value={newCuratedProduct.image_url}
                  onChange={(e) => setNewCuratedProduct({...newCuratedProduct, image_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Características
                </label>
                <input
                  type="text"
                  value={newCuratedProduct.features.join(', ')}
                  onChange={(e) => setNewCuratedProduct({...newCuratedProduct, features: e.target.value.split(',').map(f => f.trim()).filter(f => f)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Non-GMO, Gluten Free, Lab Tested"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Benefícios
                </label>
                <input
                  type="text"
                  value={newCuratedProduct.benefits.join(', ')}
                  onChange={(e) => setNewCuratedProduct({...newCuratedProduct, benefits: e.target.value.split(',').map(b => b.trim()).filter(b => b)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Aumenta energia, Melhora humor, Fortalece imunidade"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCuratedProductModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateCuratedProduct}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  ⭐ Criar Produto Curado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}