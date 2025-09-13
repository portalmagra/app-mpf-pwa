'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Mercado() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Todos', icon: '🛒' },
    { id: 'suplementos', name: 'Suplementos', icon: '💊' },
    { id: 'alimentos', name: 'Alimentos', icon: '🥗' },
    { id: 'cosmeticos', name: 'Cosméticos', icon: '💄' },
    { id: 'fitness', name: 'Fitness', icon: '🏋️' }
  ]

  const mockProducts = [
    {
      id: 1,
      name: 'Multivitamínico para Mulheres',
      price: 29.99,
      originalPrice: 39.99,
      category: 'suplementos',
      image: '💊',
      link: 'https://amazon.com/multivitamin',
      rating: 4.5,
      reviews: 1234,
      description: 'Multivitamínico completo para mulheres brasileiras nos EUA'
    },
    {
      id: 2,
      name: 'Proteína em Pó Vegana',
      price: 39.99,
      originalPrice: 49.99,
      category: 'suplementos',
      image: '🥤',
      link: 'https://amazon.com/protein',
      rating: 4.8,
      reviews: 856,
      description: 'Proteína vegetal de alta qualidade'
    },
    {
      id: 3,
      name: 'Açaí Bowl Mix',
      price: 19.99,
      originalPrice: 24.99,
      category: 'alimentos',
      image: '🥣',
      link: 'https://amazon.com/acai',
      rating: 4.3,
      reviews: 567,
      description: 'Mistura para bowl de açaí autêntico'
    },
    {
      id: 4,
      name: 'Óleo de Coco Orgânico',
      price: 15.99,
      originalPrice: 19.99,
      category: 'alimentos',
      image: '🥥',
      link: 'https://amazon.com/coconut-oil',
      rating: 4.6,
      reviews: 2341,
      description: 'Óleo de coco extra virgem orgânico'
    },
    {
      id: 5,
      name: 'Hidratante Facial Brasileiro',
      price: 24.99,
      originalPrice: 29.99,
      category: 'cosmeticos',
      image: '🧴',
      link: 'https://amazon.com/moisturizer',
      rating: 4.4,
      reviews: 789,
      description: 'Hidratante com ingredientes brasileiros'
    },
    {
      id: 6,
      name: 'Resistência para Exercícios',
      price: 34.99,
      originalPrice: 44.99,
      category: 'fitness',
      image: '🏋️',
      link: 'https://amazon.com/resistance-bands',
      rating: 4.7,
      reviews: 1456,
      description: 'Kit completo de resistência para casa'
    }
  ]

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
            <Link href="/" className="text-gray-600 text-sm font-medium">
              🏠 Início
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-6 text-center">
        <div className="max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            🛒 Mercado
          </h1>
          <p className="text-gray-600 text-sm">
            Produtos selecionados Amazon para brasileiros nos EUA
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Buscar produtos... (ex: suplementos, açaí, cosméticos)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none text-gray-700 placeholder-gray-400"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              {searchQuery ? '✨' : '🤖'}
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gray-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="space-y-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-start space-x-4">
                  <span className="text-4xl">{product.image}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-800">R$ {product.price}</span>
                        <span className="text-sm text-gray-500 line-through">R$ {product.originalPrice}</span>
                      </div>
                      
                      <a 
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        Comprar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-sm mx-auto flex justify-around">
          <Link href="/" className="flex flex-col items-center py-1 text-gray-400">
            <span className="text-lg">🏠</span>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/receitas" className="flex flex-col items-center py-1 text-gray-400">
            <span className="text-lg">🍲</span>
            <span className="text-xs">Receitas</span>
          </Link>
          <Link href="/protocolos" className="flex flex-col items-center py-1 text-gray-400">
            <span className="text-lg">📋</span>
            <span className="text-xs">Protocolos</span>
          </Link>
          <Link href="/avaliacao" className="flex flex-col items-center py-1 text-gray-400">
            <span className="text-lg">🧠</span>
            <span className="text-xs">Avaliação</span>
          </Link>
          <button className="flex flex-col items-center py-1 text-gray-600">
            <span className="text-lg">🛒</span>
            <span className="text-xs font-semibold">Mercado</span>
          </button>
        </div>
      </div>
    </div>
  )
}
