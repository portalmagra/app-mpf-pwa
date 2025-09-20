'use client'

import { useState, useEffect } from 'react'

export default function NotificationButton() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    // Verificar se estamos na área administrativa
    const isAdminArea = window.location.pathname.includes('/admin')
    if (isAdminArea) return

    // Verificar se é PWA instalado
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone === true

    if ('Notification' in window) {
      setPermission(Notification.permission)
      
      // Mostrar botão se é PWA e não tem permissão
      if (isPWA && (Notification.permission === 'default' || Notification.permission === 'denied')) {
        setShowButton(true)
      }
    }
  }, [])

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission()
        setPermission(result)
        
        if (result === 'granted') {
          alert('✅ Notificações ativadas! Você receberá atualizações importantes.')
          setShowButton(false)
        } else {
          alert('❌ Notificações bloqueadas. Ative nas configurações do navegador.')
        }
      } catch (error) {
        console.error('Erro ao solicitar permissão:', error)
      }
    }
  }

  // Não mostrar se já tem permissão ou não é PWA
  if (!showButton || permission === 'granted') {
    return null
  }

  return (
    <button
      onClick={handleRequestPermission}
      className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
      title="Ativar notificações para receber atualizações"
    >
      <span>🔔</span>
      <span className="hidden sm:inline">Ativar Notificações</span>
    </button>
  )
}
