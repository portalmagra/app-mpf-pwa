'use client'

import { useState, useEffect } from 'react'

export function useNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
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
    if (!isSupported) return false

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      
      if (result === 'granted') {
        await subscribeToPush()
        return true
      }
      return false
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error)
      return false
    }
  }

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_ONESIGNAL_KEY
      })
      
      setSubscription(subscription)
      await sendSubscriptionToServer(subscription)
      
      return true
    } catch (error) {
      console.error('Erro ao inscrever para push:', error)
      return false
    }
  }

  const sendSubscriptionToServer = async (subscription: PushSubscription) => {
    try {
      console.log('Subscription:', subscription)
      // TODO: Implementar envio para OneSignal
    } catch (error) {
      console.error('Erro ao enviar subscription:', error)
    }
  }

  const unsubscribeFromPush = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe()
        setSubscription(null)
        return true
      }
      return false
    } catch (error) {
      console.error('Erro ao desinscrever:', error)
      return false
    }
  }

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    unsubscribeFromPush,
    isSubscribed: !!subscription
  }
}
