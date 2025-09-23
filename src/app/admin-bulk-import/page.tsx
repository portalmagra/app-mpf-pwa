'use client'

import { useState, useEffect } from 'react'
import { productService, categoryService } from '@/lib/supabase'

interface ProductData {
  name: string
  description: string
  amazon_url: string
  current_price: string
  rating: number
  review_count: number
  image_url: string
  asin: string
  category_id: string
}

interface Category {
  id: string
  name: string
}

export default function BulkImportPage() {
  const [links, setLinks] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<{
    success: number
    errors: string[]
    processed: ProductData[]
  }>({ success: 0, errors: [], processed: [] })
  const [showResults, setShowResults] = useState(false)

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

  const processLinks = async () => {
    if (!links.trim() || !selectedCategory) {
      alert('Por favor, cole os links e escolha uma categoria!')
      return
    }

    setIsProcessing(true)
    setResults({ success: 0, errors: [], processed: [] })

    const linkList = links.split('\n').filter(link => link.trim())
    
    try {
      // Chamar API real para extrair dados da Amazon
      const response = await fetch('/api/extract-amazon-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ links: linkList }),
      })

      if (!response.ok) {
        throw new Error('Erro ao processar links')
      }

      const data = await response.json()
      const processed: ProductData[] = []
      const errors: string[] = []

      for (const result of data.results) {
        if (result.success) {
          const product: ProductData = {
            name: result.name,
            description: result.description,
            amazon_url: `https://meuportalfit.com/link/${result.asin}`,
            current_price: result.price,
            rating: result.rating,
            review_count: result.reviewCount,
            image_url: result.imageUrl,
            asin: result.asin,
            category_id: selectedCategory
          }
          processed.push(product)
        } else {
          errors.push(result.error)
        }
      }

      setResults({
        success: processed.length,
        errors,
        processed
      })
      setShowResults(true)
    } catch (error) {
      console.error('Erro ao processar links:', error)
      alert('Erro ao processar links. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  const saveProducts = async () => {
    if (results.processed.length === 0) return

    setIsProcessing(true)
    let successCount = 0
    const errors: string[] = []

    for (const product of results.processed) {
      try {
        const productToCreate = {
          id: `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: product.name,
          description: product.description,
          category_id: product.category_id,
          amazon_url: product.amazon_url,
          current_price: product.current_price,
          rating: product.rating,
          review_count: product.review_count,
          image_url: product.image_url,
          benefits: [], // Removido benefícios genéricos
          features: [], // Removido características genéricas
          slug: generateSlug(product.name),
          is_curated: true,
          quiz_keywords: [],
          priority_score: 50
        }

        const result = await productService.createProduct(productToCreate)
        if (result) {
          successCount++
        } else {
          errors.push(`Erro ao salvar: ${product.name}`)
        }
      } catch (error) {
        errors.push(`Erro ao salvar ${product.name}: ${error}`)
      }
    }

    alert(`✅ ${successCount} produtos salvos com sucesso!\n❌ ${errors.length} erros encontrados.`)
    
    if (successCount > 0) {
      setLinks('')
      setResults({ success: 0, errors: [], processed: [] })
      setShowResults(false)
    }
    
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            📦 Importação em Massa - Produtos Amazon
          </h1>

          <div className="space-y-6">
            {/* Seleção de Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📂 Categoria para todos os produtos:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Área de Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔗 Cole os links da Amazon (um por linha):
              </label>
              <textarea
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                placeholder="https://www.amazon.com.br/dp/B08N5WRWNW&#10;https://www.amazon.com.br/dp/B07XJ8C8F5&#10;https://www.amazon.com.br/dp/B08N5WRWNW"
                className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Cole um link por linha. O sistema extrairá automaticamente o ASIN e criará o link afiliado.
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-4">
              <button
                onClick={processLinks}
                disabled={isProcessing || !links.trim() || !selectedCategory}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    🔍 Processar Links
                  </>
                )}
              </button>
            </div>

            {/* Resultados */}
            {showResults && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📊 Resultados da Processamento
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{results.success}</div>
                    <div className="text-sm text-green-700">Produtos Processados</div>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{results.errors.length}</div>
                    <div className="text-sm text-red-700">Erros</div>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{results.processed.length}</div>
                    <div className="text-sm text-blue-700">Prontos para Salvar</div>
                  </div>
                </div>

                {/* Lista de Produtos Processados */}
                {results.processed.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">✅ Produtos Processados:</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {results.processed.map((product, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white rounded border">
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{product.name}</div>
                            <div className="text-xs text-gray-500">ASIN: {product.asin}</div>
                          </div>
                          <div className="text-sm font-medium text-green-600">{product.current_price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lista de Erros */}
                {results.errors.length > 0 && (
                  <div className="mb-6">
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

                {/* Botão Salvar */}
                {results.processed.length > 0 && (
                  <button
                    onClick={saveProducts}
                    disabled={isProcessing}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        💾 Salvar {results.processed.length} Produtos
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}