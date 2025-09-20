'use client'

import { useEffect, useState } from 'react'

export default function ForceUpdate() {
  const [showUpdate, setShowUpdate] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

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

  const handleForceUpdate = async () => {
    try {
      setIsUpdating(true)

      // Limpar Service Workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        for (const registration of registrations) {
          await registration.unregister()
        }
      }
      
      // Limpar todos os caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName)
        }
      }
      
      // Limpar localStorage e sessionStorage
      try {
        localStorage.clear()
        sessionStorage.clear()
      } catch (e) {
        console.log('Erro ao limpar storage:', e)
      }
      
      // Forçar reload com múltiplas estratégias
      const currentUrl = window.location.href
      const separator = currentUrl.includes('?') ? '&' : '?'
      const newUrl = currentUrl + separator + 'v=' + Date.now() + '&force=' + Math.random()
      
      // Tentar diferentes métodos de reload
      setTimeout(() => {
        window.location.replace(newUrl)
      }, 500)
      
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
      setTimeout(() => {
        window.location.href = newUrl
      }, 1500)
      
    } catch (error) {
      console.error('Erro na atualização:', error)
      // Fallback simples
      window.location.reload()
    }
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
          
          <div className="space-y-3">
            <button
              onClick={handleForceUpdate}
              disabled={isUpdating}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                isUpdating 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isUpdating ? '🔄 Atualizando...' : '🔄 Atualizar Agora'}
            </button>
            
            <button
              onClick={() => setShowUpdate(false)}
              disabled={isUpdating}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Depois
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Esta atualização irá limpar completamente o cache e recarregar o app.
          </p>
        </div>
      </div>
    </div>
  )
}
