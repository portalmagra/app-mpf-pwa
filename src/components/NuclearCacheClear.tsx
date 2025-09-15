'use client'

import { useEffect } from 'react'

export default function NuclearCacheClear() {
  useEffect(() => {
    const performNuclearCacheClear = () => {
      const currentVersion = '1.0.6'
      const storedVersion = localStorage.getItem('app-version')
      
      if (storedVersion !== currentVersion) {
        console.log('🧹 NUCLEAR CACHE CLEAR - Versão:', currentVersion)
        
        // 1. Limpar TODOS os caches
        if ('caches' in window) {
          caches.keys().then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
              caches.delete(cacheName)
            })
          })
        }
        
        // 2. Limpar localStorage completamente
        localStorage.clear()
        
        // 3. Limpar sessionStorage
        sessionStorage.clear()
        
        // 4. Limpar IndexedDB se existir
        if ('indexedDB' in window) {
          try {
            indexedDB.deleteDatabase('app-db')
          } catch (e) {
            console.log('IndexedDB não encontrado')
          }
        }
        
        // 5. Atualizar versão
        localStorage.setItem('app-version', currentVersion)
        
        // 6. Forçar reload com timestamp único
        const timestamp = Date.now()
        const url = new URL(window.location.href)
        url.searchParams.set('_cb', timestamp.toString())
        url.searchParams.set('_v', currentVersion)
        url.searchParams.set('_t', Math.random().toString(36).substring(7))
        
        console.log('🚀 Reloading with URL:', url.toString())
        window.location.href = url.toString()
      }
    }

    // Executar imediatamente
    performNuclearCacheClear()

    // Verificar a cada 3 segundos (mais agressivo)
    const interval = setInterval(performNuclearCacheClear, 3000)

    // Verificar quando ganha foco
    const handleFocus = () => {
      setTimeout(performNuclearCacheClear, 500)
    }
    
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(performNuclearCacheClear, 500)
      }
    })

    // Verificar quando volta de background (mobile)
    document.addEventListener('resume', () => {
      setTimeout(performNuclearCacheClear, 500)
    })

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  return null
}
