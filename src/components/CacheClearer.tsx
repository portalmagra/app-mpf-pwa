'use client'

import { useEffect } from 'react'

export default function CacheClearer() {
  useEffect(() => {
    // Forçar limpeza de cache quando a versão mudar
    const clearOldCache = async () => {
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        
        // Limpar TODOS os caches antigos
        for (const cacheName of cacheNames) {
          if (cacheName.includes('meuportalfit') || cacheName.includes('portalfit-v2.0.0')) {
            console.log('🗑️ Limpando cache antigo:', cacheName)
            await caches.delete(cacheName)
          }
        }
        
        // Limpar também localStorage antigo
        const oldKeys = Object.keys(localStorage).filter(key => 
          key.includes('meuportalfit') || key.includes('portal-fit')
        )
        oldKeys.forEach(key => localStorage.removeItem(key))
      }
    }

    clearOldCache()
  }, [])

  return null
}
