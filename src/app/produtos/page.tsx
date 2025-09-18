'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'

export default function ProdutosPage() {
  const [searchTerm, setSearchTerm] = useState('')

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
          <h1 className="text-2xl font-bold text-brand-text">
            🛒 Produtos
          </h1>
          <p className="text-brand-text2 text-sm mt-2">
            Produtos selecionados para sua saúde e bem-estar
          </p>
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        {/* Categorias de Produtos */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-brand-text mb-4">Escolha a categoria:</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/produtos/paes" className="bg-gradient-to-r from-yellow-100 to-orange-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-yellow-300 transform hover:scale-105">
              <div className="text-center">
                <div className="flex justify-center mb-2">
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
                <h3 className="font-bold text-sm">Pães Fit</h3>
                <p className="text-xs text-brand-text2 mt-1">Pães saudáveis</p>
              </div>
            </Link>
            
            <Link href="/produtos/suplementos" className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-blue-300 transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl block mb-2">💊</span>
                <h3 className="font-bold text-sm">Suplementos</h3>
                <p className="text-xs text-brand-text2 mt-1">Vitaminas e minerais</p>
              </div>
            </Link>
            
            <Link href="/produtos/proteinas" className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-green-300 transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl block mb-2">🥤</span>
                <h3 className="font-bold text-sm">Proteínas</h3>
                <p className="text-xs text-brand-text2 mt-1">Whey e vegetais</p>
              </div>
            </Link>
            
            <Link href="/produtos/superfoods" className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-purple-300 transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl block mb-2">🌱</span>
                <h3 className="font-bold text-sm">Superfoods</h3>
                <p className="text-xs text-brand-text2 mt-1">Alimentos funcionais</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Informação sobre compras */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="text-center">
            <span className="text-2xl block mb-2">📱</span>
            <h3 className="font-bold text-brand-text mb-2">Compre via WhatsApp</h3>
            <p className="text-sm text-brand-text2">
              Todos os produtos podem ser adquiridos diretamente pelo WhatsApp com entrega rápida!
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/produtos" />
    </div>
  )
}