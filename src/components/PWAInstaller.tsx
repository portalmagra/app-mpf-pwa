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
  const [showUpdateNotification, setShowUpdateNotification] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado com sucesso:', registration.scope)
          
          // Verificar se há atualizações pendentes
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Há uma nova versão disponível
                  setWaitingWorker(newWorker)
                  setShowUpdateNotification(true)
                }
              })
            }
          })

          // Verificar atualizações periodicamente (especialmente para mobile)
          setInterval(() => {
            registration.update()
          }, 30000) // Verifica a cada 30 segundos
        })
        .catch((error) => {
          console.error('❌ Erro ao registrar Service Worker:', error)
        })

      // Escutar mensagens do Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          setShowUpdateNotification(true)
        }
      })

      // Forçar verificação de atualizações quando a página ganha foco (mobile)
      const handleVisibilityChange = () => {
        if (!document.hidden && 'serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration) {
              registration.update()
            }
          })
        }
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
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

  const handleUpdateClick = async () => {
    if (waitingWorker) {
      try {
        // Ativar o novo service worker
        waitingWorker.postMessage({ type: 'SKIP_WAITING' })
        
        // Aguardar um pouco para o worker ser ativado
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Limpar todos os caches
        if ('caches' in window) {
          const cacheNames = await caches.keys()
          await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))
        }
        
        // Limpar localStorage
        localStorage.clear()
        sessionStorage.clear()
        
        // Forçar reload completo
        window.location.reload()
      } catch (error) {
        console.error('Erro ao atualizar:', error)
        // Fallback: reload simples
        window.location.reload()
      }
    }
  }

  const handleDismissUpdate = () => {
    setShowUpdateNotification(false)
    setWaitingWorker(null)
  }


  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {/* Notificação de Atualização - DESATIVADA (usando ForceUpdate.tsx) */}
      {false && showUpdateNotification && (
        <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <p className="font-semibold">Nova versão disponível!</p>
                <p className="text-sm text-blue-100">Atualize para ver as melhorias</p>
              </div>
            </div>
            <button
              onClick={handleDismissUpdate}
              className="text-blue-200 hover:text-white ml-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleUpdateClick}
              className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              Atualizar Agora
            </button>
            <button
              onClick={handleDismissUpdate}
              className="text-blue-200 hover:text-white text-sm"
            >
              Depois
            </button>
          </div>
        </div>
      )}

      {/* Botão de Instalação */}
      {!isInstalled && showInstallButton && (
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
      )}
    </div>
  )
}
