'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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

export default function ReceitaPage() {
  const params = useParams()
  const [receita, setReceita] = useState<Receita | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simular busca da receita pelo ID
    const receitaId = params.id as string
    
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
      const receitaEncontrada = mockReceitas.find(r => r.id.toString() === receitaId)
      
      if (receitaEncontrada) {
        setReceita(receitaEncontrada)
      } else {
        setError('Receita não encontrada')
      }
      
      setLoading(false)
    }, 1000)
  }, [params.id])

  const handleAcessarPDF = () => {
    if (receita) {
      window.open(receita.link_pdf, '_blank')
    }
  }

  const handleComprarReceita = () => {
    if (receita) {
      const mensagem = `Oi! Quero comprar a receita "${receita.nome}" por $${receita.preco.toFixed(2)}`
      const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-brand-textLight">Carregando receita...</p>
        </div>
      </div>
    )
  }

  if (error || !receita) {
    return (
      <div className="min-h-screen bg-brand-cream">
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

        <main className="max-w-sm mx-auto px-4 py-6">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-xl font-bold text-brand-text mb-2">
              Receita não encontrada
            </h1>
            <p className="text-brand-textLight mb-6">
              A receita que você está procurando não existe ou foi removida.
            </p>
            <Link href="/receitas">
              <button className="bg-brand-green text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-greenDark transition-colors">
                Ver Todas as Receitas
              </button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
            <Link href="/receitas">
              <button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-greenDark transition-colors">
                📚 Receitas
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-sm mx-auto px-4 py-6">
        {/* Informações da Receita */}
        <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🍽️</div>
            <h1 className="text-2xl font-bold text-brand-text mb-2">
              {receita.nome}
            </h1>
            <p className="text-brand-textLight text-sm leading-relaxed">
              {receita.descricao}
            </p>
          </div>

          {/* Status e Preço */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              {receita.tipo === 'gratuita' ? (
                <span className="bg-brand-green text-white px-3 py-1 rounded-lg text-sm font-medium">
                  GRATUITA
                </span>
              ) : (
                <span className="bg-brand-amber text-white px-3 py-1 rounded-lg text-sm font-medium">
                  PAGA
                </span>
              )}
            </div>
            
            <div className="text-right">
              {receita.tipo === 'paga' ? (
                <div className="text-brand-green font-bold text-xl">
                  ${receita.preco.toFixed(2)}
                </div>
              ) : (
                <div className="text-brand-green font-bold text-xl">
                  Gratuita
                </div>
              )}
            </div>
          </div>

          {/* Botão de Ação */}
          <div className="space-y-3">
            {receita.tipo === 'gratuita' ? (
              <button
                onClick={handleAcessarPDF}
                className="w-full bg-brand-green text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-greenDark transition-colors"
              >
                📄 Acessar Receita Completa
              </button>
            ) : (
              <button
                onClick={handleComprarReceita}
                className="w-full bg-brand-amber text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-amberDark transition-colors"
              >
                💳 Comprar Receita por ${receita.preco.toFixed(2)}
              </button>
            )}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-white rounded-xl p-4 shadow-soft mb-6">
          <h3 className="font-bold text-brand-text mb-3">ℹ️ Informações</h3>
          <div className="space-y-2 text-sm text-brand-textLight">
            <div className="flex justify-between">
              <span>Tipo:</span>
              <span className="font-medium">{receita.tipo === 'gratuita' ? 'Gratuita' : 'Paga'}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium text-brand-green">{receita.status === 'ativa' ? 'Ativa' : 'Inativa'}</span>
            </div>
            <div className="flex justify-between">
              <span>Data de criação:</span>
              <span className="font-medium">{new Date(receita.data_criacao).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* CTA para outras receitas */}
        <div className="bg-gradient-to-r from-brand-green to-brand-blue rounded-xl p-6 text-center text-white">
          <h3 className="font-bold text-lg mb-2">
            🍽️ Mais Receitas Disponíveis
          </h3>
          <p className="text-sm mb-4 opacity-90">
            Explore nossa biblioteca completa de receitas saudáveis e protocolos nutricionais
          </p>
          <Link href="/receitas">
            <button className="bg-white text-brand-green px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Ver Todas as Receitas
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}
