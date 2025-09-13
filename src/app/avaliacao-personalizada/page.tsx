'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function AvaliacaoPersonalizada() {
  const [activeTab, setActiveTab] = useState('resultados')

  const mockResults = {
    name: 'Maria',
    score: 85,
    recommendations: [
      'Aumentar consumo de água para 2.5L por dia',
      'Incluir mais proteínas vegetais na dieta',
      'Praticar exercícios 3x por semana',
      'Melhorar qualidade do sono'
    ],
    products: [
      {
        name: 'Multivitamínico para Mulheres',
        price: 29.99,
        link: 'https://amazon.com/multivitamin',
        image: '💊'
      },
      {
        name: 'Proteína em Pó Vegana',
        price: 39.99,
        link: 'https://amazon.com/protein',
        image: '🥤'
      }
    ]
  }

  const renderResultadosTab = () => (
    <div className="space-y-6">
      {/* Score Card */}
      <div className="bg-gradient-to-r from-brand-green to-brand-blue rounded-xl p-6 text-white text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold mb-2">Seus Resultados, {mockResults.name}!</h2>
        <div className="text-4xl font-bold mb-2">{mockResults.score}/100</div>
        <p className="text-sm opacity-90">Excelente! Você está no caminho certo</p>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Suas Recomendações</h3>
        <div className="space-y-3">
          {mockResults.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-brand-green text-lg">✓</span>
              <p className="text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🛒 Produtos Recomendados</h3>
        <div className="space-y-4">
          {mockResults.products.map((product, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-3xl">{product.image}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{product.name}</h4>
                <p className="text-brand-green font-bold">R$ {product.price}</p>
              </div>
              <a 
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-amber text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-amberDark transition-colors"
              >
                Comprar
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCoachingTab = () => (
    <div className="space-y-6">
      {/* Coach Info */}
      <div className="bg-white rounded-xl p-6 shadow-lg text-center">
        <div className="text-6xl mb-4">👩‍⚕️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Nutricionista Brasileira</h2>
        <p className="text-gray-600 mb-4">Especializada em brasileiros nos EUA</p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 text-sm">
            <strong>Formação:</strong> USP, CRN ativo nos EUA<br/>
            <strong>Especialização:</strong> Nutrição para brasileiros<br/>
            <strong>Experiência:</strong> 8 anos nos Estados Unidos
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Serviços Disponíveis</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-800">Consulta Individual</h4>
              <p className="text-sm text-gray-600">1 hora de consulta personalizada</p>
            </div>
            <span className="text-brand-green font-bold">R$ 150</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-800">Plano Nutricional</h4>
              <p className="text-sm text-gray-600">Plano completo + acompanhamento</p>
            </div>
            <span className="text-brand-green font-bold">R$ 300</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-800">Acompanhamento Mensal</h4>
              <p className="text-sm text-gray-600">4 consultas + suporte via WhatsApp</p>
            </div>
            <span className="text-brand-green font-bold">R$ 500</span>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-r from-brand-green to-brand-blue rounded-xl p-6 text-white text-center">
        <h3 className="text-xl font-bold mb-2">💬 Agende sua Consulta</h3>
        <p className="text-sm mb-4">Fale diretamente com nossa nutricionista via WhatsApp</p>
        <a 
          href="https://wa.me/1234567890?text=Olá! Gostaria de agendar uma consulta nutricional"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-brand-green px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block"
        >
          📱 Falar no WhatsApp
        </a>
      </div>
    </div>
  )

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
            👩‍⚕️ Avaliação Personalizada
          </h1>
          <p className="text-brand-text2 text-sm">
            Seus resultados e coaching personalizado
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('resultados')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
                  activeTab === 'resultados'
                    ? 'text-brand-green border-b-2 border-brand-green bg-green-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                📊 Meus Resultados
              </button>
              <button
                onClick={() => setActiveTab('coaching')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
                  activeTab === 'coaching'
                    ? 'text-brand-green border-b-2 border-brand-green bg-green-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                👩‍⚕️ Coaching
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          {activeTab === 'resultados' && renderResultadosTab()}
          {activeTab === 'coaching' && renderCoachingTab()}
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
          <Link href="/protocolos" className="flex flex-col items-center py-1 text-brand-text2">
            <span className="text-lg">📋</span>
            <span className="text-xs">Protocolos</span>
          </Link>
          <button className="flex flex-col items-center py-1 text-brand-green">
            <span className="text-lg">👩‍⚕️</span>
            <span className="text-xs font-semibold">Personalizada</span>
          </button>
        </div>
      </div>
    </div>
  )
}
