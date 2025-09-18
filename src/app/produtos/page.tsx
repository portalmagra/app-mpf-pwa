'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
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
          }
        ]
        setCategories(defaultCategories)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Estados para produtos Amazon
  const [amazonProducts, setAmazonProducts] = useState<unknown[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchMessage, setSearchMessage] = useState('')

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Função para buscar produtos na Amazon
  const searchAmazonProducts = async (query: string) => {
    console.log('🔍 Função searchAmazonProducts chamada com:', query);
    
    if (!query || query.trim().length < 2) {
      console.log('❌ Query muito curta, retornando');
      return;
    }
    
    console.log('✅ Redirecionando para Amazon...');
    
    // Construir URL da Amazon com nossa tag (versão simplificada)
    const amazonSearchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query.trim())}&tag=portalsolutio-20`;
    
    console.log('🔗 URL da Amazon:', amazonSearchUrl);
    
    // Abrir nova aba/janela com a busca na Amazon
    window.open(amazonSearchUrl, '_blank');
    
    // Mostrar mensagem de sucesso
    setSearchMessage(`Buscando os melhores produtos "${query}" para você...`);
    setShowSearchResults(true);
    setAmazonProducts([]);
    setLoadingProducts(false);
  };

  // Buscar produtos quando o usuário pressionar Enter
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    console.log('⌨️ Tecla pressionada:', e.key);
    if (e.key === 'Enter') {
      console.log('🚀 Enter pressionado, chamando busca...');
      searchAmazonProducts(searchTerm);
    }
  };

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
        {/* Hero Section Mínimo Proporcional */}
        <section style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 50%, #f0f9ff 100%)',
          padding: '0.15rem 0',
          textAlign: 'center',
          marginBottom: '0.2rem',
          minHeight: 'auto'
        }} className="hero-section">
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.4rem, 3.8vw, 2.2rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '0.4rem',
              color: '#1f2937'
            }} className="hero-title">
              Compre na Amazon com<br />Nossa Seleção Especializada
            </h1>

            <p style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              marginBottom: '0.4rem',
              color: '#6b7280',
              maxWidth: '500px',
              margin: '0 auto 0.4rem',
              lineHeight: 1.2
            }}>
              Qualidade garantida, preço competitivo. Sem custo adicional para você.
            </p>

            {/* Search Bar Aumentada */}
            <div style={{
              maxWidth: '450px',
              margin: '0 auto 0.2rem',
              position: 'relative'
            }}>
              <input
                type="text"
                placeholder="Buscar produtos Amazon com nossa seleção especializada..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
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
              <button
                onClick={() => {
                  console.log('🔍 Botão da lupa clicado, searchTerm:', searchTerm);
                  searchAmazonProducts(searchTerm);
                }}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  fontSize: '1rem'
                }}
              >
                🔍
              </button>
            </div>
          </div>
        </section>

        {/* Categories Section Ultra-Compacto - Só mostra quando não há busca */}
        {!showSearchResults && (
          <section style={{
            padding: '0.5rem 0',
            background: 'white'
          }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 1rem'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                fontWeight: 800,
                textAlign: 'center',
                marginBottom: '1rem',
                color: '#1f2937'
              }}>
                Nossas Categorias
              </h2>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
                  <p style={{ color: '#6b7280' }}>Carregando categorias...</p>
                </div>
              ) : (
                <>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1rem'
                  }} className="categories-grid">
                    {filteredCategories.map(category => (
                        <Link href={category.id === 'mercado' ? '/mercado' : `/produtos/${category.id}`} key={category.id} style={{ textDecoration: 'none' }}>
                          <div style={{
                            background: category.id === 'mercado' ? 'linear-gradient(135deg, #FFB366, #FF8C42)' : 'white',
                            borderRadius: '16px',
                            padding: '1.2rem',
                            boxShadow: category.id === 'mercado' ? '0 8px 25px rgba(255, 140, 66, 0.3)' : '0 8px 25px rgba(0, 0, 0, 0.1)',
                            border: category.id === 'mercado' ? '2px solid #FF8C42' : '2px solid #f3f4f6',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }} className="category-card">
                            {/* Category Header */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.8rem'
                            }}>
                              <div style={{
                                fontSize: '2.2rem'
                              }}>
                                {category.icon}
                              </div>
                              <div>
                                <h3 style={{
                                  fontSize: '1.2rem',
                                  fontWeight: 700,
                                  color: category.id === 'mercado' ? 'white' : '#1f2937',
                                  marginBottom: '0.3rem'
                                }}>
                                  {category.name}
                                </h3>
                                <p style={{
                                  color: category.id === 'mercado' ? 'rgba(255, 255, 255, 0.9)' : '#6b7280',
                                  fontSize: '0.8rem',
                                  lineHeight: 1.3
                                }}>
                                  {category.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Seção de Resultados da Busca */}
        {showSearchResults && (
          <section style={{
            padding: '2rem 0',
            background: '#f8fafc'
          }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 1rem'
            }}>
              {/* Header dos Resultados */}
              <div style={{
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  fontWeight: 800,
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  🧠 Busca Inteligente - Encontre o Melhor para Você
                </h2>
                <p style={{
                  color: '#6b7280',
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}>
                  Nossa tecnologia inteligente seleciona apenas os melhores produtos para suas necessidades!
                </p>
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem'
                  }}>
                    🎯 Como Funciona Nossa Busca
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    opacity: 0.9,
                    lineHeight: 1.4
                  }}>
                    <strong>1º Qualidade Nutricional</strong> → <strong>2º Reputação da Marca</strong> → <strong>3º Preço Competitivo</strong>
                  </p>
                  <p style={{
                    fontSize: '0.8rem',
                    opacity: 0.8,
                    marginTop: '0.5rem'
                  }}>
                    Produtos reconhecidos no Brasil com benefícios comprovados
                  </p>
                </div>
              </div>

              {/* Loading */}
              {loadingProducts && (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 0'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    marginBottom: '1rem'
                  }}>
                    🔍
                  </div>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '1.1rem'
                  }}>
                    Buscando produtos selecionados especialmente para você...
                  </p>
                </div>
              )}

              {/* Resultados */}
              {!loadingProducts && (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 0'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem'
                  }}>
                    🚀
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#1f2937',
                    marginBottom: '1rem'
                  }}>
                    Busca Realizada na Amazon!
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '1.1rem',
                    marginBottom: '2rem',
                    maxWidth: '600px',
                    margin: '0 auto 2rem',
                    lineHeight: 1.5
                  }}>
                    Encontramos os melhores produtos para você!
                  </p>
                  <div style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    padding: '1.5rem 2rem',
                    borderRadius: '12px',
                    display: 'inline-block',
                    marginBottom: '1.5rem',
                    maxWidth: '500px'
                  }}>
                    <h4 style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      marginBottom: '1rem',
                      textAlign: 'center'
                    }}>
                      🧠 Por que Nossa Busca é Inteligente?
                    </h4>
                    <div style={{
                      fontSize: '1rem',
                      lineHeight: 1.6
                    }}>
                      <p style={{ marginBottom: '0.8rem' }}>
                        <strong>1º Qualidade Garantida</strong> - Validamos apenas produtos de excelência
                      </p>
                      <p style={{ marginBottom: '0.8rem' }}>
                        <strong>2º Reputação da Marca</strong> - Marcas reconhecidas e confiáveis
                      </p>
                      <p style={{ marginBottom: '0.8rem' }}>
                        <strong>3º Melhor Preço</strong> - Você sempre paga o melhor valor
                      </p>
                    </div>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '10px',
                    display: 'inline-block',
                    marginBottom: '1rem'
                  }}>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      margin: 0
                    }}>
                      ✅ Resultados abertos em nova aba da Amazon
                    </p>
                  </div>
                </div>
              )}

              {/* Sem resultados */}
              {!loadingProducts && amazonProducts.length === 0 && searchMessage && (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 0'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem'
                  }}>
                    🔍
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#1f2937',
                    marginBottom: '0.5rem'
                  }}>
                    Nenhum produto encontrado
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    {searchMessage}
                  </p>
                  <button
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchTerm('');
                      setAmazonProducts([]);
                    }}
                    style={{
                      padding: '0.8rem 1.5rem',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    🔄 Nova Busca
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}