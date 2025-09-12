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
    // Tentar instalação automática primeiro
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        console.log(`👤 Usuário ${outcome === 'accepted' ? 'aceitou' : 'rejeitou'} a instalação`)
        setDeferredPrompt(null)
        return
      } catch (error) {
        console.error('❌ Erro ao instalar PWA:', error)
      }
    }

    // Para iOS Safari - mostrar modal de permissão
    const userAgent = navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent)
    
    if (isIOS && isSafari) {
      showIOSInstallModal()
    } else {
      showInstallModal()
    }
  }

  const showIOSInstallModal = () => {
    const modal = document.createElement('div')
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `
    
    const content = document.createElement('div')
    content.style.cssText = `
      background: white;
      border-radius: 20px;
      padding: 35px 30px;
      max-width: 320px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    `
    
    content.innerHTML = `
      <div style="margin-bottom: 25px;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 24px; font-weight: bold;">M</span>
        </div>
        <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 22px; font-weight: 700;">Instalar MeuPortalFit</h2>
        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">Quer ter acesso rápido ao seu app de saúde?</p>
        
        <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Como instalar:</h3>
          <p style="margin: 5px 0; color: #374151; font-size: 14px;">1. Toque no botão "Compartilhar" (quadrado com seta)</p>
          <p style="margin: 5px 0; color: #374151; font-size: 14px;">2. Role para baixo e toque em "Adicionar à Tela Inicial"</p>
          <p style="margin: 5px 0; color: #374151; font-size: 14px;">3. Toque em "Adicionar"</p>
        </div>
      </div>
      
      <div style="display: flex; gap: 10px;">
        <button onclick="this.parentElement.parentElement.remove()" style="
          flex: 1;
          background: #f3f4f6;
          color: #374151;
          border: none;
          padding: 14px 16px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        ">
          Depois
        </button>
        <button onclick="this.parentElement.parentElement.remove()" style="
          flex: 1;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: none;
          padding: 14px 16px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        ">
          Instalar
        </button>
      </div>
    `
    
    modal.appendChild(content)
    document.body.appendChild(modal)
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove()
      }
    })
  }

  const showInstallModal = () => {
    const modal = document.createElement('div')
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `
    
    const content = document.createElement('div')
    content.style.cssText = `
      background: white;
      border-radius: 16px;
      padding: 30px 25px;
      max-width: 350px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `
    
    content.innerHTML = `
      <div style="margin-bottom: 25px;">
        <div style="width: 50px; height: 50px; background: #22c55e; border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 20px; font-weight: bold;">M</span>
        </div>
        <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px; font-weight: 600;">Instalar App</h2>
        <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.4;">Procure pelo ícone de instalação na barra de endereços do seu navegador</p>
      </div>
      
      <button onclick="this.parentElement.parentElement.remove()" style="
        width: 100%;
        background: #22c55e;
        color: white;
        border: none;
        padding: 15px 20px;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
      ">
        OK, entendi!
      </button>
    `
    
    modal.appendChild(content)
    document.body.appendChild(modal)
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove()
      }
    })
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
