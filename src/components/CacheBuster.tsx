'use client'

import { useEffect } from 'react'

export default function CacheBuster() {
  useEffect(() => {
    // Verificar se há uma versão nova no localStorage
    const checkForUpdates = () => {
      const currentVersion = '1.0.5'
      const storedVersion = localStorage.getItem('app-version')
      
      if (storedVersion !== currentVersion) {
        // Limpar todos os caches silenciosamente
        if ('caches' in window) {
          caches.keys().then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
              caches.delete(cacheName)
            })
          })
        }
        
        // Atualizar versão no localStorage
        localStorage.setItem('app-version', currentVersion)
        
        // Forçar reload silencioso com cache busting
        const url = new URL(window.location.href)
        url.searchParams.set('_cb', Date.now().toString())
        window.location.href = url.toString()
      }
    }

    // Verificar imediatamente
    checkForUpdates()

    // Verificar a cada 5 segundos (mais frequente)
    const interval = setInterval(checkForUpdates, 5000)

    // Verificar quando a página ganha foco (mobile)
    const handleFocus = () => {
      setTimeout(checkForUpdates, 1000)
    }
    
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(checkForUpdates, 1000)
      }
    })

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  return null
}
