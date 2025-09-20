'use client'

import { useEffect, useState } from 'react'

export default function IOSUpdateManager() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detectar iOS
    const userAgent = navigator.userAgent
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent)
    setIsIOS(isIOSDevice)

    // Verificar se há atualizações do Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          setShowUpdatePrompt(true)
        }
      })
    }
  }, [])

  const handleUpdate = () => {
    // Forçar atualização completa
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister()
        })
      })
    }
    
    // Limpar todos os caches
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName)
        })
      })
    }
    
    // Recarregar a página
    window.location.reload()
  }

  if (!isIOS || !showUpdatePrompt) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Atualização Disponível
          </h2>
          <p className="text-gray-600 mb-6">
            Uma nova versão do MeuPortalFit está disponível com melhorias e o novo logo!
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleUpdate}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              🔄 Atualizar Agora
            </button>
            
            <button
              onClick={() => setShowUpdatePrompt(false)}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Depois
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            💡 Dica: Para atualizações futuras, vá em Configurações {'>'} Safari {'>'} Avançado {'>'} Website Data e limpe os dados do MeuPortalFit
          </p>
        </div>
      </div>
    </div>
  )
}
