'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'

export default function ReceitasPage() {
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
            🍽️ Receitas
          </h1>
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar receitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        {/* Categorias de Receitas */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-brand-text mb-4">Escolha o tipo de receita:</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/receitas/doces-fit" className="bg-gradient-to-r from-pink-100 to-pink-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-pink-300 transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl block mb-2">🍰</span>
                <h3 className="font-bold text-sm">Doces Fit</h3>
              </div>
            </Link>
            
            <Link href="/receitas/low-carb" className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-green-300 transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl block mb-2">🥑</span>
                <h3 className="font-bold text-sm">Low Carb</h3>
              </div>
            </Link>
            
            <Link href="/receitas/saladas" className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-green-300 transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl block mb-2">🥗</span>
                <h3 className="font-bold text-sm">Saladas</h3>
              </div>
            </Link>
            
            <Link href="/receitas/receitas-salgadas" className="bg-white rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-gray-200 transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl block mb-2">🍽️</span>
                <h3 className="font-bold text-sm">Receitas Salgadas</h3>
              </div>
            </Link>
            
            <Link href="/receitas/sopas-funcionais" className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-orange-300 transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl block mb-2">🍲</span>
                <h3 className="font-bold text-sm">Sopas Funcionais</h3>
              </div>
            </Link>
            
            <Link href="/receitas/sucos-detox" className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-green-300 transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl block mb-2">🥤</span>
                <h3 className="font-bold text-sm">Sucos Detox</h3>
              </div>
            </Link>
            
            <Link href="/receitas/shots" className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-purple-300 transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl block mb-2">💉</span>
                <h3 className="font-bold text-sm">Shots</h3>
              </div>
            </Link>
            
          </div>
        </div>

        {/* Seção de eBooks */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-brand-text mb-4">📚 eBooks Completos</h2>
          <div className="bg-gradient-to-r from-brand-greenSoft to-brand-greenSoftDark rounded-xl p-6 shadow-lg border border-brand-greenSoft">
            <div className="text-center mb-4">
              <span className="text-4xl block mb-2">📚</span>
              <h3 className="font-bold text-brand-text text-lg mb-2">Coleções Completas</h3>
              <p className="text-brand-textSoft text-sm mb-4">
                eBooks com receitas e guias de dietas completos para seus objetivos
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <span className="text-2xl block mb-1">🍽️</span>
                <h4 className="font-bold text-xs text-brand-text">Receitas</h4>
                <p className="text-xs text-brand-textSoft">Coleções completas</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <span className="text-2xl block mb-1">📚</span>
                <h4 className="font-bold text-xs text-brand-text">Dietas</h4>
                <p className="text-xs text-brand-textSoft">Guias especializados</p>
              </div>
            </div>
            <Link 
              href="/ebooks"
              className="block w-full bg-brand-green text-white py-3 rounded-lg font-bold text-center hover:bg-brand-greenDark transition-colors"
            >
              📚 Ver eBooks Disponíveis
            </Link>
          </div>
        </div>

      </main>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/receitas" />
    </div>
  )
}