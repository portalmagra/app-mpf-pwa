'use client'

import { useState, useEffect } from 'react'

export default function NotificationReminder() {
  const [showReminder, setShowReminder] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Verificar se estamos na área administrativa
    const isAdminArea = window.location.pathname.includes('/admin')
    if (isAdminArea) return

    // Verificar permissão atual
    if ('Notification' in window) {
      setPermission(Notification.permission)
      
      // Se não tem permissão e não foi dispensado, mostrar lembrete
      if (Notification.permission === 'default' || Notification.permission === 'denied') {
        const dismissed = localStorage.getItem('notification-reminder-dismissed')
        if (!dismissed) {
          // Aguardar 5 segundos antes de mostrar (para não ser muito invasivo)
          setTimeout(() => {
            setShowReminder(true)
          }, 5000)
        }
      }
    }
  }, [])

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission()
        setPermission(result)
        
        if (result === 'granted') {
          alert('✅ Notificações ativadas! Você receberá atualizações importantes do MeuPortalFit.')
          setShowReminder(false)
        } else {
          alert('❌ Notificações bloqueadas. Você pode ativar nas configurações do navegador.')
        }
      } catch (error) {
        console.error('Erro ao solicitar permissão:', error)
      }
    }
  }

  const handleDismiss = () => {
    setShowReminder(false)
    setIsDismissed(true)
    // Lembrar por 24 horas
    localStorage.setItem('notification-reminder-dismissed', Date.now().toString())
  }

  const handleDismissPermanently = () => {
    setShowReminder(false)
    setIsDismissed(true)
    // Nunca mais mostrar
    localStorage.setItem('notification-reminder-dismissed', 'permanent')
  }

  // Não mostrar se já tem permissão ou foi dispensado
  if (permission === 'granted' || isDismissed || !showReminder) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-lg">🔔</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Receba atualizações importantes!
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Ative as notificações para receber novos eBooks, promoções e dicas de saúde.
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleRequestPermission}
                className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors"
              >
                Ativar Notificações
              </button>
              
              <button
                onClick={handleDismiss}
                className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors"
              >
                Depois
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismissPermanently}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 text-sm"
            title="Não mostrar novamente"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
