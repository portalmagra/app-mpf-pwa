/**
 * Utilitário para rastreamento de UTM parameters e eventos personalizados
 */

// Função para extrair UTM parameters da URL
export const getUTMParameters = () => {
  if (typeof window === 'undefined') return {}
  
  const urlParams = new URLSearchParams(window.location.search)
  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_term: urlParams.get('utm_term'),
    utm_content: urlParams.get('utm_content'),
  }
}

// Função para enviar evento personalizado para todos os Analytics
export const trackEvent = (eventName: string, parameters: any = {}) => {
  if (typeof window === 'undefined') return
  
  const utmParams = getUTMParameters()
  const eventData = { ...parameters, ...utmParams }
  
  console.log('📊 Enviando evento:', eventName, eventData)
  
  // Google Analytics 4
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, eventData)
  }
  
  // Facebook Pixel
  if ((window as any).fbq) {
    (window as any).fbq('track', eventName, eventData)
  }
  
  // Google Tag Manager
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      ...eventData
    })
  }
}

// Função para rastrear página
export const trackPageView = (pageName?: string) => {
  if (typeof window === 'undefined') return
  
  const utmParams = getUTMParameters()
  const pageData = {
    page_title: document.title,
    page_location: window.location.href,
    page_name: pageName || document.title,
    ...utmParams
  }
  
  console.log('📊 Enviando page view:', pageData)
  
  // Google Analytics 4
  if ((window as any).gtag) {
    (window as any).gtag('config', 'G-VY8X9VW8EF', pageData)
  }
  
  // Facebook Pixel
  if ((window as any).fbq) {
    (window as any).fbq('track', 'PageView', pageData)
  }
  
  // Google Tag Manager
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: 'page_view',
      ...pageData
    })
  }
}

// Função para rastrear compra
export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  if (typeof window === 'undefined') return
  
  const utmParams = getUTMParameters()
  const purchaseData = {
    transaction_id: transactionId,
    value: value,
    currency: 'USD',
    items: items,
    ...utmParams
  }
  
  console.log('📊 Enviando evento de compra:', purchaseData)
  
  // Google Analytics 4
  if ((window as any).gtag) {
    (window as any).gtag('event', 'purchase', purchaseData)
  }
  
  // Facebook Pixel
  if ((window as any).fbq) {
    (window as any).fbq('track', 'Purchase', purchaseData)
  }
  
  // Google Tag Manager
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: 'purchase',
      ...purchaseData
    })
  }
}

// Função para rastrear clique no WhatsApp
export const trackWhatsAppClick = (message?: string) => {
  trackEvent('whatsapp_click', {
    event_category: 'WhatsApp',
    event_label: 'Contact',
    message: message || 'Default message',
    value: 1
  })
}

// Função para rastrear download de protocolo
export const trackProtocolDownload = (protocolId: string, protocolName: string) => {
  trackEvent('protocol_download', {
    event_category: 'Download',
    event_label: protocolName,
    protocol_id: protocolId,
    protocol_name: protocolName,
    value: 1
  })
}

// Função para rastrear instalação do PWA
export const trackPWAInstall = () => {
  trackEvent('pwa_install', {
    event_category: 'PWA',
    event_label: 'Install',
    value: 1
  })
}

// Função para rastrear início do quiz
export const trackQuizStart = () => {
  trackEvent('quiz_start', {
    event_category: 'Quiz',
    event_label: 'Start',
    value: 1
  })
}

// Função para rastrear conclusão do quiz
export const trackQuizComplete = (results: any) => {
  trackEvent('quiz_complete', {
    event_category: 'Quiz',
    event_label: 'Complete',
    results: results,
    value: 1
  })
}
