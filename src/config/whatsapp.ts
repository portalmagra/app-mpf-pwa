// Configuração oficial do WhatsApp MeuPortalFit
export const WHATSAPP_CONFIG = {
  OFFICIAL_NUMBER: '17862535032',
  BASE_URL: 'https://wa.me/',
  
  // Mensagens padrão
  MESSAGES: {
    COACH: 'Olá! Quero conversar sobre meu plano personalizado do MeuPortalFit.',
    PLAN: 'Olá! Quero receber meu plano personalizado do MeuPortalFit.',
    SHARE: 'Olha que legal! Encontrei um app que me ajudou a me adaptar aos EUA com saúde e bem-estar. É específico para brasileiras! 🇧🇷✨'
  }
};

// Função helper para gerar URLs do WhatsApp
export const getWhatsAppUrl = (message: string, number: string = WHATSAPP_CONFIG.OFFICIAL_NUMBER) => {
  return `${WHATSAPP_CONFIG.BASE_URL}${number}?text=${encodeURIComponent(message)}`;
};
