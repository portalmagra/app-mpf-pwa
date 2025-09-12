'use client'

import { useEffect, useState } from 'react'

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
    // Detectar evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    // Detectar se já está instalado
    const handleAppInstalled = () => {
      console.log('🎉 PWA foi instalada!')
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    // Verificar se já está instalado (modo standalone)
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        setDeferredPrompt(null)
      }
    }

    // Adicionar event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    
    // Verificar se já está instalado
    checkIfInstalled()

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Se não há prompt disponível, mostrar instruções
      alert('Para instalar o app:\n\n📱 iPhone: Toque no botão Compartilhar e selecione "Adicionar à Tela Inicial"\n\n🤖 Android: Procure pelo ícone de instalação na barra de endereços ou menu do navegador')
      return
    }

    try {
      // Mostrar prompt de instalação
      await deferredPrompt.prompt()
      
      // Aguardar resposta do usuário
      const { outcome } = await deferredPrompt.userChoice
      
      console.log(`👤 Usuário ${outcome === 'accepted' ? 'aceitou' : 'rejeitou'} a instalação`)
      
      // Limpar o prompt
      setDeferredPrompt(null)
    } catch (error) {
      console.error('❌ Erro ao instalar PWA:', error)
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream pb-16">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-green via-brand-green to-brand-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-lg font-bold text-brand-text">MeuPortalFit</h1>
            </div>
            <button 
              id="install-button"
              className="bg-gradient-to-r from-brand-amber to-brand-amberDark text-white px-5 py-3 rounded-xl text-sm font-bold hover:shadow-xl transition-all transform hover:scale-110 border-2 border-brand-amber"
              onClick={handleInstallClick}
            >
              {isInstalled ? '✅ Instalado' : '📱 Instalar Agora'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Compacto */}
      <section className="px-4 py-6 text-center">
        <div className="max-w-sm mx-auto">
          <h2 className="text-2xl font-bold text-brand-text mb-2">
            Saúde dos brasileiros nos
            <span className="text-brand-green block">Estados Unidos</span>
          </h2>
          <p className="text-brand-text2 text-sm">
            App para brasileiras que querem viver melhor nos EUA
          </p>
        </div>
      </section>

      {/* 3 Botões Compactos - Layout Horizontal */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="space-y-4">
            {/* 1. Avaliação Gratuita - PRIMEIRO CARD (MOTOR DE CAPTURA) */}
            <a href="/avaliacao" className="w-full bg-gradient-to-br from-brand-blue via-brand-blueLight to-brand-blueDark rounded-xl p-4 text-white shadow-xl hover:shadow-2xl transition-all border-2 border-brand-blue transform hover:scale-105 block">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">🧠</span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-xl">Avaliação Gratuita</h3>
                  <p className="text-sm text-blue-100">Descubra seu plano ideal em 60 segundos ⏱️</p>
                  <p className="text-xs text-blue-200 mt-1">
                    Avaliação + produtos Amazon indicados só para você
                  </p>
                </div>
                <span className="text-xs bg-white/30 px-3 py-1 rounded-full font-semibold">Fazer</span>
              </div>
            </a>

            {/* 2. Receitas */}
            <button className="w-full bg-gradient-to-br from-brand-greenSoft via-white to-brand-blueSoft rounded-xl p-4 text-brand-text shadow-soft hover:shadow-lg transition-all transform hover:scale-105">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">🍲</span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg">Receitas</h3>
                  <p className="text-sm text-brand-text2">Ingredientes adaptados para os Estados Unidos</p>
                  <p className="text-xs text-brand-text2 mt-1">Com ingredientes que você encontra nos EUA</p>
                </div>
                <span className="text-xs bg-gradient-to-r from-brand-green to-brand-blue text-white px-3 py-1 rounded-full font-semibold">Ver</span>
              </div>
            </button>

            {/* 3. Mercado - Curadoria Amazon */}
            <button className="w-full bg-gradient-to-br from-brand-blueSoft via-white to-brand-greenSoft rounded-xl p-4 text-brand-text shadow-soft hover:shadow-lg transition-all transform hover:scale-105">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">🛒</span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg">Mercado</h3>
                  <p className="text-sm text-brand-text2">Curadoria de produtos Amazon para brasileiras nos EUA</p>
                  <p className="text-xs text-brand-text2 mt-1">Já testamos e aprovamos para você</p>
                </div>
                <span className="text-xs bg-gradient-to-r from-brand-green to-brand-blue text-white px-3 py-1 rounded-full font-semibold">Ver</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Compacto - Coach */}
      <div className="px-4 mb-4">
        <div className="max-w-sm mx-auto">
          <button className="w-full bg-gradient-to-r from-brand-green via-brand-blue to-brand-blueDark text-white rounded-lg p-2.5 shadow-md hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">📊</span>
              <div className="text-center">
                <p className="font-semibold text-sm">Análise Personalizada</p>
                <p className="text-xs text-blue-100">Fale Conosco</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-border px-4 py-2">
        <div className="max-w-sm mx-auto flex justify-around">
          <button className="flex flex-col items-center py-1 text-brand-green">
            <span className="text-lg">🏠</span>
            <span className="text-xs font-semibold">Home</span>
          </button>
          <button className="flex flex-col items-center py-1 text-brand-text2">
            <span className="text-lg">🍲</span>
            <span className="text-xs">Receitas</span>
          </button>
          <button className="flex flex-col items-center py-1 text-brand-text2">
            <span className="text-lg">🛒</span>
            <span className="text-xs">Mercado</span>
          </button>
          <button className="flex flex-col items-center py-1 text-brand-text2">
            <span className="text-lg">👤</span>
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
