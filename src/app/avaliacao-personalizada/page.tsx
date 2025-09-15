'use client'

import Link from 'next/link'
import Logo from '@/components/Logo'

export default function AvaliacaoPersonalizada() {
  return (
    <div className="min-h-screen bg-brand-neutralLight pb-16">
      {/* Header */}
      <header className="bg-brand-greenSoft shadow-soft sticky top-0 z-50 border-b border-brand-border">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
            <Link href="/" className="text-sm text-gray-600 hover:text-brand-green transition-colors">
              ← Voltar ao App
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-8 text-center bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-sm mx-auto">
          <div className="mb-6">
            <span className="text-6xl mb-4 block">👩‍⚕️</span>
            <h1 className="text-3xl font-bold text-brand-text mb-4">
              Avaliação Personalizada
            </h1>
            <p className="text-lg text-brand-text2 mb-6">
              Coach brasileira especializada em bem-estar
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="px-4 py-6">
        <div className="max-w-sm mx-auto space-y-6">
          
          {/* O que é a Avaliação */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-border">
            <h2 className="text-xl font-bold text-brand-text mb-4 flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              O que é a Avaliação Personalizada?
            </h2>
            <p className="text-brand-text2 leading-relaxed mb-4">
              Uma consultoria completa e personalizada com uma coach brasileira especializada em bem-estar, 
              desenvolvida especificamente para brasileiros que vivem nos Estados Unidos.
            </p>
            <p className="text-brand-text2 leading-relaxed">
              Através de uma análise detalhada do seu estilo de vida, hábitos alimentares e objetivos, 
              criamos um plano personalizado para sua jornada de bem-estar.
            </p>
          </div>

          {/* Como Funciona */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-border">
            <h2 className="text-xl font-bold text-brand-text mb-4 flex items-center">
              <span className="text-2xl mr-3">📋</span>
              Como Funciona?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="bg-brand-green text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <div>
                  <h3 className="font-semibold text-brand-text">Questionário Inicial</h3>
                  <p className="text-sm text-brand-text2">Preencha um questionário detalhado sobre seu estilo de vida, hábitos e objetivos.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-brand-green text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <div>
                  <h3 className="font-semibold text-brand-text">Análise Personalizada</h3>
                  <p className="text-sm text-brand-text2">Nossa coach analisa suas respostas e identifica áreas de melhoria.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-brand-green text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <div>
                  <h3 className="font-semibold text-brand-text">Plano Personalizado</h3>
                  <p className="text-sm text-brand-text2">Receba um plano completo adaptado à sua realidade nos EUA.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-brand-green text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <div>
                  <h3 className="font-semibold text-brand-text">Acompanhamento</h3>
                  <p className="text-sm text-brand-text2">Suporte contínuo para garantir seus resultados.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefícios */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-border">
            <h2 className="text-xl font-bold text-brand-text mb-4 flex items-center">
              <span className="text-2xl mr-3">✨</span>
              Benefícios
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-brand-text2">Plano adaptado à realidade americana</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-brand-text2">Coach brasileira que entende sua cultura</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-brand-text2">Acesso a produtos disponíveis nos EUA</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-brand-text2">Suporte em português</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-brand-text2">Acompanhamento personalizado</span>
              </div>
            </div>
          </div>

          {/* CTA Principal */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4">Pronto para começar sua jornada?</h2>
            <p className="text-white/90 mb-6">
              Agende sua avaliação personalizada com nossa coach brasileira especializada.
            </p>
            <a 
              href="https://wa.me/17862535032" 
              className="inline-block bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              💬 Agendar por WhatsApp
            </a>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-border">
            <h2 className="text-xl font-bold text-brand-text mb-4 flex items-center">
              <span className="text-2xl mr-3">ℹ️</span>
              Informações Importantes
            </h2>
            <div className="space-y-3 text-sm text-brand-text2">
              <p><strong>Duração:</strong> A avaliação completa leva aproximadamente 60 minutos.</p>
              <p><strong>Formato:</strong> Consulta online via WhatsApp ou videochamada.</p>
              <p><strong>Idioma:</strong> Atendimento em português.</p>
              <p><strong>Investimento:</strong> Consulte valores diretamente com nossa coach.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-brand-greenSoft border-t border-brand-border px-4 py-2">
        <div className="max-w-sm mx-auto flex justify-around">
          <Link href="/" className="flex flex-col items-center py-1 text-brand-textLight">
            <span className="text-lg">🏠</span>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/receitas" className="flex flex-col items-center py-1 text-brand-textLight">
            <span className="text-lg">🍲</span>
            <span className="text-xs">Receitas</span>
          </Link>
          <Link href="/mercado" className="flex flex-col items-center py-1 text-brand-textLight">
            <span className="text-lg">🛒</span>
            <span className="text-xs">Mercado</span>
          </Link>
          <Link href="/avaliacao" className="flex flex-col items-center py-1 text-brand-textLight">
            <span className="text-lg">🧠</span>
            <span className="text-xs">Avaliação</span>
          </Link>
          <Link href="/produtos" className="flex flex-col items-center py-1 text-brand-textLight">
            <span className="text-lg">📦</span>
            <span className="text-xs">Produtos</span>
          </Link>
        </div>
      </div>
    </div>
  )
}