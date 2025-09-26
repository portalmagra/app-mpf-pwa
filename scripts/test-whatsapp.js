/**
 * Script para testar URLs do WhatsApp
 */

const phoneNumber = '17862535032';
const message = 'Olá! Teste do MeuPortalFit';

// Testar diferentes formatos de URL
const testUrls = [
  // Formato padrão
  `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
  
  // Formato com +1
  `https://wa.me/+1${phoneNumber}?text=${encodeURIComponent(message)}`,
  
  // Formato direto
  `https://wa.me/1${phoneNumber}?text=${encodeURIComponent(message)}`,
  
  // Formato sem código do país
  `https://wa.me/7862535032?text=${encodeURIComponent(message)}`,
  
  // Formato WhatsApp Web
  `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`,
  
  // Formato alternativo
  `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
];

console.log('🧪 Testando URLs do WhatsApp...\n');

testUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

console.log('\n📱 Teste manual:');
console.log('1. Abra o navegador no celular');
console.log('2. Cole uma das URLs acima');
console.log('3. Verifique se abre o WhatsApp');
console.log('4. Teste em diferentes dispositivos (iOS, Android)');

console.log('\n🔍 Possíveis problemas:');
console.log('- Número de telefone incorreto');
console.log('- Formato da URL incorreto');
console.log('- WhatsApp não instalado');
console.log('- Bloqueio de pop-ups');
console.log('- PWA não configurado corretamente');

console.log('\n✅ Soluções:');
console.log('- Usar window.location.href em vez de window.open');
console.log('- Verificar se o número está correto');
console.log('- Testar em diferentes navegadores');
console.log('- Adicionar fallback para WhatsApp Web');
