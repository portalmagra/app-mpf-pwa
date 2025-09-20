'use client'

import { useState, useEffect } from 'react'

interface NotificationManagerProps {
  children: React.ReactNode
}

export default function NotificationManager({ children }: NotificationManagerProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    // Verificar se o navegador suporta notificações
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
      
      // Verificar se já existe uma subscription
      checkExistingSubscription()
    }
  }, [])

  const checkExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const existingSubscription = await registration.pushManager.getSubscription()
      setSubscription(existingSubscription)
    } catch (error) {
      console.error('Erro ao verificar subscription:', error)
    }
  }

  const requestPermission = async () => {
    if (!isSupported) {
      alert('Seu navegador não suporta notificações push')
      return
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      
      if (result === 'granted') {
        await subscribeToPush()
      } else {
        alert('Permissão para notificações negada')
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error)
    }
  }

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      
      // Configuração do OneSignal (será configurada depois)
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_ONESIGNAL_KEY
      })
      
      setSubscription(subscription)
      
      // Enviar subscription para o servidor (OneSignal)
      await sendSubscriptionToServer(subscription)
      
      console.log('✅ Inscrito para notificações push!')
    } catch (error) {
      console.error('Erro ao inscrever para push:', error)
    }
  }

  const sendSubscriptionToServer = async (subscription: PushSubscription) => {
    try {
      // Aqui você enviaria a subscription para o OneSignal
      // Por enquanto, vamos apenas logar
      console.log('Subscription:', subscription)
      
      // TODO: Implementar envio para OneSignal
      // await fetch('/api/onesignal/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(subscription)
      // })
    } catch (error) {
      console.error('Erro ao enviar subscription:', error)
    }
  }

  const unsubscribeFromPush = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe()
        setSubscription(null)
        console.log('❌ Desinscrito das notificações push')
      }
    } catch (error) {
      console.error('Erro ao desinscrever:', error)
    }
  }

  return (
    <>
      {children}
      
      {/* Botão de notificações para desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-20 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 border">
            <h3 className="font-bold text-sm mb-2">🔔 Notificações Push</h3>
            
            {!isSupported ? (
              <p className="text-xs text-red-600">Navegador não suporta</p>
            ) : permission === 'granted' ? (
              <div className="space-y-2">
                <p className="text-xs text-green-600">✅ Ativado</p>
                <button
                  onClick={unsubscribeFromPush}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                >
                  Desativar
                </button>
              </div>
            ) : (
              <button
                onClick={requestPermission}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
              >
                Ativar Notificações
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
