'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { productService, categoryService, Product, Category } from '@/lib/supabase'

export default function AdminCuratedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [operationStatus, setOperationStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showCuratedOnly, setShowCuratedOnly] = useState(true)

  const [newProduct, setNewProduct] = useState({
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
    priority_score: 50
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log('🔄 Carregando produtos e categorias...')
      
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories()
      ])
      
      console.log('📦 Produtos carregados:', productsData.length)
      console.log('🏷️ Categorias carregadas:', categoriesData.length)
      
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.category_id) {
      setOperationStatus('❌ Nome e categoria são obrigatórios')
      return
    }

    try {
      setOperationStatus('⏳ Criando produto...')
      
      const success = await productService.createProduct(newProduct)
      
      if (success) {
        setOperationStatus('✅ Produto criado com sucesso!')
        setNewProduct({
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
          priority_score: 50
        })
        setShowForm(false)
        loadData()
      } else {
        setOperationStatus('❌ Erro ao criar produto')
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error)
      setOperationStatus('❌ Erro ao criar produto')
    }
  }

  const handleMarkAsCurated = async (productId: string, quizKeywords: string[], priorityScore: number) => {
    try {
      setOperationStatus('⏳ Marcando produto como curado...')
      
      const success = await productService.markProductAsCurated(productId, quizKeywords, priorityScore)
      
      if (success) {
        setOperationStatus('✅ Produto marcado como curado!')
        loadData()
      } else {
        setOperationStatus('❌ Erro ao marcar produto como curado')
      }
    } catch (error) {
      console.error('Erro ao marcar produto:', error)
      setOperationStatus('❌ Erro ao marcar produto como curado')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory
    const matchesCurated = !showCuratedOnly || product.is_curated
    
    return matchesSearch && matchesCategory && matchesCurated
  })

  const curatedProductsCount = products.filter(p => p.is_curated).length
  const totalProductsCount = products.length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos curados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-blue-600 hover:text-blue-800">
                ← Voltar ao Admin
              </Link>
              <Logo />
            </div>
            <div className="text-sm text-gray-500">
              Produtos Curados: {curatedProductsCount}/{totalProductsCount}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status */}
        {operationStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            operationStatus.includes('✅') ? 'bg-green-100 text-green-800' :
            operationStatus.includes('❌') ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {operationStatus}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showCuratedOnly}
                onChange={(e) => setShowCuratedOnly(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Apenas produtos curados</span>
            </label>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {showForm ? 'Cancelar' : '+ Novo Produto Curado'}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Novo Produto Curado</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: NOW Foods Vitamin D3 5000 IU"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria *
                </label>
                <select
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({...newProduct, category_id: e.target.value})}
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
                  URL da Amazon
                </label>
                <input
                  type="url"
                  value={newProduct.amazon_url}
                  onChange={(e) => setNewProduct({...newProduct, amazon_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://amazon.com/dp/B0013OULJ4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Atual
                </label>
                <input
                  type="text"
                  value={newProduct.current_price}
                  onChange={(e) => setNewProduct({...newProduct, current_price: e.target.value})}
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
                  value={newProduct.quiz_keywords.join(', ')}
                  onChange={(e) => setNewProduct({...newProduct, quiz_keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)})}
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
                  value={newProduct.priority_score}
                  onChange={(e) => setNewProduct({...newProduct, priority_score: parseInt(e.target.value) || 50})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Descrição detalhada do produto..."
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Criar Produto Curado
              </button>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              Produtos Curados ({filteredProducts.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <div key={product.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {product.name}
                      </h3>
                      {product.is_curated && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ⭐ Curado
                        </span>
                      )}
                      {product.priority_score && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Score: {product.priority_score}
                        </span>
                      )}
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-600">
                      {product.description}
                    </p>
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Categoria: {categories.find(c => c.id === product.category_id)?.name || 'N/A'}</span>
                      <span>Preço: {product.current_price || 'N/A'}</span>
                      <span>Rating: {product.rating || 'N/A'}</span>
                    </div>

                    {product.quiz_keywords && product.quiz_keywords.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm font-medium text-gray-700">Palavras-chave: </span>
                        <div className="inline-flex flex-wrap gap-1">
                          {product.quiz_keywords.map((keyword, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex space-x-2">
                    {!product.is_curated && (
                      <button
                        onClick={() => handleMarkAsCurated(
                          product.id, 
                          product.quiz_keywords || ['geral'], 
                          product.priority_score || 50
                        )}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Marcar como Curado
                      </button>
                    )}
                    
                    <Link
                      href={`/admin-produtos?edit=${product.id}`}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              <p>Nenhum produto encontrado.</p>
              {showCuratedOnly && (
                <p className="mt-2 text-sm">
                  Tente desmarcar "Apenas produtos curados" para ver todos os produtos.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


