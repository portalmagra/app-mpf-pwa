const CACHE_NAME = 'meuportalfit-v1.0.0';
const urlsToCache = [
  '/',
  '/avaliacao',
  '/resultados',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Instalado com sucesso');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Erro na instalação', error);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Ativado com sucesso');
      return self.clients.claim();
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  // Estratégia: Cache First para recursos estáticos, Network First para APIs
  if (event.request.url.includes('/api/')) {
    // Para APIs: Network First
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Se a requisição foi bem-sucedida, retorna a resposta
          return response;
        })
        .catch(() => {
          // Se falhou, tenta buscar no cache
          return caches.match(event.request);
        })
    );
  } else {
    // Para recursos estáticos: Cache First
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Se encontrou no cache, retorna
          if (response) {
            return response;
          }
          
          // Se não encontrou, busca na rede
          return fetch(event.request).then((response) => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para o cache
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
        })
    );
  }
});

// Notificações Push (para futuras implementações)
self.addEventListener('push', (event) => {
  console.log('📱 Service Worker: Notificação push recebida');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização disponível!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Detalhes',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('MeuPortalFit', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Service Worker: Notificação clicada');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
