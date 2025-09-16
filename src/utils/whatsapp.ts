/**
 * Função utilitária para abrir WhatsApp de forma compatível com iOS e Android
 */
export const openWhatsApp = (phoneNumber: string = '17862535032', message?: string) => {
  const baseUrl = 'https://wa.me/';
  const whatsappUrl = message 
    ? `${baseUrl}${phoneNumber}?text=${encodeURIComponent(message)}`
    : `${baseUrl}${phoneNumber}`;

  // Detectar dispositivos móveis
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid;
  
  // Para PWAs em dispositivos móveis, usar location.href é mais confiável
  if (isMobile) {
    // Para PWAs instaladas, usar location.href diretamente
    window.location.href = whatsappUrl;
  } else {
    // Desktop - usar window.open
    window.open(whatsappUrl, '_blank');
  }
};

/**
 * Função alternativa mais simples para WhatsApp (fallback)
 */
export const openWhatsAppSimple = (phoneNumber: string = '17862535032', message?: string) => {
  const baseUrl = 'https://wa.me/';
  const whatsappUrl = message 
    ? `${baseUrl}${phoneNumber}?text=${encodeURIComponent(message)}`
    : `${baseUrl}${phoneNumber}`;

  // Sempre usar location.href para máxima compatibilidade
  window.location.href = whatsappUrl;
};

/**
 * Função específica para iOS PWAs
 */
export const openWhatsAppIOS = (phoneNumber: string = '17862535032', message?: string) => {
  const baseUrl = 'https://wa.me/';
  const whatsappUrl = message 
    ? `${baseUrl}${phoneNumber}?text=${encodeURIComponent(message)}`
    : `${baseUrl}${phoneNumber}`;

  // Para iOS PWAs instaladas, usar location.href é mais confiável
  if (window.matchMedia('(display-mode: standalone)').matches) {
    // PWA instalada - usar location.href
    window.location.href = whatsappUrl;
  } else {
    // PWA não instalada - tentar window.open primeiro
    try {
      const newWindow = window.open(whatsappUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        // Se não conseguiu abrir nova aba, usar location.href
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      // Fallback para location.href
      window.location.href = whatsappUrl;
    }
  }
};

/**
 * Função para compartilhar conteúdo via WhatsApp
 */
export const shareViaWhatsApp = (text: string, phoneNumber: string = '17862535032') => {
  const message = `${text}\n\n📱 Portal Fit - Brasileiros nos EUA`;
  openWhatsApp(phoneNumber, message);
};
