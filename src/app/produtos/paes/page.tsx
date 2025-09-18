'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'
import { productService, Product } from '@/lib/supabase'

export default function PaesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar produtos da categoria "paes" do Supabase
    const loadProducts = async () => {
      try {
        console.log('🔄 Carregando produtos do Supabase...')
        
        // Buscar produtos da categoria paes no Supabase
        const products = await productService.getProductsByCategory('paes')
        
        console.log('✅ Produtos carregados do Supabase:', products?.length || 0, 'produtos')
        console.log('🔍 Dados dos produtos:', products)
        if (products && products.length > 0) {
          console.log('🔍 Slug do primeiro produto:', products[0].slug)
          console.log('🔍 ID do primeiro produto:', products[0].id)
          console.log('🔍 Nome do primeiro produto:', products[0].name)
          console.log('🔍 Categoria do primeiro produto:', products[0].category_id)
        }
        setProducts(products || [])
      } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
    
    // Sincronizar com mudanças de outros dispositivos
    try {
      const channel = new BroadcastChannel('products-update')
      channel.addEventListener('message', () => {
        console.log('🔄 Atualização recebida via BroadcastChannel')
        loadProducts()
      })
      
      return () => {
        channel.close()
      }
    } catch (error) {
      console.log('⚠️ BroadcastChannel não suportado neste navegador')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #96CEB4, #85C1A3)',
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
          background: 'linear-gradient(135deg, #96CEB4, #85C1A3)',
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
              🥖 Pães Fit
            </h1>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Descubra nossa linha de pães saudáveis e nutritivos, feitos com ingredientes naturais 
              e sem conservantes. Cada pão é cuidadosamente elaborado para oferecer sabor e saúde 
              em cada mordida.
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
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥖</div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
                  Produtos em breve!
                </h2>
                <p style={{ color: '#666', fontSize: '1rem' }}>
                  Estamos preparando nossa linha de pães fit. Em breve você encontrará aqui 
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
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #96CEB4, #85C1A3)',
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
                        background: '#f0f9ff',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        marginBottom: '1rem',
                        textAlign: 'center'
                      }}>
                        <span style={{
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          color: '#1e40af'
                        }}>
                          {product.current_price}
                        </span>
                      </div>
                    )}

                    {product.benefits && product.benefits.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          color: '#333',
                          marginBottom: '0.5rem'
                        }}>
                          Benefícios:
                        </h4>
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0
                        }}>
                          {product.benefits.slice(0, 3).map((benefit, index) => (
                            <li key={index} style={{
                              fontSize: '0.85rem',
                              color: '#666',
                              marginBottom: '0.25rem',
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              <span style={{ color: '#96CEB4', marginRight: '0.5rem' }}>✓</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
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
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 149, 0, 0.4)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 149, 0, 0.3)'
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

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/produtos" />
    </div>
  )
}
