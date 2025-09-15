'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { productService, categoryService, Product, Category } from '@/lib/supabase'

export default function AdminProdutos() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [operationStatus, setOperationStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showMercadoModal, setShowMercadoModal] = useState(false)

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category_id: '',
    amazon_url: '',
    current_price: '',
    image_url: '',
    benefits: [] as string[],
    features: [] as string[],
    is_mentoria: false
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
      alert('Por favor, preencha pelo menos o nome e a categoria do produto')
      return
    }

    try {
      setOperationStatus('Criando produto...')
      console.log('🔄 Criando produto:', newProduct)

      const productData = {
        ...newProduct,
        id: Date.now().toString(),
        slug: `${newProduct.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        product_url: `/produtos/${newProduct.category_id}/${newProduct.name.toLowerCase().replace(/\s+/g, '-')}`
      }

      const createdProduct = await productService.createProduct(productData)

      if (createdProduct) {
        console.log('✅ Produto criado:', createdProduct)
        setProducts(prev => [createdProduct, ...prev])
        
        // Reset form
        setNewProduct({
          name: '',
          description: '',
          category_id: '',
          amazon_url: '',
          current_price: '',
          image_url: '',
          benefits: [],
          features: [],
          is_mentoria: false
        })
        setShowForm(false)
        setOperationStatus('Produto criado com sucesso!')
        setTimeout(() => setOperationStatus(''), 3000)
      } else {
        alert('Erro ao criar produto. Tente novamente.')
      }
    } catch (error) {
      console.error('❌ Erro ao criar produto:', error)
      alert('Erro ao criar produto. Tente novamente.')
    }
  }

  const handleUpdateProduct = async () => {
    if (editingProduct && newProduct.name && newProduct.category_id) {
      try {
        setOperationStatus('Atualizando produto...')
        console.log('🔄 Atualizando produto:', editingProduct)

        const updatedProduct = await productService.updateProduct(editingProduct, newProduct)

        if (updatedProduct) {
          console.log('✅ Produto atualizado:', updatedProduct)
          setProducts(prev =>
            prev.map(product =>
              product.id === editingProduct ? updatedProduct : product
            )
          )

          // Reset form
          setNewProduct({
            name: '',
            description: '',
            category_id: '',
            amazon_url: '',
            current_price: '',
            image_url: '',
            benefits: [],
            features: [],
            is_mentoria: false
          })
          setEditingProduct(null)
          setShowForm(false)
          setOperationStatus('Produto atualizado com sucesso!')
          setTimeout(() => setOperationStatus(''), 3000)
        } else {
          alert('Erro ao atualizar produto. Tente novamente.')
        }
      } catch (error) {
        console.error('❌ Erro ao atualizar produto:', error)
        alert('Erro ao atualizar produto. Tente novamente.')
      }
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        setOperationStatus('Deletando produto...')
        console.log('🗑️ Deletando produto:', id)

        const success = await productService.deleteProduct(id)

        if (success) {
          console.log('✅ Produto deletado:', id)
          setProducts(prev => prev.filter(product => product.id !== id))
          setOperationStatus('Produto excluído com sucesso!')
          setTimeout(() => setOperationStatus(''), 3000)
        } else {
          alert('Erro ao excluir produto. Tente novamente.')
        }
      } catch (error) {
        console.error('❌ Erro ao deletar produto:', error)
        alert('Erro ao excluir produto. Tente novamente.')
      }
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product.id)
    setNewProduct({
      name: product.name,
      description: product.description || '',
      category_id: product.category_id,
      amazon_url: product.amazon_url || '',
      current_price: product.current_price || '',
      image_url: product.image_url || '',
      benefits: product.benefits || [],
      features: product.features || [],
      is_mentoria: product.is_mentoria || false
    })
    setShowForm(true)
  }

  const handleToggleMercado = async (productId: string, currentStatus: boolean) => {
    try {
      setOperationStatus('Atualizando produto no mercado...')
      console.log('🔄 Atualizando status do mercado para produto:', productId)

      const success = await productService.updateProduct(productId, {
        is_mentoria: !currentStatus
      })

      if (success) {
        console.log('✅ Status do mercado atualizado')
        setProducts(prev => prev.map(p => 
          p.id === productId 
            ? { ...p, is_mentoria: !currentStatus }
            : p
        ))
        setOperationStatus(`Produto ${!currentStatus ? 'adicionado ao' : 'removido do'} mercado!`)
        setTimeout(() => setOperationStatus(''), 3000)
      } else {
        alert('Erro ao atualizar produto no mercado. Tente novamente.')
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar produto no mercado:', error)
      alert('Erro ao atualizar produto no mercado. Tente novamente.')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.name || categoryId
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.icon || '📦'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="horizontal" size="md" />
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-sm text-gray-600 hover:text-brand-green transition-colors">
                ← Voltar ao Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🛒 Admin Produtos</h1>
          <p className="text-gray-600">Gerencie produtos, suplementos e links de afiliados.</p>
        </div>

        {operationStatus && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {operationStatus}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-brand-green text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-greenDark transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Adicionar Novo Produto'}
          </button>
          
          <button
            onClick={() => setShowMercadoModal(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            🛒 Gerenciar Mercado
          </button>
          
          <button
            onClick={loadData}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            🔄 Recarregar
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="Ex: Whey Protein"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  rows={3}
                  placeholder="Descrição detalhada do produto..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL da Amazon
                </label>
                <input
                  type="url"
                  value={newProduct.amazon_url}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, amazon_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="https://amazon.com/produto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço Atual
                </label>
                <input
                  type="text"
                  value={newProduct.current_price}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, current_price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="Ex: $29.99"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="https://example.com/imagem.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newProduct.is_mentoria}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, is_mentoria: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Produto de Mentoria</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingProduct(null)
                  setNewProduct({
                    name: '',
                    description: '',
                    category_id: '',
                    amazon_url: '',
                    current_price: '',
                    image_url: '',
                    benefits: [],
                    features: [],
                    is_mentoria: false
                  })
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                className="px-6 py-2 bg-brand-green text-white rounded-md hover:bg-brand-greenDark transition-colors"
              >
                {editingProduct ? 'Atualizar' : 'Criar'} Produto
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
              Produtos ({filteredProducts.length})
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCategoryIcon(product.category_id)}</span>
                    <span className="text-sm text-gray-600">{getCategoryName(product.category_id)}</span>
                  </div>
                  {product.is_mentoria && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      Mentoria
                    </span>
                  )}
                </div>
                
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-md mb-3"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
                
                <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
                
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                )}
                
                {product.current_price && (
                  <p className="text-lg font-bold text-brand-green mb-3">{product.current_price}</p>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
                
                {product.amazon_url && (
                  <a
                    href={product.amazon_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 text-center bg-orange-500 text-white px-3 py-2 rounded text-sm hover:bg-orange-600 transition-colors"
                  >
                    Ver na Amazon
                  </a>
                )}
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum produto encontrado.</p>
            </div>
          )}
        </div>

        {/* Modal Gerenciar Mercado */}
        {showMercadoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">🛒 Gerenciar Produtos do Mercado</h2>
                    <p className="text-gray-600 mt-1">Selecione quais produtos aparecem na página do mercado</p>
                  </div>
                  <button
                    onClick={() => setShowMercadoModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Dica:</strong> Os produtos selecionados para o mercado também continuarão aparecendo em suas respectivas categorias.
                  </p>
                </div>

                <div className="space-y-4">
                  {products.map(product => {
                    const category = categories.find(cat => cat.id === product.category_id)
                    return (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                              {product.image_url ? (
                                <img 
                                  src={product.image_url} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-2xl">📦</span>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">{product.name}</h3>
                              <p className="text-sm text-gray-600">
                                {category ? `${category.icon} ${category.name}` : 'Sem categoria'}
                              </p>
                              {product.current_price && (
                                <p className="text-sm text-green-600 font-medium">{product.current_price}</p>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleToggleMercado(product.id, product.is_mentoria || false)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              product.is_mentoria 
                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                            }`}
                          >
                            {product.is_mentoria ? '✅ No Mercado' : '➕ Adicionar'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum produto cadastrado</h3>
                    <p className="text-gray-600">Adicione produtos primeiro para poder gerenciá-los no mercado.</p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {products.filter(p => p.is_mentoria).length} produto(s) selecionado(s) para o mercado
                  </div>
                  <button
                    onClick={() => setShowMercadoModal(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}