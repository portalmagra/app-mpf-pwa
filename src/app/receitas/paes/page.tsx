'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'

export default function PaesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Receitas de pães mock - você pode substituir por dados do Supabase depois
  const receitasPaes = [
    {
      id: 1,
      nome: 'Pão de Aveia Fit',
      tempo: '45 min',
      dificuldade: 'Fácil',
      porcoes: '8 fatias',
      imagem: '/images/pao-aveia.jpg',
      ingredientes: [
        '2 xícaras de farinha de aveia',
        '1 xícara de água morna',
        '1 colher de sopa de azeite',
        '1 colher de chá de sal',
        '1 colher de chá de fermento biológico',
        '1 colher de sopa de mel'
      ],
      preparo: [
        'Misture a farinha de aveia com o sal',
        'Dissolva o fermento na água morna com o mel',
        'Adicione o azeite e misture bem',
        'Deixe descansar por 30 minutos',
        'Asse em forno preaquecido a 180°C por 25 minutos'
      ]
    },
    {
      id: 2,
      nome: 'Pão de Banana Low Carb',
      tempo: '35 min',
      dificuldade: 'Fácil',
      porcoes: '6 fatias',
      imagem: '/images/pao-banana.jpg',
      ingredientes: [
        '2 bananas maduras',
        '2 ovos',
        '1/2 xícara de farinha de amêndoa',
        '1 colher de chá de fermento',
        '1 colher de sopa de canela',
        '1 pitada de sal'
      ],
      preparo: [
        'Amasse as bananas até ficarem bem pastosas',
        'Misture com os ovos batidos',
        'Adicione a farinha de amêndoa, fermento e canela',
        'Misture até formar uma massa homogênea',
        'Asse em forno a 180°C por 30 minutos'
      ]
    },
    {
      id: 3,
      nome: 'Pão de Quinoa',
      tempo: '50 min',
      dificuldade: 'Médio',
      porcoes: '10 fatias',
      imagem: '/images/pao-quinoa.jpg',
      ingredientes: [
        '1 xícara de quinoa cozida',
        '1 xícara de farinha de quinoa',
        '1/2 xícara de água',
        '2 colheres de sopa de azeite',
        '1 colher de chá de sal',
        '1 colher de chá de fermento'
      ],
      preparo: [
        'Misture todos os ingredientes secos',
        'Adicione a quinoa cozida e a água',
        'Misture até formar uma massa consistente',
        'Deixe descansar por 20 minutos',
        'Asse em forno a 180°C por 35 minutos'
      ]
    }
  ]

  const filteredReceitas = receitasPaes.filter(receita =>
    receita.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/receitas" className="flex items-center">
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
            placeholder="Buscar receitas de pães..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        {/* Lista de Receitas */}
        <div className="space-y-4">
          {filteredReceitas.map((receita) => (
            <div key={receita.id} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
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
                
                {/* Informações da receita */}
                <div className="flex-1">
                  <h3 className="font-bold text-brand-text text-lg mb-2">
                    {receita.nome}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      ⏱️ {receita.tempo}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      📊 {receita.dificuldade}
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      👥 {receita.porcoes}
                    </span>
                  </div>
                  
                  <button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-greenDark transition-colors">
                    Ver Receita Completa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há receitas */}
        {filteredReceitas.length === 0 && (
          <div className="text-center py-8">
            <p className="text-brand-text2">
              Nenhuma receita encontrada para "{searchTerm}"
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/receitas" />
    </div>
  )
}
