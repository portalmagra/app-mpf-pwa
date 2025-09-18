'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { productService, Product } from '@/lib/supabase'

interface ProductPageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Desempacotar params usando React.use()
  const resolvedParams = use(params)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        console.log('🔄 Carregando produto:', resolvedParams.slug, 'da categoria:', resolvedParams.category)
        
        // Buscar produto no Supabase por slug ou ID
        console.log('🔍 Buscando produto com:', {
          category: resolvedParams.category,
          slug: resolvedParams.slug
        })
        
        let products = await productService.getProductsByCategory(resolvedParams.category)
        
        console.log('🔍 Todos os produtos da categoria:', products)
        
        // Procurar produto por slug ou ID
        let foundProduct = products.find(p => p.slug === resolvedParams.slug)
        
        if (!foundProduct) {
          console.log('🔄 Tentando buscar por ID...')
          foundProduct = products.find(p => p.id === resolvedParams.slug)
        }
        
        if (foundProduct) {
          console.log('✅ Produto encontrado:', foundProduct)
          setProduct(foundProduct)
        } else {
          console.log('❌ Produto não encontrado')
          setError('Produto não encontrado')
        }
      } catch (error) {
        console.error('❌ Erro ao carregar produto:', error)
        setError('Erro ao carregar produto')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [resolvedParams.category, resolvedParams.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Logo variant="horizontal" size="md" />
              <div className="flex items-center space-x-4">
                <Link href="/produtos" className="text-sm text-gray-600 hover:text-brand-green transition-colors">
                  ← Voltar aos Produtos
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
          <p>Carregando produto...</p>
        </main>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Logo variant="horizontal" size="md" />
              <div className="flex items-center space-x-4">
                <Link href="/produtos" className="text-sm text-gray-600 hover:text-brand-green transition-colors">
                  ← Voltar aos Produtos
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <main style={{ 
          padding: '2rem', 
          textAlign: 'center',
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem',
            color: '#374151'
          }}>
            Produto não encontrado
          </h1>
          <p style={{ 
            fontSize: '1rem', 
            marginBottom: '2rem',
            color: '#6b7280'
          }}>
            O produto que você está procurando não foi encontrado.
          </p>
          <Link href={`/produtos/${resolvedParams.category}`}>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              ← Voltar à Categoria {resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1)}
            </button>
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="horizontal" size="md" />
            <div className="flex items-center space-x-4">
              <Link href="/produtos" className="text-sm text-gray-600 hover:text-brand-green transition-colors">
                ← Voltar aos Produtos
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem' }}>
          <Link href="/produtos" style={{ color: '#3b82f6', textDecoration: 'none' }}>
            Produtos
          </Link>
          {' > '}
          <Link href={`/produtos/${resolvedParams.category}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
            {resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1)}
          </Link>
          {' > '}
          <span style={{ color: '#6b7280' }}>{product.name}</span>
        </nav>

        {/* Product Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Product Image */}
          <div>
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: 'auto',
                  borderRadius: '0.5rem'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                maxWidth: '400px',
                height: '300px',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280'
              }}>
                Sem imagem
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#1f2937'
            }}>
              {product.name}
            </h1>
            
            <p style={{
              fontSize: '1.1rem',
              marginBottom: '1rem',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              {product.description}
            </p>

            {/* Price */}
            {product.current_price && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#059669'
                }}>
                  {product.current_price}
                </span>
                {product.original_price && product.original_price !== product.current_price && (
                  <span style={{
                    fontSize: '1rem',
                    color: '#6b7280',
                    textDecoration: 'line-through',
                    marginLeft: '0.5rem'
                  }}>
                    {product.original_price}
                  </span>
                )}
              </div>
            )}

            {/* Rating */}
            {product.rating && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ color: '#f59e0b' }}>
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                </span>
                <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>
                  ({product.review_count || 0} avaliações)
                </span>
              </div>
            )}

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Benefícios:
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {product.benefits.map((benefit: string, index: number) => (
                    <li key={index} style={{ 
                      marginBottom: '0.25rem',
                      paddingLeft: '1rem',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#059669'
                      }}>✓</span>
                      {benefit.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Características:
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} style={{ 
                      marginBottom: '0.25rem',
                      paddingLeft: '1rem',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#3b82f6'
                      }}>•</span>
                      {feature.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {product.amazon_url && (
                <a 
                  href={product.amazon_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#ff9900',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  🛒 Comprar na Amazon
                </a>
              )}
              
              <Link href={`/produtos/${resolvedParams.category}`}>
                <button style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}>
                  ← Voltar à Categoria
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '2rem',
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1f2937'
          }}>
            Informações Importantes
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>
                🏷️ Categoria
              </h3>
              <p style={{ color: '#6b7280' }}>
                {resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1)}
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>
                📅 Data de Cadastro
              </h3>
              <p style={{ color: '#6b7280' }}>
                {new Date(product.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            {product.is_mentoria && (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>
                  🎓 Produto de Mentoria
                </h3>
                <p style={{ color: '#6b7280' }}>
                  Este produto faz parte do programa de mentoria
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1f2937'
          }}>
            Produtos Relacionados
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Explore outros produtos da mesma categoria
          </p>
          <Link href={`/produtos/${resolvedParams.category}`}>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              Ver Todos os Produtos da Categoria
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}
