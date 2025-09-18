'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'
import { categoryService, Category } from '@/lib/supabase'

export default function ProdutosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log('🔄 Carregando categorias do Supabase...')
        const supabaseCategories = await categoryService.getAllCategories()
        console.log('✅ Categorias carregadas:', supabaseCategories?.length || 0)
        
        // Ordenar categorias para colocar "mercado" em primeiro lugar
        const sortedCategories = (supabaseCategories || []).sort((a, b) => {
          if (a.id === 'mercado') return -1
          if (b.id === 'mercado') return 1
          return a.name.localeCompare(b.name)
        })
        
        setCategories(sortedCategories)
      } catch (error) {
        console.error('❌ Erro ao carregar categorias:', error)
        // Fallback para categorias padrão
        const defaultCategories: Category[] = [
          {
            id: 'mercado',
            name: 'Mercado',
            description: 'Produtos selecionados para o mercado',
            icon: '🛒',
            color: '#FFB366',
            created_at: new Date().toISOString()
          },
          {
            id: 'emagrecimento',
            name: 'Emagrecimento',
            description: 'Produtos naturais para perda de peso saudável',
            icon: '🔥',
            color: '#96CEB4',
            created_at: new Date().toISOString()
          },
          {
            id: 'ansiedade',
            name: 'Ansiedade',
            description: 'Produtos naturais para controle da ansiedade',
            icon: '🧘',
            color: '#A8E6CF',
            created_at: new Date().toISOString()
          },
          {
            id: 'cafe',
            name: 'Café e Bebidas',
            description: 'Cafés especiais e bebidas saudáveis',
            icon: '☕',
            color: '#D4A574',
            created_at: new Date().toISOString()
          },
          {
            id: 'cozinha',
            name: 'Cozinha Saudável',
            description: 'Utensílios, eletrodomésticos e acessórios para uma cozinha funcional e saudável',
            icon: '🍳',
            color: '#FF6B6B',
            created_at: new Date().toISOString()
          },
          {
            id: 'energia',
            name: 'Energia e Disposição',
            description: 'Suplementos e produtos naturais para aumentar energia, melhorar disposição e combater o cansaço',
            icon: '⚡',
            color: '#FFA726',
            created_at: new Date().toISOString()
          },
          {
            id: 'homens',
            name: 'Homens',
            description: 'Produtos específicos para saúde e bem-estar masculino',
            icon: '💪',
            color: '#42A5F5',
            created_at: new Date().toISOString()
          },
          {
            id: 'hormonal',
            name: 'Hormonal',
            description: 'Produtos para equilíbrio hormonal e saúde endócrina',
            icon: '⚖️',
            color: '#AB47BC',
            created_at: new Date().toISOString()
          },
          {
            id: 'imunidade',
            name: 'Imunidade',
            description: 'Vitaminas, minerais e suplementos naturais para fortalecer o sistema imunológico e proteger sua saúde',
            icon: '🛡️',
            color: '#26A69A',
            created_at: new Date().toISOString()
          },
          {
            id: 'intestino',
            name: 'Intestino',
            description: 'Produtos para saúde intestinal e digestão',
            icon: '🔄',
            color: '#8BC34A',
            created_at: new Date().toISOString()
          },
          {
            id: 'paes',
            name: 'Pães Fit',
            description: 'Pães saudáveis e nutritivos',
            icon: '🥖',
            color: '#96CEB4',
            created_at: new Date().toISOString()
          }
        ]
        setCategories(defaultCategories)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
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

      <main style={{ padding: '0', background: 'white' }}>
        {/* Hero Section Simplificado */}
        <section style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 50%, #f0f9ff 100%)',
          padding: '2rem 0',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              🛒 Produtos por Categoria
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              marginBottom: '1rem',
              color: '#6b7280',
              maxWidth: '500px',
              margin: '0 auto 1rem',
              lineHeight: 1.3
            }}>
              Suplementos e produtos selecionados especialmente para brasileiros nos EUA
            </p>

            {/* Search Bar para Categorias */}
            <div style={{
              maxWidth: '450px',
              margin: '0 auto 1rem',
              position: 'relative'
            }}>
              <input
                type="text"
                placeholder="Buscar categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '25px',
                  fontSize: '0.9rem',
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              />
              <div style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                fontSize: '1rem'
              }}>
                🔍
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section style={{
          padding: '0.5rem 0',
          background: 'white'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem'
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
                <p>Carregando categorias...</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                {filteredCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.id === 'mercado' ? '/mercado' : `/produtos/${category.id}`}
                    style={{
                      background: category.id === 'mercado' ? 'linear-gradient(135deg, #FFB366, #FF8C42)' : `linear-gradient(135deg, ${category.color}20, ${category.color}10)`,
                      border: category.id === 'mercado' ? '2px solid #FF8C42' : `2px solid ${category.color}40`,
                      borderRadius: '12px',
                      padding: '1.5rem',
                      textDecoration: 'none',
                      color: category.id === 'mercado' ? 'white' : '#1f2937',
                      transition: 'all 0.3s ease',
                      boxShadow: category.id === 'mercado' ? '0 4px 16px rgba(255, 140, 66, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = category.id === 'mercado' ? '0 6px 20px rgba(255, 140, 66, 0.4)' : '0 4px 16px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = category.id === 'mercado' ? '0 4px 16px rgba(255, 140, 66, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>
                        {category.icon}
                      </span>
                      <h3 style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        margin: 0
                      }}>
                        {category.name}
                      </h3>
                    </div>
                    <p style={{
                      color: category.id === 'mercado' ? 'rgba(255,255,255,0.9)' : '#6b7280',
                      fontSize: '0.9rem',
                      margin: 0,
                      lineHeight: 1.4
                    }}>
                      {category.description}
                    </p>
                  </Link>
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
