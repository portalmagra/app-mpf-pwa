// Configuração do OneSignal
export const ONESIGNAL_CONFIG = {
  appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '',
  apiKey: process.env.NEXT_PUBLIC_ONESIGNAL_API_KEY || '',
  restApiKey: process.env.ONESIGNAL_REST_API_KEY || '',
  userAuthKey: process.env.ONESIGNAL_USER_AUTH_KEY || ''
}

// Função para inicializar OneSignal
export const initializeOneSignal = () => {
  if (typeof window === 'undefined') return

  // Verificar se OneSignal já foi carregado
  if (window.OneSignal) {
    return window.OneSignal
  }

  // Carregar OneSignal SDK
  const script = document.createElement('script')
  script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
  script.async = true
  
  document.head.appendChild(script)

  return new Promise((resolve) => {
    script.onload = () => {
      if (window.OneSignal) {
        window.OneSignal.init({
          appId: ONESIGNAL_CONFIG.appId,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: false // Desabilitar botão padrão
          }
        })
        resolve(window.OneSignal)
      }
    }
  })
}

// Função para enviar notificação
export const sendNotification = async (title: string, message: string, url?: string) => {
  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_CONFIG.restApiKey}`
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_CONFIG.appId,
        headings: { en: title },
        contents: { en: message },
        url: url || window.location.origin,
        included_segments: ['All']
      })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('Notificação enviada:', result)
      return result
    } else {
      throw new Error('Falha ao enviar notificação')
    }
  } catch (error) {
    console.error('Erro ao enviar notificação:', error)
    throw error
  }
}

// Função para obter estatísticas
export const getNotificationStats = async () => {
  try {
    const response = await fetch(`https://onesignal.com/api/v1/apps/${ONESIGNAL_CONFIG.appId}`, {
      headers: {
        'Authorization': `Basic ${ONESIGNAL_CONFIG.restApiKey}`
      }
    })

    if (response.ok) {
      const result = await response.json()
      return result
    } else {
      throw new Error('Falha ao obter estatísticas')
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    throw error
  }
}

// Declaração de tipos para TypeScript
declare global {
  interface Window {
    OneSignal: any
  }
}
