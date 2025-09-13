'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

interface Receita {
  id: number
  nome: string
  descricao: string
  tipo: 'gratuita' | 'paga'
  preco: number
  link_pdf: string
  status: 'ativa' | 'inativa'
  data_criacao: string
}

export default function ReceitasPage() {
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data para demonstração
    const mockReceitas: Receita[] = [
      {
        id: 1,
        nome: "Smoothie Verde Detox",
        descricao: "Bebida refrescante rica em clorofila e antioxidantes para desintoxicar o organismo",
        tipo: "gratuita",
        preco: 0,
        link_pdf: "https://drive.google.com/file/d/abc123",
        status: "ativa",
        data_criacao: "2024-01-15"
      },
      {
        id: 2,
        nome: "Bowl Energético com Quinoa",
        descricao: "Refeição completa e nutritiva perfeita para dar energia durante o dia",
        tipo: "paga",
        preco: 1.99,
        link_pdf: "https://drive.google.com/file/d/def456",
        status: "ativa",
        data_criacao: "2024-01-16"
      },
      {
        id: 3,
        nome: "Sopa Anti-inflamatória",
        descricao: "Sopa reconfortante com ingredientes que combatem inflamações",
        tipo: "paga",
        preco: 2.99,
        link_pdf: "https://drive.google.com/file/d/ghi789",
        status: "ativa",
        data_criacao: "2024-01-17"
      }
    ]
    
    setTimeout(() => {
      setReceitas(mockReceitas)
      setLoading(false)
    }, 1000)
  }, [])

  const handleComprarReceita = (receita: Receita) => {
    const mensagem = `Oi! Quero comprar a receita "${receita.nome}" por $${receita.preco.toFixed(2)}`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleAcessarReceita = (receita: Receita) => {
    if (receita.tipo === 'gratuita') {
      window.open(receita.link_pdf, '_blank')
    } else {
      handleComprarReceita(receita)
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
            <Link href="/">
              <button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-greenDark transition-colors">
                🏠 Início
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-sm mx-auto px-4 py-6">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-text mb-2">
            🍽️ Receitas & Protocolos
          </h1>
          <p className="text-brand-textLight text-sm">
            Receitas saudáveis e protocolos nutricionais personalizados para brasileiros nos EUA
          </p>
        </div>

        {/* Busca */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 O que você quer cozinhar hoje?"
              className="w-full px-4 py-3 bg-white border border-brand-green/20 rounded-xl text-brand-text placeholder-brand-textLight focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button className="px-4 py-2 bg-brand-green text-white rounded-lg text-sm font-medium whitespace-nowrap">
              Todas
            </button>
            <button className="px-4 py-2 bg-white border border-brand-green/20 text-brand-text rounded-lg text-sm font-medium whitespace-nowrap">
              Gratuitas
            </button>
            <button className="px-4 py-2 bg-white border border-brand-green/20 text-brand-text rounded-lg text-sm font-medium whitespace-nowrap">
              Pagas
            </button>
          </div>
        </div>

        {/* Lista de Receitas */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-soft animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {receitas.map((receita) => (
              <div key={receita.id} className="bg-white rounded-xl p-4 shadow-soft">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-brand-text text-lg mb-1">
                      {receita.nome}
                    </h3>
                    <p className="text-brand-textLight text-sm leading-relaxed">
                      {receita.descricao}
                    </p>
                  </div>
                  {receita.tipo === 'gratuita' && (
                    <span className="bg-brand-green text-white px-2 py-1 rounded-lg text-xs font-medium ml-2">
                      GRÁTIS
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {receita.tipo === 'paga' ? (
                      <span className="text-brand-green font-bold text-lg">
                        ${receita.preco.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-brand-green font-bold text-lg">
                        Gratuita
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleAcessarReceita(receita)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      receita.tipo === 'gratuita'
                        ? 'bg-brand-green text-white hover:bg-brand-greenDark'
                        : 'bg-brand-amber text-white hover:bg-brand-amberDark'
                    }`}
                  >
                    {receita.tipo === 'gratuita' ? 'Ver Receita' : 'Comprar Receita'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Final */}
        <div className="mt-8 bg-gradient-to-r from-brand-green to-brand-blue rounded-xl p-6 text-center text-white">
          <h3 className="font-bold text-lg mb-2">
            🎯 Protocolos Nutricionais Completos
          </h3>
          <p className="text-sm mb-4 opacity-90">
            Planos de 7, 14 ou 30 dias com receitas, cardápios e acompanhamento personalizado
          </p>
          <button
            onClick={() => {
              const mensagem = "Oi! Quero saber mais sobre os protocolos nutricionais completos"
              const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`
              window.open(whatsappUrl, '_blank')
            }}
            className="bg-white text-brand-green px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Conhecer Protocolos
          </button>
        </div>
      </main>
    </div>
  )
}
