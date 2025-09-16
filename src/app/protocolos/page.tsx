'use client'

import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Protocolos() {

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

      {/* Mensagem de Em Breve */}
      <section className="px-4 py-12">
        <div className="max-w-sm mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-xl font-bold text-brand-text mb-3">
              Em breve protocolos disponíveis para você!
            </h2>
            <p className="text-brand-text2 text-sm mb-6">
              Estamos preparando protocolos nutricionais personalizados para brasileiros nos EUA. 
              Enquanto isso, que tal falar no WhatsApp?
            </p>
            
            <Link 
              href="/avaliacao-personalizada" 
              className="bg-brand-green text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-greenDark transition-colors inline-block"
            >
              💬 Falar no WhatsApp
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Coaching */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-brand-green rounded-xl p-6 text-white text-center shadow-lg">
            <h3 className="text-xl font-bold mb-2">👩‍⚕️ Coaching Personalizado</h3>
            <p className="text-sm mb-4">Protocolos são só o começo! Acompanhamento individual com nutricionista brasileira</p>
            <Link href="/avaliacao-personalizada" className="bg-white text-brand-green px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block">
              💬 Falar no WhatsApp
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
