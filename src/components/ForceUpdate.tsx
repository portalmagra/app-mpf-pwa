'use client'

import { useEffect, useState } from 'react'

export default function ForceUpdate() {
  const [showUpdate, setShowUpdate] = useState(false)

  useEffect(() => {
    // Detectar se é iPhone
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    
    if (isIOS) {
      // Verificar se há Service Worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'FORCE_RELOAD') {
            setShowUpdate(true)
          }
        })
      }
      
      // Verificar se há atualizações pendentes
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration && registration.waiting) {
            setShowUpdate(true)
          }
        })
      }
    }
  }, [])

  const handleForceUpdate = () => {
    // Limpar tudo e recarregar
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister()
        })
      })
    }
    
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName)
        })
      })
    }
    
    // Recarregar com cache busting
    window.location.href = window.location.href + '?v=' + Date.now()
  }

  if (!showUpdate) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Atualização Necessária
          </h2>
          <p className="text-gray-600 mb-6">
            Detectamos uma nova versão com o logo atualizado e melhorias!
          </p>
          
          <button
            onClick={handleForceUpdate}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            🔄 Atualizar Agora
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            Esta atualização irá limpar completamente o cache e recarregar o app.
          </p>
        </div>
      </div>
    </div>
  )
}
