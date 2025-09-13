'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Protocolos() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDuration, setSelectedDuration] = useState('all')

  const durations = [
    { id: 'all', name: 'Todos', icon: '📋' },
    { id: '7', name: '7 Dias', icon: '🔥' },
    { id: '14', name: '14 Dias', icon: '⚡' },
    { id: '30', name: '30 Dias', icon: '🎯' }
  ]

  const mockProtocols = [
    {
      id: 1,
      name: '7 Dias Detox',
      description: 'Protocolo de desintoxicação e energia para iniciantes',
      duration: 7,
      price: 0,
      isFree: true,
      features: ['Desintoxicação', 'Energia', 'Hidratação', 'Sono']
    },
    {
      id: 2,
      name: '14 Dias Energia',
      description: 'Protocolo para aumentar energia e vitalidade',
      duration: 14,
      price: 47,
      isFree: false,
      features: ['Energia', 'Foco', 'Metabolismo', 'Imunidade']
    },
    {
      id: 3,
      name: '30 Dias Emagrecimento',
      description: 'Protocolo completo para emagrecimento saudável',
      duration: 30,
      price: 97,
      isFree: false,
      features: ['Emagrecimento', 'Metabolismo', 'Saciedade', 'Energia']
    },
    {
      id: 4,
      name: '14 Dias Performance',
      description: 'Protocolo para atletas e alta performance',
      duration: 14,
      price: 67,
      isFree: false,
      features: ['Performance', 'Recuperação', 'Força', 'Resistência']
    },
    {
      id: 5,
      name: '7 Dias Anti-inflamatório',
      description: 'Protocolo para reduzir inflamação e dor',
      duration: 7,
      price: 37,
      isFree: false,
      features: ['Anti-inflamatório', 'Dor', 'Articulações', 'Bem-estar']
    },
    {
      id: 6,
      name: '30 Dias Longevidade',
      description: 'Protocolo focado em saúde e longevidade',
      duration: 30,
      price: 127,
      isFree: false,
      features: ['Longevidade', 'Anti-aging', 'Cognição', 'Vitalidade']
    }
  ]

  const filteredProtocols = mockProtocols.filter(protocol => {
    const matchesSearch = protocol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         protocol.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDuration = selectedDuration === 'all' || protocol.duration.toString() === selectedDuration
    return matchesSearch && matchesDuration
  })

  return (
    <div className="min-h-screen bg-brand-cream pb-16">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
            <Link href="/" className="text-brand-green text-sm font-medium">
              🏠 Início
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-6 text-center">
        <div className="max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-brand-text mb-2">
            📋 Protocolos Nutricionais
          </h1>
          <p className="text-brand-text2 text-sm">
            Planos completos para diferentes objetivos
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Buscar protocolos... (ex: emagrecer, energia, detox)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-brand-green focus:outline-none text-gray-700 placeholder-gray-400"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              {searchQuery ? '✨' : '🤖'}
            </div>
          </div>
        </div>
      </section>

      {/* Duration Filters */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="flex flex-wrap gap-2">
            {durations.map(duration => (
              <button
                key={duration.id}
                onClick={() => setSelectedDuration(duration.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDuration === duration.id
                    ? 'bg-brand-green text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{duration.icon}</span>
                {duration.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Protocols Grid */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="space-y-4">
            {filteredProtocols.map(protocol => (
              <div key={protocol.id} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{protocol.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{protocol.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {protocol.features.map((feature, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-2xl">
                    {durations.find(d => d.id === protocol.duration.toString())?.icon}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      protocol.isFree 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {protocol.isFree ? 'GRATUITO' : `R$ ${protocol.price}`}
                    </span>
                    <span className="text-xs text-gray-500">{protocol.duration} dias</span>
                  </div>
                  
                  {protocol.isFree ? (
                    <button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-greenDark transition-colors">
                      Acessar
                    </button>
                  ) : (
                    <button className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-blueDark transition-colors">
                      Comprar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Coaching */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-gradient-to-r from-brand-green to-brand-blue rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">👩‍⚕️ Coaching Personalizado</h3>
            <p className="text-sm mb-4">Protocolos são só o começo! Acompanhamento individual com nutricionista brasileira</p>
            <Link href="/avaliacao-personalizada" className="bg-white text-brand-green px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block">
              Falar com Nutricionista
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-border px-4 py-2">
        <div className="max-w-sm mx-auto flex justify-around">
          <Link href="/" className="flex flex-col items-center py-1 text-brand-text2">
            <span className="text-lg">🏠</span>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/receitas" className="flex flex-col items-center py-1 text-brand-text2">
            <span className="text-lg">🍲</span>
            <span className="text-xs">Receitas</span>
          </Link>
          <button className="flex flex-col items-center py-1 text-brand-green">
            <span className="text-lg">📋</span>
            <span className="text-xs font-semibold">Protocolos</span>
          </button>
          <Link href="/avaliacao" className="flex flex-col items-center py-1 text-brand-text2">
            <span className="text-lg">🧠</span>
            <span className="text-xs">Avaliação</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
