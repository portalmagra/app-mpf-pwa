'use client'

import { useEffect } from 'react'

export default function NuclearCacheClear() {
  useEffect(() => {
    const performNuclearCacheClear = () => {
      const currentVersion = '1.0.8'
      const storedVersion = localStorage.getItem('app-version')
      
      // Detectar se é Safari no iPhone
      const isSafari = /safari/i.test(navigator.userAgent.toLowerCase()) && /iphone|ipad/i.test(navigator.userAgent.toLowerCase())
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())
      
      // Para Safari, ser mais conservador
      if (isSafari) {
        // Só atualizar se realmente necessário
        if (storedVersion !== currentVersion) {
          console.log('🧹 SAFARI CACHE CLEAR - Versão:', currentVersion)
          
          // Limpar caches
          if ('caches' in window) {
            caches.keys().then((cacheNames) => {
              cacheNames.forEach((cacheName) => {
                caches.delete(cacheName)
              })
            })
          }
          
          // Atualizar versão
          localStorage.setItem('app-version', currentVersion)
          
          // Reload simples para Safari
          const timestamp = Date.now()
          const url = new URL(window.location.href)
          url.searchParams.set('_cb', timestamp.toString())
          url.searchParams.set('_v', currentVersion)
          
          console.log('🚀 SAFARI RELOAD:', url.toString())
          window.location.href = url.toString()
        }
        return
      }
      
      // Para outros mobiles, comportamento normal
      const shouldForceUpdate = storedVersion !== currentVersion
      
      if (shouldForceUpdate) {
        console.log('🧹 NUCLEAR CACHE CLEAR - Versão:', currentVersion, 'Mobile:', isMobile)
        
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
        
        // 6. Reload normal
        const timestamp = Date.now()
        const url = new URL(window.location.href)
        url.searchParams.set('_cb', timestamp.toString())
        url.searchParams.set('_v', currentVersion)
        
        console.log('🚀 RELOAD:', url.toString())
        window.location.href = url.toString()
      }
    }

    // Executar imediatamente
    performNuclearCacheClear()

    // Detectar Safari
    const isSafari = /safari/i.test(navigator.userAgent.toLowerCase()) && /iphone|ipad/i.test(navigator.userAgent.toLowerCase())
    
    // Para Safari, verificar muito menos frequentemente
    if (isSafari) {
      // Safari: verificar a cada 30 segundos
      const interval = setInterval(performNuclearCacheClear, 30000)
      
      return () => {
        clearInterval(interval)
      }
    }
    
    // Para outros navegadores, comportamento normal
    const interval = setInterval(performNuclearCacheClear, 10000) // 10 segundos

    // Verificar quando ganha foco (menos agressivo)
    const handleFocus = () => {
      setTimeout(performNuclearCacheClear, 2000)
    }
    
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(performNuclearCacheClear, 2000)
      }
    })

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  return null
}
