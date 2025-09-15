'use client'

import { useEffect } from 'react'

export default function MobileSync() {
  useEffect(() => {
    // Detectar se é mobile
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())
    
    if (!isMobile) {
      return // Só executa no mobile
    }

    const forceMobileSync = () => {
      console.log('📱 MOBILE SYNC - Forçando sincronização...')
      
      // Limpar tudo
      localStorage.clear()
      sessionStorage.clear()
      
      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName)
          })
        })
      }
      
      // Forçar reload com parâmetros únicos
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(7)
      
      const url = new URL(window.location.href)
      url.searchParams.set('_mobile_sync', timestamp.toString())
      url.searchParams.set('_id', randomId)
      url.searchParams.set('_force', '1')
      url.searchParams.set('_v', '1.0.7')
      
      console.log('🔄 MOBILE RELOAD:', url.toString())
      
      // Usar replace para evitar histórico
      window.location.replace(url.toString())
    }

    // Executar imediatamente
    forceMobileSync()

    // Executar a cada 2 segundos no mobile
    const interval = setInterval(forceMobileSync, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return null
}
