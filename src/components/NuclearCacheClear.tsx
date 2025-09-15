'use client'

import { useEffect } from 'react'

export default function NuclearCacheClear() {
  useEffect(() => {
    const performNuclearCacheClear = () => {
      const currentVersion = '1.0.7'
      const storedVersion = localStorage.getItem('app-version')
      
      // Detectar se é mobile
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())
      
      // Para mobile, sempre forçar atualização
      const shouldForceUpdate = storedVersion !== currentVersion || isMobile
      
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
        
        // 6. Para mobile, usar reload mais agressivo
        if (isMobile) {
          // Limpar histórico de navegação
          if ('history' in window && 'replaceState' in window.history) {
            window.history.replaceState(null, '', window.location.href)
          }
          
          // Forçar reload com timestamp único e parâmetros extras
          const timestamp = Date.now()
          const url = new URL(window.location.href)
          url.searchParams.set('_cb', timestamp.toString())
          url.searchParams.set('_v', currentVersion)
          url.searchParams.set('_t', Math.random().toString(36).substring(7))
          url.searchParams.set('_mobile', '1')
          url.searchParams.set('_force', '1')
          
          console.log('🚀 MOBILE RELOAD:', url.toString())
          
          // Usar location.replace para evitar histórico
          window.location.replace(url.toString())
        } else {
          // Desktop - reload normal
          const timestamp = Date.now()
          const url = new URL(window.location.href)
          url.searchParams.set('_cb', timestamp.toString())
          url.searchParams.set('_v', currentVersion)
          
          console.log('🚀 DESKTOP RELOAD:', url.toString())
          window.location.href = url.toString()
        }
      }
    }

    // Executar imediatamente
    performNuclearCacheClear()

    // Detectar se é mobile para frequência diferente
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())
    
    // Mobile: verificar a cada 1 segundo, Desktop: a cada 5 segundos
    const intervalTime = isMobile ? 1000 : 5000
    const interval = setInterval(performNuclearCacheClear, intervalTime)

    // Verificar quando ganha foco
    const handleFocus = () => {
      setTimeout(performNuclearCacheClear, 100)
    }
    
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(performNuclearCacheClear, 100)
      }
    })

    // Verificar quando volta de background (mobile)
    document.addEventListener('resume', () => {
      setTimeout(performNuclearCacheClear, 100)
    })

    // Para mobile, também verificar quando a página carrega
    if (isMobile) {
      window.addEventListener('load', () => {
        setTimeout(performNuclearCacheClear, 2000)
      })
    }

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  return null
}
