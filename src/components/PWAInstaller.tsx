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

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado com sucesso:', registration.scope)
        })
        .catch((error) => {
          console.error('❌ Erro ao registrar Service Worker:', error)
        })
    }

    // Detectar evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallButton(true)
    }

    // Detectar se já está instalado
    const handleAppInstalled = () => {
      console.log('🎉 PWA foi instalada!')
      setIsInstalled(true)
      setShowInstallButton(false)
      setDeferredPrompt(null)
    }

    // Verificar se já está instalado (modo standalone)
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        setShowInstallButton(false)
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
    if (!deferredPrompt) return

    try {
      // Mostrar prompt de instalação
      await deferredPrompt.prompt()
      
      // Aguardar resposta do usuário
      const { outcome } = await deferredPrompt.userChoice
      
      console.log(`👤 Usuário ${outcome === 'accepted' ? 'aceitou' : 'rejeitou'} a instalação`)
      
      // Limpar o prompt
      setDeferredPrompt(null)
      setShowInstallButton(false)
    } catch (error) {
      console.error('❌ Erro ao instalar PWA:', error)
    }
  }

  // Não mostrar nada se já estiver instalado ou não houver prompt
  if (isInstalled || !showInstallButton) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleInstallClick}
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-semibold"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9l9-5-9-5-9 5 9 5z" />
        </svg>
        Instalar App
      </button>
    </div>
  )
}
