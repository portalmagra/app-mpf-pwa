'use client'

import { useState } from 'react'

export default function SimpleNotificationTest() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  const checkSupport = () => {
    if ('Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
      console.log('✅ Notificações suportadas:', Notification.permission)
    } else {
      console.log('❌ Notificações não suportadas')
    }
  }

  const requestPermission = async () => {
    if (!isSupported) return

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      console.log('📋 Permissão:', result)
      
      if (result === 'granted') {
        alert('✅ Permissão concedida! Agora você pode receber notificações.')
      } else {
        alert('❌ Permissão negada. Ative nas configurações do navegador.')
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error)
    }
  }

  const sendTestNotification = () => {
    if (permission !== 'granted') {
      alert('❌ Permissão não concedida. Clique em "Solicitar Permissão" primeiro.')
      return
    }

    try {
      const notification = new Notification('🎉 Teste MeuPortalFit!', {
        body: 'Esta é uma notificação de teste do MeuPortalFit!',
        icon: '/logo-final-solo-m.svg',
        badge: '/logo-final-solo-m.svg',
        tag: 'test-notification',
        requireInteraction: true,
        silent: false
      })

      notification.onclick = () => {
        console.log('Notificação clicada!')
        window.focus()
        notification.close()
      }

      notification.onclose = () => {
        console.log('Notificação fechada!')
      }

      console.log('✅ Notificação de teste enviada!')
    } catch (error) {
      console.error('Erro ao enviar notificação:', error)
      alert('❌ Erro ao enviar notificação de teste')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        🔔 Teste Simples de Notificações
      </h2>
      
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Status:</p>
          {!isSupported ? (
            <p className="text-red-600">❌ Não suportado</p>
          ) : permission === 'granted' ? (
            <p className="text-green-600">✅ Ativado</p>
          ) : permission === 'denied' ? (
            <p className="text-red-600">❌ Bloqueado</p>
          ) : (
            <p className="text-yellow-600">⚠️ Pendente</p>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={checkSupport}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            🔍 Verificar Suporte
          </button>

          {isSupported && permission !== 'granted' && (
            <button
              onClick={requestPermission}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              🔔 Solicitar Permissão
            </button>
          )}

          {permission === 'granted' && (
            <button
              onClick={sendTestNotification}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
            >
              📤 Enviar Teste
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>Este é um teste simples usando a API nativa do navegador.</p>
          <p>Se funcionar aqui, o OneSignal também funcionará.</p>
        </div>
      </div>
    </div>
  )
}
