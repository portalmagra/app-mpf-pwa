'use client'

import { useState, useEffect } from 'react'
import { productService, categoryService } from '@/lib/supabase'

interface ProductRow {
  id: string
  amazonUrl: string
  imageUrl: string
  description: string
  price: string
  categoryId: string
  detectedCategory?: string
}

interface Category {
  id: string
  name: string
}

export default function ManualBulkImportPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<ProductRow[]>([
    {
      id: '1',
      amazonUrl: '',
      imageUrl: '',
      description: '',
      price: '',
      categoryId: ''
    }
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<{
    success: number
    errors: string[]
  }>({ success: 0, errors: [] })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const cats = await categoryService.getAllCategories()
      setCategories(cats)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const detectCategory = (description: string): string => {
    const desc = description.toLowerCase()
    
    // Mapeamento de palavras-chave para categorias
    const categoryKeywords = {
      'proteína': ['whey', 'proteína', 'protein', 'caseína', 'casein', 'isolado', 'isolate'],
      'vitaminas': ['vitamina', 'vitamin', 'vit c', 'vit d', 'vit b', 'multivitamínico', 'multivitamin'],
      'minerais': ['magnésio', 'magnesium', 'zinco', 'zinc', 'ferro', 'iron', 'cálcio', 'calcium'],
      'omega': ['omega', 'óleo de peixe', 'fish oil', 'epa', 'dha'],
      'creatina': ['creatina', 'creatine', 'monohidrato'],
      'energia': ['energia', 'energy', 'cafeína', 'caffeine', 'guaraná', 'guarana'],
      'sono': ['melatonina', 'melatonin', 'sono', 'sleep', 'dormir'],
      'digestão': ['probiótico', 'probiotic', 'enzima', 'enzyme', 'digestão', 'digestion'],
      'imunidade': ['imunidade', 'immunity', 'vitamina c', 'vitamin c', 'zinc'],
      'emagrecimento': ['emagrecimento', 'weight loss', 'queima de gordura', 'fat burner', 'l-carnitina']
    }

    // Buscar categoria baseada nas palavras-chave
    for (const [categoryName, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (desc.includes(keyword)) {
          // Encontrar o ID da categoria
          const category = categories.find(cat => 
            cat.name.toLowerCase().includes(categoryName.toLowerCase())
          )
          return category?.id || ''
        }
      }
    }

    return ''
  }

  const addProductRow = () => {
    const newId = (products.length + 1).toString()
    setProducts([...products, {
      id: newId,
      amazonUrl: '',
      imageUrl: '',
      description: '',
      price: '',
      categoryId: ''
    }])
  }

  const removeProductRow = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const updateProduct = (id: string, field: keyof ProductRow, value: string) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value }
        
        // Detectar categoria automaticamente quando descrição mudar
        if (field === 'description' && value) {
          const detectedCategoryId = detectCategory(value)
          updated.categoryId = detectedCategoryId
          updated.detectedCategory = categories.find(c => c.id === detectedCategoryId)?.name
        }
        
        return updated
      }
      return p
    }))
  }

  const extractAsinFromUrl = (url: string): string | null => {
    const patterns = [
      /\/dp\/([A-Z0-9]{10})/,
      /\/product\/([A-Z0-9]{10})/,
      /\/gp\/product\/([A-Z0-9]{10})/,
      /\/exec\/obidos\/ASIN\/([A-Z0-9]{10})/,
      /\/dp\/product\/([A-Z0-9]{10})/,
      /\/dp\/[^\/]+\/([A-Z0-9]{10})/,
      /\/[^\/]*\/([A-Z0-9]{10})/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }
    return null
  }

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const validateImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  const processProducts = async () => {
    setIsProcessing(true)
    setResults({ success: 0, errors: [] })

    const errors: string[] = []
    let successCount = 0

    for (const product of products) {
      try {
        // Validações
        if (!product.amazonUrl.trim()) {
          errors.push(`Linha ${product.id}: URL da Amazon é obrigatória`)
          continue
        }

        if (!product.description.trim()) {
          errors.push(`Linha ${product.id}: Descrição é obrigatória`)
          continue
        }

        if (!product.price.trim()) {
          errors.push(`Linha ${product.id}: Preço é obrigatório`)
          continue
        }

        if (!product.categoryId) {
          errors.push(`Linha ${product.id}: Categoria é obrigatória`)
          continue
        }

        // Extrair ASIN
        const asin = extractAsinFromUrl(product.amazonUrl)
        if (!asin) {
          errors.push(`Linha ${product.id}: ASIN não encontrado na URL`)
          continue
        }

        // Validar imagem (opcional)
        let imageUrl = product.imageUrl
        if (imageUrl && !(await validateImageUrl(imageUrl))) {
          console.warn(`Imagem inválida para linha ${product.id}, usando placeholder`)
          imageUrl = `https://via.placeholder.com/300x300/f0f0f0/666666?text=${asin}`
        }

        // Criar produto
        const productToCreate = {
          id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: product.description,
          description: product.description,
          category_id: product.categoryId,
          amazon_url: `https://meuportalfit.com/link/${asin}`,
          current_price: product.price,
          rating: 0,
          review_count: 0,
          image_url: imageUrl || `https://via.placeholder.com/300x300/f0f0f0/666666?text=${asin}`,
          benefits: [],
          features: [],
          slug: generateSlug(product.description),
          is_curated: true,
          quiz_keywords: [],
          priority_score: 50
        }

        const result = await productService.createProduct(productToCreate)
        if (result) {
          successCount++
        } else {
          errors.push(`Linha ${product.id}: Erro ao salvar produto`)
        }
      } catch (error) {
        errors.push(`Linha ${product.id}: ${error}`)
      }
    }

    setResults({ success: successCount, errors })
    setIsProcessing(false)

    if (successCount > 0) {
      alert(`✅ ${successCount} produtos salvos com sucesso!\n❌ ${errors.length} erros encontrados.`)
      // Limpar formulário após sucesso
      if (errors.length === 0) {
        setProducts([{
          id: '1',
          amazonUrl: '',
          imageUrl: '',
          description: '',
          price: '',
          categoryId: ''
        }])
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            📝 Cadastro em Massa - Dados Manuais
          </h1>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Como usar:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Cole a URL da Amazon (extrai ASIN automaticamente)</li>
              <li>• Cole a URL da imagem (valida automaticamente)</li>
              <li>• Digite a descrição em português (detecta categoria automaticamente)</li>
              <li>• Digite o preço em USD (ex: $29.99)</li>
              <li>• A categoria será detectada automaticamente pela descrição</li>
            </ul>
          </div>

          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Produto #{index + 1}</h3>
                  {products.length > 1 && (
                    <button
                      onClick={() => removeProductRow(product.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      🗑️ Remover
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* URL Amazon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      🔗 URL Amazon:
                    </label>
                    <input
                      type="url"
                      value={product.amazonUrl}
                      onChange={(e) => updateProduct(product.id, 'amazonUrl', e.target.value)}
                      placeholder="https://www.amazon.com/dp/B08N5WRWNW"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* URL Imagem */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      🖼️ URL Imagem:
                    </label>
                    <input
                      type="url"
                      value={product.imageUrl}
                      onChange={(e) => updateProduct(product.id, 'imageUrl', e.target.value)}
                      placeholder="https://images.amazon.com/images/I/..."
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Descrição */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      📝 Descrição (PT):
                    </label>
                    <input
                      type="text"
                      value={product.description}
                      onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                      placeholder="Whey Protein 1kg - Chocolate"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {product.detectedCategory && (
                      <p className="text-xs text-green-600 mt-1">
                        ✅ Categoria detectada: {product.detectedCategory}
                      </p>
                    )}
                  </div>

                  {/* Preço */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      💰 Preço (USD):
                    </label>
                    <input
                      type="text"
                      value={product.price}
                      onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                      placeholder="$29.99"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Categoria Manual */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      📂 Categoria:
                    </label>
                    <select
                      value={product.categoryId}
                      onChange={(e) => updateProduct(product.id, 'categoryId', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Botões */}
            <div className="flex gap-4">
              <button
                onClick={addProductRow}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                ➕ Adicionar Linha
              </button>

              <button
                onClick={processProducts}
                disabled={isProcessing || products.length === 0}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    🔍 Processar {products.length} Produto(s)
                  </>
                )}
              </button>
            </div>

            {/* Resultados */}
            {results.success > 0 || results.errors.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📊 Resultados do Processamento
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{results.success}</div>
                    <div className="text-sm text-green-700">Produtos Salvos</div>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{results.errors.length}</div>
                    <div className="text-sm text-red-700">Erros</div>
                  </div>
                </div>

                {/* Lista de Erros */}
                {results.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">❌ Erros Encontrados:</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {results.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

