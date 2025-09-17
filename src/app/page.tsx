'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'
import { openWhatsApp, openWhatsAppSimple, openWhatsAppIOS } from '@/utils/whatsapp'

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
  const [showInstallGuide, setShowInstallGuide] = useState(false)
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'success' | 'error'>('idle')

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      console.log('🎉 PWA foi instalada!')
      setIsInstalled(true)
      setDeferredPrompt(null)
      setInstallStatus('success')
      setShowInstallGuide(false)
    }

    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      console.log('🔍 Verificando se PWA está instalada:', isStandalone);
      if (isStandalone) {
        setIsInstalled(true)
        setDeferredPrompt(null)
        console.log('✅ PWA detectada como instalada');
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


  const getInstallButtonText = () => {
    if (isInstalled) return '💬 WhatsApp'
    if (installStatus === 'installing') return '⏳ Instalando...'
    if (installStatus === 'success') return '🎉 Instalado!'
    if (installStatus === 'error') return '❌ Erro - Tente Novamente'
    return '📱 Instalar App'
  }

  const getInstallButtonClass = () => {
    const baseClass = "px-5 py-3 rounded-xl text-sm font-bold transition-all transform hover:scale-105 cursor-pointer"
    if (isInstalled || installStatus === 'success') {
      return `${baseClass} bg-green-500 text-white hover:bg-green-600`
    }
    if (installStatus === 'installing') {
      return `${baseClass} bg-yellow-500 text-white animate-pulse cursor-not-allowed`
    }
    if (installStatus === 'error') {
      return `${baseClass} bg-red-500 text-white`
    }
    return `${baseClass} bg-brand-green text-white hover:bg-brand-greenDark`
  }

  const handleInstallClick = async () => {
    console.log('🔘 Botão clicado!', { isInstalled, installStatus });
    
    if (isInstalled) {
      // Se já está instalado, abrir WhatsApp com mensagem específica
      console.log('📱 PWA instalada, abrindo WhatsApp...');
      const message = "Olá! Gostaria de saber mais sobre o MeuPortalFit e fazer uma avaliação personalizada.";
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      console.log('📱 Dispositivo iOS?', isIOS);
      
      if (isIOS) {
        openWhatsAppIOS('17862535032', message);
      } else {
        openWhatsAppSimple('17862535032', message);
      }
      return
    }

    if (deferredPrompt) {
      // Instalação automática disponível
      setInstallStatus('installing')
      try {
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
          setInstallStatus('success')
        } else {
          setInstallStatus('idle')
        }
        setDeferredPrompt(null)
      } catch (error) {
        console.error('❌ Erro ao instalar PWA:', error)
        setInstallStatus('error')
      }
    } else {
      // Mostrar guia manual
      setShowInstallGuide(true)
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
              className={getInstallButtonClass()}
              onClick={handleInstallClick}
              disabled={installStatus === 'installing'}
            >
              {getInstallButtonText()}
            </button>
          </div>
        </div>
      </header>


      {/* Banner Coach Brasileira - DESTAQUE */}
      <section className="px-4 py-4 bg-gradient-to-r from-orange-300 to-orange-400 text-white mb-6">
        <div className="max-w-sm mx-auto text-center">
          <div className="mb-3">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">👩‍⚕️</span>
              <h2 className="text-lg font-bold">Agende uma Avaliação Personalizada</h2>
            </div>
          </div>
          <button 
            onClick={() => openWhatsApp()}
            className="inline-block bg-white text-orange-600 px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            📅 QUERO AGENDAR
          </button>
        </div>
      </section>


      {/* 4 Botões Principais - Layout Vertical */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="space-y-4">
            {/* 1. Acompanhamento Personalizado - Primeiro lugar */}
            <Link href="/avaliacao-personalizada" className="w-full bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-green-300 transform hover:scale-105 block">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">👩‍⚕️</span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg">Acompanhamento Personalizado</h3>
                  <p className="text-sm text-brand-text2">Coach brasileira especializada</p>
                </div>
                <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-semibold">Ver</span>
              </div>
            </Link>

            {/* 2. Nossa Seleção */}
            <Link href="/produtos" className="w-full bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-blue-300 transform hover:scale-105 block">
              <div className="flex items-center space-x-4">
                <img 
                  src="/icons/amazon-logo-official.png" 
                  alt="Amazon" 
                  width="40" 
                  height="40"
                  className="object-contain"
                />
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-xl">Nossa Seleção</h3>
                  <p className="text-sm text-brand-text2">Produtos curados especialmente para você</p>
                </div>
                <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-semibold">Ver</span>
              </div>
            </Link>

            {/* 3. Receitas - Verde claro com gradiente */}
            <Link href="/receitas" className="w-full bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-green-300 transform hover:scale-105 block">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">🍽️</span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-xl">Receitas</h3>
                  <p className="text-sm text-brand-text2">Ingredientes que tem nos EUA</p>
                </div>
                <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-semibold">Ver</span>
              </div>
            </Link>

            {/* 4. Protocolos Nutricionais - Branco neutro */}
            <Link href="/protocolos" className="w-full bg-white rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-gray-200 transform hover:scale-105 block">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">📋</span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-xl">Protocolos Nutricionais</h3>
                  <p className="text-sm text-brand-text2">Protocolos de 7, 14 e 30 dias</p>
                </div>
                <span className="text-xs bg-gray-500 text-white px-3 py-1 rounded-full font-semibold">Ver</span>
              </div>
            </Link>

            {/* 5. Avaliação por IA - Verde claro com gradiente */}
            <Link href="/avaliacao" className="w-full bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-4 text-brand-text shadow-lg hover:shadow-xl transition-all border border-green-300 transform hover:scale-105 block">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">🧠</span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-xl">Avaliação por IA</h3>
                  <p className="text-sm text-brand-text2">Com inteligência artificial</p>
                </div>
                <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-semibold">Fazer</span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Botão WhatsApp Fixo - Suporte */}
      <section className="px-4 py-4">
        <div className="max-w-sm mx-auto text-center">
          <button 
            onClick={() => openWhatsApp()}
            className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
          >
            <span>💬</span>
            <span>Precisa de ajuda? Fale conosco</span>
          </button>
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/" />

      {/* Modal de Guia de Instalação */}
      {showInstallGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-brand-text mb-2">📱 Instalar App</h2>
              <p className="text-brand-text2">Siga os passos abaixo para instalar o Portal Fit no seu celular:</p>
            </div>

            <div className="space-y-4 mb-6">
              {/* iPhone */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-brand-text mb-2 flex items-center">
                  <span className="text-xl mr-2">📱</span>
                  iPhone (Safari)
                </h3>
                <ol className="text-sm text-brand-text2 space-y-2">
                  <li>1. Toque no botão <span className="bg-gray-200 px-2 py-1 rounded">📤</span> na parte inferior</li>
                  <li>2. Selecione <strong>"Adicionar à Tela de Início"</strong></li>
                  <li>3. Toque em <strong>"Adicionar"</strong></li>
                </ol>
              </div>

              {/* Android */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-brand-text mb-2 flex items-center">
                  <span className="text-xl mr-2">🤖</span>
                  Android (Chrome)
                </h3>
                <ol className="text-sm text-brand-text2 space-y-2">
                  <li>1. Toque no menu <span className="bg-gray-200 px-2 py-1 rounded">⋮</span> (três pontos)</li>
                  <li>2. Selecione <strong>"Instalar app"</strong> ou <strong>"Adicionar à tela inicial"</strong></li>
                  <li>3. Confirme a instalação</li>
                </ol>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowInstallGuide(false)}
                className="bg-brand-green text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-greenDark transition-colors"
              >
                Entendi! 👍
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}