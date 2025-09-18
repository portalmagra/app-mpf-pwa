'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'
import { productService, Product } from '@/lib/supabase'

export default function ImunidadePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('🔄 Carregando produtos do Supabase...')
        const products = await productService.getProductsByCategory('imunidade')
        console.log('✅ Produtos carregados do Supabase:', products?.length || 0, 'produtos')
        setProducts(products || [])
      } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
        padding: '1rem 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/produtos" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'white'
          }}>
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>←</span>
            <span style={{ fontWeight: 'bold' }}>Voltar</span>
          </Link>
          <Logo />
          <div style={{ width: '60px' }}></div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
          padding: '3rem 0',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              🛡️ Imunidade
            </h1>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Vitaminas, minerais e suplementos naturais para fortalecer 
              o sistema imunológico e proteger sua saúde.
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section style={{
          padding: '2rem 0',
          background: 'white'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem'
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
                <p style={{ fontSize: '1.1rem', color: '#666' }}>Carregando produtos...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
                  Produtos em breve!
                </h2>
                <p style={{ color: '#666', fontSize: '1rem' }}>
                  Estamos preparando nossa linha de produtos para imunidade. Em breve você encontrará aqui 
                  produtos selecionados especialmente para você.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem'
              }}>
                {products.map((product) => (
                  <div key={product.id} style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1rem',
                      textAlign: 'center'
                    }}>
                      <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: 0,
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                      }}>
                        {product.name}
                      </h3>
                    </div>
                    
                    <p style={{
                      color: '#666',
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                      marginBottom: '1rem'
                    }}>
                      {product.description}
                    </p>

                    {product.current_price && (
                      <div style={{
                        background: '#ecfeff',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        marginBottom: '1rem',
                        textAlign: 'center'
                      }}>
                        <span style={{
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          color: '#0891b2'
                        }}>
                          {product.current_price}
                        </span>
                      </div>
                    )}

                    <Link
                      href={product.amazon_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        background: 'linear-gradient(135deg, #FF9500, #FF8C00)',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(255, 149, 0, 0.3)'
                      }}
                    >
                      🛒 Ver na Amazon
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNavigation currentPage="/produtos" />
    </div>
  )
}
