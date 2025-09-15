'use client'

import { useEffect } from 'react'

export default function CacheBuster() {
  useEffect(() => {
    // Verificar se há uma versão nova no localStorage
    const checkForUpdates = () => {
      const currentVersion = '1.0.4'
      const storedVersion = localStorage.getItem('app-version')
      
      if (storedVersion !== currentVersion) {
        console.log('🔄 Nova versão detectada, limpando cache...')
        
        // Limpar todos os caches
        if ('caches' in window) {
          caches.keys().then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
              caches.delete(cacheName)
            })
          })
        }
        
        // Atualizar versão no localStorage
        localStorage.setItem('app-version', currentVersion)
        
        // Forçar reload com cache busting
        const url = new URL(window.location.href)
        url.searchParams.set('_cb', Date.now().toString())
        window.location.href = url.toString()
      }
    }

    // Verificar imediatamente
    checkForUpdates()

    // Verificar a cada 10 segundos
    const interval = setInterval(checkForUpdates, 10000)

    return () => clearInterval(interval)
  }, [])

  return null
}
