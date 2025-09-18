'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'

export default function PaesProdutosPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Produtos de pães para venda
  const produtosPaes = [
    {
      id: 1,
      nome: 'Pão de Aveia Fit',
      preco: 12.90,
      descricao: 'Pão integral com aveia, rico em fibras e proteínas',
      ingredientes: ['Farinha de aveia', 'Água filtrada', 'Azeite extra virgem', 'Sal marinho', 'Fermento biológico'],
      beneficios: ['Rico em fibras', 'Baixo índice glicêmico', 'Sem conservantes', 'Proteína vegetal'],
      imagem: '/images/pao-aveia.jpg',
      estoque: 'Disponível',
      tempoEntrega: '2-3 dias úteis'
    },
    {
      id: 2,
      nome: 'Pão de Banana Low Carb',
      preco: 15.90,
      descricao: 'Pão sem glúten feito com banana e farinha de amêndoa',
      ingredientes: ['Banana orgânica', 'Farinha de amêndoa', 'Ovos caipiras', 'Canela', 'Fermento'],
      beneficios: ['Sem glúten', 'Baixo carboidrato', 'Rico em potássio', 'Naturalmente doce'],
      imagem: '/images/pao-banana.jpg',
      estoque: 'Disponível',
      tempoEntrega: '2-3 dias úteis'
    },
    {
      id: 3,
      nome: 'Pão de Quinoa',
      preco: 18.90,
      descricao: 'Pão super nutritivo com quinoa e sementes',
      ingredientes: ['Quinoa real', 'Farinha de quinoa', 'Sementes de chia', 'Sementes de linhaça', 'Azeite'],
      beneficios: ['Proteína completa', 'Ômega 3', 'Sem glúten', 'Super nutritivo'],
      imagem: '/images/pao-quinoa.jpg',
      estoque: 'Disponível',
      tempoEntrega: '2-3 dias úteis'
    },
    {
      id: 4,
      nome: 'Pão de Batata Doce',
      preco: 14.90,
      descricao: 'Pão funcional com batata doce e especiarias',
      ingredientes: ['Batata doce orgânica', 'Farinha integral', 'Azeite', 'Canela', 'Noz moscada'],
      beneficios: ['Vitamina A', 'Antioxidantes', 'Energia sustentada', 'Sabor único'],
      imagem: '/images/pao-batata.jpg',
      estoque: 'Disponível',
      tempoEntrega: '2-3 dias úteis'
    }
  ]

  const filteredProdutos = produtosPaes.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleComprarWhatsApp = (produto: any) => {
    const mensagem = `🛒 *Olá! Quero comprar o produto:*\n\n🍞 *${produto.nome}*\n💰 *Preço: R$ ${produto.preco.toFixed(2)}*\n📝 *Descrição:* ${produto.descricao}\n\n📦 *Entrega:* ${produto.tempoEntrega}\n\n✨ *Portal Fit - Produtos Selecionados*`
    const url = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/produtos" className="flex items-center">
              <button className="text-brand-green text-lg font-bold hover:text-brand-greenDark transition-colors">
                ← Voltar
              </button>
            </Link>
            <Logo variant="horizontal" size="sm" />
            <div className="w-16"></div> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-sm mx-auto px-4 py-6">
        {/* Título */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V8Z" fill="#D4A574" stroke="#B8860B" strokeWidth="1.5"/>
              <path d="M6 8H18V10C18 10.5523 17.5523 11 17 11H7C6.44772 11 6 10.5523 6 10V8Z" fill="#E6C085"/>
              <path d="M8 9H16" stroke="#B8860B" strokeWidth="0.8" strokeLinecap="round"/>
              <path d="M8 11H16" stroke="#B8860B" strokeWidth="0.8" strokeLinecap="round"/>
              <path d="M8 13H16" stroke="#B8860B" strokeWidth="0.8" strokeLinecap="round"/>
              <circle cx="9" cy="9.5" r="0.5" fill="#8B4513"/>
              <circle cx="12" cy="10" r="0.5" fill="#8B4513"/>
              <circle cx="15" cy="9.5" r="0.5" fill="#8B4513"/>
              <circle cx="10" cy="12" r="0.5" fill="#8B4513"/>
              <circle cx="14" cy="12" r="0.5" fill="#8B4513"/>
              <path d="M6 8L8 6L10 8V10L8 12L6 10V8Z" fill="#F5DEB3" opacity="0.6"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-brand-text">
            🍞 Pães Fit
          </h1>
          <p className="text-brand-text2 text-sm mt-2">
            Pães saudáveis e nutritivos para o seu dia a dia
          </p>
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar produtos de pães..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        {/* Lista de Produtos */}
        <div className="space-y-4">
          {filteredProdutos.map((produto) => (
            <div key={produto.id} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-start space-x-4">
                {/* Imagem placeholder */}
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-lg flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V8Z" fill="#D4A574" stroke="#B8860B" strokeWidth="1.5"/>
                    <path d="M6 8H18V10C18 10.5523 17.5523 11 17 11H7C6.44772 11 6 10.5523 6 10V8Z" fill="#E6C085"/>
                    <path d="M8 9H16" stroke="#B8860B" strokeWidth="0.8" strokeLinecap="round"/>
                    <path d="M8 11H16" stroke="#B8860B" strokeWidth="0.8" strokeLinecap="round"/>
                    <path d="M8 13H16" stroke="#B8860B" strokeWidth="0.8" strokeLinecap="round"/>
                    <circle cx="9" cy="9.5" r="0.5" fill="#8B4513"/>
                    <circle cx="12" cy="10" r="0.5" fill="#8B4513"/>
                    <circle cx="15" cy="9.5" r="0.5" fill="#8B4513"/>
                    <circle cx="10" cy="12" r="0.5" fill="#8B4513"/>
                    <circle cx="14" cy="12" r="0.5" fill="#8B4513"/>
                    <path d="M6 8L8 6L10 8V10L8 12L6 10V8Z" fill="#F5DEB3" opacity="0.6"/>
                  </svg>
                </div>
                
                {/* Informações do produto */}
                <div className="flex-1">
                  <h3 className="font-bold text-brand-text text-lg mb-2">
                    {produto.nome}
                  </h3>
                  
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-brand-green">
                      R$ {produto.preco.toFixed(2)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-brand-text2 mb-3">
                    {produto.descricao}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      ✅ {produto.estoque}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      📦 {produto.tempoEntrega}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleComprarWhatsApp(produto)}
                    className="w-full bg-green-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>📱</span>
                    Comprar via WhatsApp
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há produtos */}
        {filteredProdutos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-brand-text2">
              Nenhum produto encontrado para "{searchTerm}"
            </p>
          </div>
        )}

        {/* Informação sobre entrega */}
        <div className="mt-8 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="text-center">
            <span className="text-2xl block mb-2">🚚</span>
            <h3 className="font-bold text-brand-text mb-2">Entrega Rápida</h3>
            <p className="text-sm text-brand-text2">
              Todos os pães são feitos frescos e entregues em 2-3 dias úteis na sua casa!
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/produtos" />
    </div>
  )
}
