'use client'

import { useEffect, useState } from 'react'
import OneSignal from 'react-onesignal'

interface NotificationManagerProps {
  appId: string
}

export default function NotificationManager({ appId }: NotificationManagerProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Verificar se estamos na área administrativa
    const isAdminArea = window.location.pathname.includes('/admin')
    
    console.log('🔍 NotificationManager: Verificando inicialização...', {
      appId: appId ? 'Configurado' : 'Não configurado',
      isAdminArea,
      isInitialized,
      userAgent: navigator.userAgent
    })
    
    if (appId && !isAdminArea && !isInitialized) {
      console.log('🚀 Inicializando OneSignal...')
      
      // Só inicializar OneSignal se NÃO estivermos na área admin
      OneSignal.init({
        appId: appId,
        allowLocalhostAsSecure: true,
        serviceWorkerPath: '/sw.js',
        // Configurações específicas para iOS
        safari_web_id: appId
      }).then(() => {
        console.log('✅ OneSignal inicializado com sucesso!')
        setIsInitialized(true)
        
        // Verificar se OneSignal está realmente funcionando
        OneSignal.getSubscription().then(subscription => {
          console.log('📱 Status da inscrição OneSignal:', subscription)
        }).catch(error => {
          console.log('❌ Erro ao verificar inscrição:', error)
        })
        
        // Forçar prompt de permissão após inicialização (apenas para usuários finais)
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            try {
              console.log('🔔 Solicitando permissão de notificação...')
              // Solicitar permissão diretamente usando API nativa
              if ('Notification' in window) {
                Notification.requestPermission().then(permission => {
                  console.log('📋 Resposta da permissão:', permission)
                  if (permission === 'granted') {
                    console.log('✅ Notificações autorizadas!')
                    // Tentar se inscrever no OneSignal após permissão
                    OneSignal.setSubscription(true).then(() => {
                      console.log('🎯 Inscrito no OneSignal com sucesso!')
                    }).catch(error => {
                      console.log('❌ Erro ao se inscrever no OneSignal:', error)
                    })
                  } else if (permission === 'denied') {
                    console.log('❌ Notificações negadas pelo usuário')
                  } else {
                    console.log('⚠️ Permissão pendente')
                  }
                }).catch(error => {
                  console.log('❌ Erro ao solicitar permissão:', error)
                })
              } else {
                console.log('❌ API Notification não suportada')
              }
            } catch (error) {
              console.log('❌ Erro geral ao solicitar permissão:', error)
            }
          }
        }, 3000) // Aguardar 3 segundos para garantir inicialização completa
      }).catch(error => {
        console.error('❌ Erro ao inicializar OneSignal:', error)
        // Tentar novamente após 5 segundos
        setTimeout(() => {
          console.log('🔄 Tentando reinicializar OneSignal...')
          setIsInitialized(false)
        }, 5000)
      })
    } else if (isAdminArea) {
      console.log('🔧 Área administrativa detectada - OneSignal não inicializado para admin')
    } else if (!appId) {
      console.log('⚠️ OneSignal App ID não configurado')
    } else if (isInitialized) {
      console.log('✅ OneSignal já inicializado')
    }
  }, [appId, isInitialized])

  return null // Este componente não renderiza nada visível
}
