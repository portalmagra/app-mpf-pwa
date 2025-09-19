'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  amazon_url: string;
  current_price: string;
  original_price: string;
  rating: number;
  review_count: number;
  image_url: string;
  benefits: string[];
  features: string[];
  slug?: string;
}

export default function FadigaPage() {
  const [language, setLanguage] = useState<'pt' | 'es' | 'en'>('pt')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar produtos da categoria "fadiga" do Supabase
    const loadProducts = async () => {
      try {
        console.log('🔄 Carregando produtos do Supabase...')
        
        // Buscar produtos da categoria fadiga no Supabase
        const { data: products, error } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', 'fadiga')
        
        if (error) {
          console.error('❌ Erro ao carregar produtos do Supabase:', error)
          // Fallback para localStorage se Supabase falhar
          const storedProducts = localStorage.getItem('adminProducts') || localStorage.getItem('globalProducts')
          if (storedProducts) {
            const allProducts = JSON.parse(storedProducts)
            const fadigaProducts = allProducts.filter((product: any) => 
              product.categoryId === 'fadiga'
            )
            console.log('🔄 Fallback para localStorage:', fadigaProducts.length, 'produtos')
            setProducts(fadigaProducts)
          }
        } else {
          console.log('✅ Produtos carregados do Supabase:', products?.length || 0, 'produtos')
          console.log('🔍 Dados dos produtos:', products)
          if (products && products.length > 0) {
            console.log('🔍 Slug do primeiro produto:', products[0].slug)
            console.log('🔍 ID do primeiro produto:', products[0].id)
            console.log('🔍 Nome do primeiro produto:', products[0].name)
            console.log('🔍 Categoria do primeiro produto:', products[0].category_id)
          }
          setProducts(products || [])
        }
      } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error)
        // Fallback para localStorage
        const storedProducts = localStorage.getItem('adminProducts') || localStorage.getItem('globalProducts')
        if (storedProducts) {
          const allProducts = JSON.parse(storedProducts)
          const fadigaProducts = allProducts.filter((product: any) => 
            product.categoryId === 'fadiga'
          )
          setProducts(fadigaProducts)
        }
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
    
    // Sincronizar com mudanças de outros dispositivos
    try {
      const channel = new BroadcastChannel('admin-sync')
      console.log('📡 Escutando sincronização na página fadiga')
      
      channel.onmessage = (event) => {
        console.log('📨 Mensagem recebida:', event.data.type, event.data.action || '')
        if (event.data.type === 'products-updated') {
          // Recarregar do Supabase quando houver mudanças
          loadProducts()
        }
      }
      
      return () => {
        console.log('🔌 Fechando canal de sincronização')
        channel.close()
      }
    } catch (error) {
      console.log('❌ BroadcastChannel não suportado na página fadiga:', error)
    }
  }, [])

  return (
    <>
      <main style={{ padding: '0', background: 'white' }}>
        {/* Header Unificado */}

        {/* Hero Section Mínimo Proporcional */}
        <section style={{
          background: 'linear-gradient(135deg, #FAD7A0, #e67e22)',
          padding: '0.15rem 0',
          textAlign: 'center',
          marginBottom: '0.2rem',
          minHeight: 'auto'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: 'bold' }}>
              😴 Suporte para Fadiga
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>
              Produtos para combater cansaço e fadiga
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/analise" style={{
                padding: '15px 30px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                border: '2px solid rgba(255,255,255,0.3)',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}>
                🧠 Avaliação Personalizada
              </Link>
              <Link href="/produtos" style={{
                padding: '15px 30px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                border: '2px solid rgba(255,255,255,0.3)',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}>
                🛍️ Ver Todas as Categorias
              </Link>
            </div>
          </div>
        </section>

        {/* Conteúdo Principal */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p>Carregando produtos...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2 style={{ color: '#333', marginBottom: '20px' }}>
                😴 Nenhum produto adicionado ainda para esta categoria
              </h2>
              <p style={{ color: '#666', marginBottom: '30px', fontSize: '1.1rem' }}>
                Produtos para combater cansaço e fadiga
              </p>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/analise" style={{
                  padding: '15px 30px',
                  backgroundColor: '#FAD7A0, #e67e22',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}>
                  🧠 Fazer Avaliação Personalizada
                </Link>
                <Link href="/produtos" style={{
                  padding: '15px 30px',
                  backgroundColor: '#e67e22',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}>
                  🔍 Buscar Produtos
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '40px', fontSize: '2rem' }}>
                😴 Produtos Disponíveis
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {products.map((product) => (
                  <div key={product.id} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '25px',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}>
                    <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '1.3rem', fontWeight: 'bold' }}>
                      {product.name}
                    </h3>
                    
                    <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>
                      {product.description}
                    </p>

                    {product.image_url && (
                      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            maxHeight: '200px'
                          }}
                        />
                      </div>
                    )}

                    <div style={{ marginBottom: '20px' }}>
                      <div>
                        <p style={{ color: '#333', fontWeight: 'bold', fontSize: '1.2rem' }}>
                          💰 {product.current_price}
                        </p>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>
                          ⭐ {product.rating}/5 ({product.review_count} avaliações)
                        </p>
                      </div>
                    </div>

                    {product.benefits && product.benefits.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>✅ Benefícios:</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
                          {product.benefits.map((benefit, index) => (
                            <li key={index} style={{ marginBottom: '5px' }}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {product.features && product.features.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>🔧 Características:</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
                          {product.features.map((feature, index) => (
                            <li key={index} style={{ marginBottom: '5px' }}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginTop: 'auto'
                    }}>
                      <a 
                        href={`/produtos/fadiga/${product.slug || product.id}`} 
                        style={{ 
                          textDecoration: 'none', 
                          flex: 1,
                          display: 'block',
                          cursor: 'pointer'
                        }}
                      >
                        <button style={{
                          width: '100%',
                          padding: '0.8rem',
                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem'
                        }}>
                          <span>📄</span>
                          <span>Ver Detalhes</span>
                        </button>
                      </a>
                      
                      <a
                        href={product.amazon_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', flex: 1 }}
                      >
                        <button style={{
                          width: '100%',
                          padding: '0.8rem',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem'
                        }}>
                          <span>🛒</span>
                          <span>Amazon</span>
                        </button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}