// Configuração oficial do WhatsApp MeuPortalFit
export const WHATSAPP_CONFIG = {
  OFFICIAL_NUMBER: '17862535032',
  BASE_URL: 'https://wa.me/',
  GROUP_LINK: 'https://chat.whatsapp.com/LqjNDHfumq0JG7Kb2W0Ygd',
  
  // Mensagens padrão
  MESSAGES: {
    COACH: 'Olá! Quero conversar sobre meu plano personalizado do MeuPortalFit.',
    PLAN: 'Olá! Quero receber meu plano personalizado do MeuPortalFit.',
    SHARE: 'Olha que legal! Encontrei um app brasileiro incrível para quem vive nos Estados Unidos 🇧🇷🇺🇸\n\n✨ Você pode fazer sua avaliação gratuita por inteligência artificial - avaliação de bem-estar por inteligência artificial gratuita\n🍽️ Receitas brasileiras\n🛒 Produtos para comprar direto na Amazon - produtos já selecionados que compra direto na Amazon\n👩‍💻 E se quiser tem uma Coach brasileira especializada para ajudar\n\nBaixe agora: https://app.meuportalfit.com\n\n#BrasileirasNosEUA #MeuPortalFit'
  }
};

// Função helper para gerar URLs do WhatsApp
export const getWhatsAppUrl = (message: string, number: string = WHATSAPP_CONFIG.OFFICIAL_NUMBER) => {
  return `${WHATSAPP_CONFIG.BASE_URL}${number}?text=${encodeURIComponent(message)}`;
};
