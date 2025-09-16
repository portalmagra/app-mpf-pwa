// Script para forçar limpeza de cache no iOS
console.log('🍎 iOS Cache Clear Script');
console.log('========================');

// Função para detectar iOS
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

// Função para limpar cache
function clearIOSCache() {
  if (isIOS()) {
    console.log('📱 iOS detectado - Aplicando limpeza de cache...');
    
    // Limpar localStorage
    localStorage.clear();
    
    // Limpar sessionStorage
    sessionStorage.clear();
    
    // Limpar cache do Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
          console.log('🗑️ Service Worker removido');
        });
      });
    }
    
    // Forçar reload sem cache
    window.location.reload(true);
  } else {
    console.log('💻 Não é iOS - Cache não limpo');
  }
}

// Executar se estiver no browser
if (typeof window !== 'undefined') {
  clearIOSCache();
}

module.exports = { isIOS, clearIOSCache };
