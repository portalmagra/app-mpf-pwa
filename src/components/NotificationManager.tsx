'use client'

import { useEffect } from 'react'
import OneSignal from 'react-onesignal'

interface NotificationManagerProps {
  appId: string
}

export default function NotificationManager({ appId }: NotificationManagerProps) {
  useEffect(() => {
    if (appId) {
      OneSignal.init({
        appId: appId,
        allowLocalhostAsSecure: true,
        serviceWorkerPath: '/sw.js',
        // Configurações específicas para iOS
        safari_web_id: appId
      }).then(() => {
        console.log('✅ OneSignal inicializado com sucesso!')
        
        // Forçar prompt de permissão após inicialização
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.OneSignal) {
            try {
              // Tentar diferentes métodos para mostrar prompt
              if (window.OneSignal.showSlidedownPrompt) {
                window.OneSignal.showSlidedownPrompt()
              } else if (window.OneSignal.showNativePrompt) {
                window.OneSignal.showNativePrompt()
              } else {
                // Fallback: solicitar permissão diretamente
                Notification.requestPermission().then(permission => {
                  console.log('Permissão de notificação:', permission)
                })
              }
            } catch (error) {
              console.log('Erro ao mostrar prompt:', error)
            }
          }
        }, 2000) // Aguardar 2 segundos para garantir inicialização
      }).catch(error => {
        console.error('❌ Erro ao inicializar OneSignal:', error)
      })
    }
  }, [appId])

  return null // Este componente não renderiza nada visível - Deploy fix
}
