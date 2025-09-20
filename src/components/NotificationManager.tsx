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
        // OneSignal inicializado - prompt será mostrado automaticamente quando necessário
      }).catch(error => {
        console.error('❌ Erro ao inicializar OneSignal:', error)
      })
    }
  }, [appId])

  return null // Este componente não renderiza nada visível - Deploy fix
}
