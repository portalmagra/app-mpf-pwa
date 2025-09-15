'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      console.log('🎉 PWA foi instalada!')
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        setDeferredPrompt(null)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    
    checkIfInstalled()

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        console.log(`👤 Usuário ${outcome === 'accepted' ? 'aceitou' : 'rejeitou'} a instalação`)
        setDeferredPrompt(null)
      } catch (error) {
        console.error('❌ Erro ao instalar PWA:', error)
      }
    } else {
      alert('Para instalar o app, procure pelo ícone de instalação na barra de endereços do seu navegador.')
    }
  }

  return (
    <div className="min-h-screen bg-brand-neutralLight pb-16">
      {/* Header */}
      <header className="bg-brand-greenSoft shadow-soft sticky top-0 z-50 border-b border-brand-border">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
            <button 
              id="install-button"
              className="bg-brand-green text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-brand-greenDark transition-all transform hover:scale-105"
              onClick={handleInstallClick}
            >
              {isInstalled ? '✅ Instalado' : '📱 Instalar Agora'}
            </button>
          </div>
        </div>
      </header>

      {/* Banner Coach Brasileira - DESTAQUE */}
      <section className="px-4 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-sm mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">👩‍⚕️</span>
            <h2 className="text-lg font-bold">Agende uma Avaliação Personalizada</h2>
          </div>
          <a 
            href="https://wa.me/17862535032" 
            className="inline-block bg-white text-orange-600 px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            📅 QUERO AGENDAR
          </a>
        </div>
      </section>

      {/* Hero Compacto */}
      <section className="px-4 py-6 text-center">
        <div className="max-w-sm mx-auto">
          <h2 className="text-xl font-bold text-brand-text">
            Para brasileiros nos Estados Unidos
          </h2>
        </div>
      </section>

      {/* 4 Botões Principais - Layout Vertical */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="space-y-4">
            {/* 1. Receitas */}
            <Link href="/receitas" className="w-full bg-brand-greenSoft rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-brand-border transform hover:scale-105 block">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">🍽️</span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-xl">Receitas</h3>
                  <p className="text-sm text-brand-text2">Ingredientes que tem nos EUA</p>
                </div>
                <span className="text-xs bg-brand-green text-white px-3 py-1 rounded-full font-semibold">Ver</span>
              </div>
            </Link>

            {/* 2. Protocolos Nutricionais */}
            <Link href="/protocolos" className="w-full bg-brand-neutral rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-brand-border transform hover:scale-105 block">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">📋</span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-xl">Protocolos Nutricionais</h3>
                  <p className="text-sm text-brand-text2">Protocolos de 7, 14 e 30 dias</p>
                </div>
                <span className="text-xs bg-brand-greenLight text-white px-3 py-1 rounded-full font-semibold">Ver</span>
              </div>
            </Link>

            {/* 3. Avaliação de Bem-estar por IA */}
            <Link href="/avaliacao" className="w-full bg-brand-green rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all border border-brand-green transform hover:scale-105 block">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">🧠</span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-xl">Avaliação de Bem-estar</h3>
                  <p className="text-sm text-white/90">Com inteligência artificial</p>
                </div>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">Fazer</span>
              </div>
            </Link>

            {/* 4. Avaliação Personalizada */}
            <Link href="/avaliacao-personalizada" className="w-full bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all border border-green-600 transform hover:scale-105 block">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">👩‍⚕️</span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg">Avaliação Personalizada</h3>
                  <p className="text-sm text-white/90">Coach brasileira especializada</p>
                </div>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">Ver</span>
              </div>
            </Link>

            {/* 5. Mercado */}
            <Link href="/mercado" className="w-full bg-orange-100 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-orange-200 transform hover:scale-105 block">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">🛒</span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-xl">Mercado</h3>
                  <p className="text-sm text-brand-text2">Produtos selecionados para compra</p>
                </div>
                <span className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full font-semibold">Ver</span>
              </div>
            </Link>

            {/* 6. Produtos */}
            <Link href="/produtos" className="w-full bg-brand-neutral rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-brand-border transform hover:scale-105 block">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">📦</span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-xl">Produtos</h3>
                  <p className="text-sm text-brand-text2">Suplementos e produtos por categoria</p>
                </div>
                <span className="text-xs bg-brand-greenLight text-white px-3 py-1 rounded-full font-semibold">Ver</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-brand-greenSoft border-t border-brand-border px-4 py-2">
        <div className="max-w-sm mx-auto flex justify-around">
          <button className="flex flex-col items-center py-1 text-brand-green">
            <span className="text-lg">🏠</span>
            <span className="text-xs font-semibold">Home</span>
          </button>
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