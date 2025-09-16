// Script para forçar limpeza completa de cache
console.log('🧹 Force Cache Clear Script');
console.log('==========================');

// Função para detectar dispositivo
function getDeviceInfo() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid;
  
  return { isIOS, isAndroid, isMobile };
}

// Função para limpar cache completo
function forceClearCache() {
  const { isIOS, isAndroid, isMobile } = getDeviceInfo();
  
  console.log(`📱 Dispositivo: ${isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'}`);
  
  // Limpar localStorage
  localStorage.clear();
  console.log('🗑️ localStorage limpo');
  
  // Limpar sessionStorage
  sessionStorage.clear();
  console.log('🗑️ sessionStorage limpo');
  
  // Limpar cache do Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.log('🗑️ Service Worker removido');
      });
    });
  }
  
  // Limpar cache do navegador (se suportado)
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
        console.log(`🗑️ Cache ${name} removido`);
      });
    });
  }
  
  // Forçar reload sem cache
  if (isMobile) {
    console.log('🔄 Recarregando página sem cache...');
    window.location.reload(true);
  } else {
    console.log('🔄 Recarregando página...');
    window.location.reload();
  }
}

// Executar se estiver no browser
if (typeof window !== 'undefined') {
  forceClearCache();
}

module.exports = { getDeviceInfo, forceClearCache };
