/**
 * Função utilitária para abrir WhatsApp de forma compatível com iOS
 */
export const openWhatsApp = (phoneNumber: string = '17862535032', message?: string) => {
  const baseUrl = 'https://wa.me/';
  const whatsappUrl = message 
    ? `${baseUrl}${phoneNumber}?text=${encodeURIComponent(message)}`
    : `${baseUrl}${phoneNumber}`;

  // Detectar iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  // Para iOS, usar location.href é mais confiável em PWAs
  if (isIOS) {
    window.location.href = whatsappUrl;
  } else {
    window.open(whatsappUrl, '_blank');
  }
};

/**
 * Função para compartilhar conteúdo via WhatsApp
 */
export const shareViaWhatsApp = (text: string, phoneNumber: string = '17862535032') => {
  const message = `${text}\n\n📱 Portal Fit - Brasileiros nos EUA`;
  openWhatsApp(phoneNumber, message);
};
