'use client'

import { useState, useEffect } from 'react'

export default function MobileRefreshButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detectar se é mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as { opera?: string }).opera || ''
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
      setIsMobile(isMobileDevice)
    }

    checkMobile()

    // Mostrar botão após 5 segundos no mobile
    if (isMobile) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isMobile])

  const handleForceRefresh = () => {
    // Limpar todos os caches
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName)
        })
      })
    }

    // Limpar localStorage version para forçar atualização
    localStorage.removeItem('app-version')

    // Forçar reload com cache busting via URL
    const url = new URL(window.location.href)
    url.searchParams.set('_cb', Date.now().toString())
    window.location.href = url.toString()
  }

  if (!isMobile || !isVisible) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleForceRefresh}
        className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium"
        title="Forçar atualização (limpa cache)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>
  )
}
