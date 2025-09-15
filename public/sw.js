const CACHE_NAME = 'meuportalfit-v1.0.5';
const STATIC_CACHE_NAME = 'meuportalfit-static-v1.0.5';
const urlsToCache = [
  '/',
  '/avaliacao',
  '/resultados',
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
          // Limpar TODOS os caches antigos para forçar atualização no mobile
          console.log('🗑️ Service Worker: Removendo cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Ativado com sucesso - cache limpo');
      return self.clients.claim();
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições que não são HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }

  // Para APIs: sempre buscar na rede primeiro
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Se a requisição foi bem-sucedida, retorna a resposta
          return response;
        })
        .catch(() => {
          // Se falhou, tenta buscar no cache
          return caches.match(request);
        })
    );
    return;
  }

  // Para páginas HTML: SEMPRE buscar na rede primeiro (mobile-first)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request, {
        // Forçar atualização ultra-agressiva para mobile
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-Modified-Since': '0',
          'If-None-Match': '*'
        }
      })
        .then((response) => {
          // Se a resposta é válida, atualiza o cache
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Se falhou, busca no cache como último recurso
          return caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            // Se não encontrou no cache, retorna página offline
            return caches.match('/');
          });
        })
    );
    return;
  }

  // Para recursos estáticos (CSS, JS, imagens): Stale While Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((response) => {
        // Se a resposta é válida, atualiza o cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });

      // Retorna cache imediatamente se disponível, senão aguarda a rede
      return cachedResponse || fetchPromise;
    })
  );
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

// Detectar atualizações do Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notificar clientes sobre atualizações
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim().then(() => {
      // Notificar todos os clientes sobre a atualização
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_UPDATED',
            message: 'Nova versão disponível! Recarregue a página para ver as atualizações.'
          });
        });
      });
    })
  );
});
