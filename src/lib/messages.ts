/**
 * Mensagens padronizadas para WhatsApp e Notificações Push
 * MeuPortalFit - Wellness para Brasileiros
 */

export const BRAND_INFO = {
  name: 'MeuPortalFit',
  tagline: 'Wellness para Brasileiros',
  phone: '+17862535032',
  website: 'https://meuportalfit.com',
  whatsapp: 'https://wa.me/17862535032'
}

export const WHATSAPP_MESSAGES = {
  // Mensagem de boas-vindas
  welcome: `Olá! 👋 

Bem-vindo(a) ao *MeuPortalFit* - Wellness para Brasileiros! 🇧🇷

📚 *O que oferecemos:*
• eBooks exclusivos de receitas e dietas
• Avaliações personalizadas por IA
• Produtos curados especialmente para você
• Protocolos nutricionais de 7, 14 e 30 dias

🎯 *Como posso te ajudar hoje?*
• Fazer uma avaliação personalizada
• Conhecer nossos eBooks
• Ver produtos recomendados
• Agendar consulta com nossa coach brasileira

📱 *MeuPortalFit* - Wellness para Brasileiros
🌐 ${BRAND_INFO.website}`,

  // Mensagem para compra de eBook
  ebookPurchase: (title: string, price: number) => `Olá! 👋

Gostaria de comprar o eBook *"${title}"* por $${price.toFixed(2)}.

📚 *Detalhes do eBook:*
• Título: ${title}
• Preço: $${price.toFixed(2)}
• Formato: PDF digital
• Acesso: Imediato após pagamento

💳 *Como proceder com o pagamento?*

📱 *MeuPortalFit* - Wellness para Brasileiros
🌐 ${BRAND_INFO.website}`,

  // Mensagem para avaliação personalizada
  evaluation: `Olá! 👋

Gostaria de fazer uma *avaliação personalizada* no MeuPortalFit!

🎯 *O que você receberá:*
• Análise completa do seu perfil
• Recomendações personalizadas
• Protocolo nutricional específico
• eBooks recomendados para você

📋 *Para começar, preciso saber:*
• Sua idade
• Objetivos de saúde/bem-estar
• Restrições alimentares (se houver)
• Nível de atividade física

📱 *MeuPortalFit* - Wellness para Brasileiros
🌐 ${BRAND_INFO.website}`,

  // Mensagem para produtos Amazon
  amazonProducts: `Olá! 👋

Interessado(a) em nossos *produtos curados* na Amazon?

🛒 *O que oferecemos:*
• Seleção por Inteligência Artificial
• Produtos testados e aprovados
• Preços competitivos
• Entrega rápida nos EUA

💡 *Como funciona:*
1. Você me conta suas necessidades
2. Eu seleciono os melhores produtos
3. Envio os links da Amazon
4. Você compra com desconto (se disponível)

📱 *MeuPortalFit* - Wellness para Brasileiros
🌐 ${BRAND_INFO.website}`,

  // Mensagem para protocolos
  protocols: `Olá! 👋

Interessado(a) em nossos *protocolos nutricionais*?

📋 *Protocolos disponíveis:*
• 7 dias - Detox e limpeza
• 14 dias - Reeducação alimentar
• 30 dias - Transformação completa

🎯 *Cada protocolo inclui:*
• Plano alimentar personalizado
• Lista de compras
• Receitas exclusivas
• Acompanhamento via WhatsApp

📱 *MeuPortalFit* - Wellness para Brasileiros
🌐 ${BRAND_INFO.website}`
}

export const NOTIFICATION_MESSAGES = {
  // Notificações de boas-vindas
  welcome: {
    title: '🎉 Bem-vindo ao MeuPortalFit!',
    body: 'Wellness para Brasileiros - eBooks, receitas e avaliações personalizadas!',
    url: '/'
  },

  // Notificações de novos eBooks
  newEbook: (title: string) => ({
    title: '📚 Novo eBook Disponível!',
    body: `"${title}" - Confira já no MeuPortalFit!`,
    url: '/ebooks'
  }),

  // Notificações de promoções
  promotion: (discount: number) => ({
    title: '🔥 Promoção Especial!',
    body: `${discount}% de desconto em todos os eBooks! Aproveite!`,
    url: '/ebooks'
  }),

  // Notificações de lembretes
  reminder: {
    title: '⏰ Lembrete MeuPortalFit',
    body: 'Não esqueça de fazer sua avaliação personalizada hoje!',
    url: '/avaliacao'
  },

  // Notificações de novos produtos
  newProducts: {
    title: '🛒 Novos Produtos na Amazon!',
    body: 'Produtos curados especialmente para você! Confira agora.',
    url: '/amazon'
  },

  // Notificações de receitas
  newRecipe: (recipeName: string) => ({
    title: '🍽️ Nova Receita Disponível!',
    body: `"${recipeName}" - Ingredientes que você encontra nos EUA!`,
    url: '/receitas'
  }),

  // Notificações de protocolos
  newProtocol: (protocolName: string) => ({
    title: '📋 Novo Protocolo Nutricional!',
    body: `"${protocolName}" - Transforme sua alimentação em 30 dias!`,
    url: '/protocolos'
  })
}

// Função para gerar URL do WhatsApp com mensagem
export const generateWhatsAppUrl = (message: string, phoneNumber: string = BRAND_INFO.phone) => {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '')
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

// Função para abrir WhatsApp com mensagem
export const openWhatsAppWithMessage = (message: string, phoneNumber: string = BRAND_INFO.phone) => {
  const url = generateWhatsAppUrl(message, phoneNumber)
  window.open(url, '_blank')
}

// Função para compartilhar conteúdo
export const shareContent = (content: string, type: 'ebook' | 'recipe' | 'protocol' | 'product') => {
  const baseMessage = `${content}\n\n📱 *MeuPortalFit* - Wellness para Brasileiros\n🌐 ${BRAND_INFO.website}`
  
  switch (type) {
    case 'ebook':
      return `${baseMessage}\n📚 eBooks exclusivos para brasileiros nos EUA!`
    case 'recipe':
      return `${baseMessage}\n🍽️ Receitas com ingredientes disponíveis nos EUA!`
    case 'protocol':
      return `${baseMessage}\n📋 Protocolos nutricionais personalizados!`
    case 'product':
      return `${baseMessage}\n🛒 Produtos curados especialmente para você!`
    default:
      return baseMessage
  }
}
