/**
 * Função utilitária para abrir WhatsApp de forma compatível com iOS e Android
 */
export const openWhatsApp = (phoneNumber: string = '17862535032', message?: string) => {
  // Limpar e formatar o número de telefone
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const formattedNumber = cleanNumber.startsWith('1') ? cleanNumber : `1${cleanNumber}`;
  
  const baseUrl = 'https://wa.me/';
  const whatsappUrl = message 
    ? `${baseUrl}${formattedNumber}?text=${encodeURIComponent(message)}`
    : `${baseUrl}${formattedNumber}`;

  console.log('📱 Tentando abrir WhatsApp:', { phoneNumber, formattedNumber, whatsappUrl });

  // Detectar dispositivos móveis
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid;
  const isPWA = window.matchMedia('(display-mode: standalone)').matches;
  
  console.log('📱 Detecção:', { isIOS, isAndroid, isMobile, isPWA });

  try {
    // Para PWAs em dispositivos móveis, usar location.href é mais confiável
    if (isMobile || isPWA) {
      console.log('📱 Usando location.href para mobile/PWA');
      window.location.href = whatsappUrl;
    } else {
      console.log('📱 Usando window.open para desktop');
      const newWindow = window.open(whatsappUrl, '_blank');
      
      // Verificar se a janela foi bloqueada
      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        console.log('📱 Pop-up bloqueado, usando location.href como fallback');
        window.location.href = whatsappUrl;
      }
    }
  } catch (error) {
    console.error('❌ Erro ao abrir WhatsApp:', error);
    // Fallback final
    window.location.href = whatsappUrl;
  }
};

/**
 * Função alternativa mais simples para WhatsApp (fallback)
 */
export const openWhatsAppSimple = (phoneNumber: string = '17862535032', message?: string) => {
  // Limpar e formatar o número de telefone
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const formattedNumber = cleanNumber.startsWith('1') ? cleanNumber : `1${cleanNumber}`;
  
  const baseUrl = 'https://wa.me/';
  const whatsappUrl = message 
    ? `${baseUrl}${formattedNumber}?text=${encodeURIComponent(message)}`
    : `${baseUrl}${formattedNumber}`;

  console.log('📱 WhatsApp Simple:', { phoneNumber, formattedNumber, whatsappUrl });

  // Sempre usar location.href para máxima compatibilidade
  window.location.href = whatsappUrl;
};

/**
 * Função específica para iOS PWAs
 */
export const openWhatsAppIOS = (phoneNumber: string = '17862535032', message?: string) => {
  // Limpar e formatar o número de telefone
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const formattedNumber = cleanNumber.startsWith('1') ? cleanNumber : `1${cleanNumber}`;
  
  const baseUrl = 'https://wa.me/';
  const whatsappUrl = message 
    ? `${baseUrl}${formattedNumber}?text=${encodeURIComponent(message)}`
    : `${baseUrl}${formattedNumber}`;

  console.log('📱 WhatsApp iOS:', { phoneNumber, formattedNumber, whatsappUrl });

  // Para iOS PWAs instaladas, usar location.href é mais confiável
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('📱 PWA instalada - usando location.href');
    window.location.href = whatsappUrl;
  } else {
    console.log('📱 PWA não instalada - tentando window.open');
    // PWA não instalada - tentar window.open primeiro
    try {
      const newWindow = window.open(whatsappUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        console.log('📱 window.open falhou - usando location.href');
        // Se não conseguiu abrir nova aba, usar location.href
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      console.error('❌ Erro no window.open:', error);
      // Fallback para location.href
      window.location.href = whatsappUrl;
    }
  }
};

/**
 * Função para compartilhar conteúdo via WhatsApp
 */
export const shareViaWhatsApp = (text: string, phoneNumber: string = '17862535032') => {
  const message = `${text}\n\n📱 MeuPortalFit - Brasileiros nos EUA`;
  openWhatsApp(phoneNumber, message);
};

/**
 * Função robusta com múltiplos fallbacks para WhatsApp
 */
export const openWhatsAppRobust = (phoneNumber: string = '17862535032', message?: string) => {
  // Limpar e formatar o número de telefone
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const formattedNumber = cleanNumber.startsWith('1') ? cleanNumber : `1${cleanNumber}`;
  
  console.log('📱 WhatsApp Robust:', { phoneNumber, formattedNumber, message });

  // Múltiplas URLs para testar
  const urls = [
    // URL principal
    message 
      ? `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`
      : `https://wa.me/${formattedNumber}`,
    
    // Fallback 1: WhatsApp Web
    message 
      ? `https://web.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`
      : `https://web.whatsapp.com/send?phone=${formattedNumber}`,
    
    // Fallback 2: Protocolo nativo
    message 
      ? `whatsapp://send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`
      : `whatsapp://send?phone=${formattedNumber}`,
    
    // Fallback 3: URL alternativa
    message 
      ? `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`
      : `https://api.whatsapp.com/send?phone=${formattedNumber}`
  ];

  // Detectar ambiente
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid;
  const isPWA = window.matchMedia('(display-mode: standalone)').matches;

  console.log('📱 Ambiente:', { isIOS, isAndroid, isMobile, isPWA });

  // Função para tentar abrir URL
  const tryOpenUrl = (url: string, index: number) => {
    console.log(`📱 Tentativa ${index + 1}: ${url}`);
    
    try {
      if (isMobile || isPWA) {
        // Mobile/PWA: usar location.href
        window.location.href = url;
      } else {
        // Desktop: tentar window.open
        const newWindow = window.open(url, '_blank');
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
          // Pop-up bloqueado, usar location.href
          window.location.href = url;
        }
      }
      return true;
    } catch (error) {
      console.error(`❌ Erro na tentativa ${index + 1}:`, error);
      return false;
    }
  };

  // Tentar cada URL sequencialmente
  for (let i = 0; i < urls.length; i++) {
    if (tryOpenUrl(urls[i], i)) {
      console.log(`✅ Sucesso na tentativa ${i + 1}`);
      break;
    }
    
    // Pequena pausa entre tentativas
    if (i < urls.length - 1) {
      setTimeout(() => {
        tryOpenUrl(urls[i + 1], i + 1);
      }, 100);
    }
  }
};
