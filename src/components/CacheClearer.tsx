'use client'

import { useEffect } from 'react'

export default function CacheClearer() {
  useEffect(() => {
    // Forçar limpeza de cache quando a versão mudar
    const clearOldCache = async () => {
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        
        // Limpar caches antigos do MeuPortalFit
        for (const cacheName of cacheNames) {
          if (cacheName.includes('meuportalfit')) {
            console.log('🗑️ Limpando cache antigo:', cacheName)
            await caches.delete(cacheName)
          }
        }
      }
    }

    clearOldCache()
  }, [])

  return null
}
