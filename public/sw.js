const CACHE_NAME = 'meuportalfit-v3.3.0';
const STATIC_CACHE_NAME = 'meuportalfit-static-v3.3.0';
const urlsToCache = [
  '/',
  '/avaliacao',
  '/resultados',
  '/manifest.json',
  '/logo-final-completo.svg',
  '/logo-final-solo-m.svg',
  '/favicon.ico'
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
      // Forçar reload de todos os clientes
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'FORCE_RELOAD',
            message: 'Cache limpo - recarregando página'
          });
        });
        return self.clients.claim();
      });
    })
  );
});

// Listener para mensagens dos clientes
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('🔄 Service Worker: Recebido SKIP_WAITING');
    self.skipWaiting();
  }
});

// Listener para Push Notifications
self.addEventListener('push', (event) => {
  console.log('🔔 Service Worker: Push recebido', event);
  
  if (event.data) {
    const data = event.data.json();
    console.log('📋 Dados da notificação:', data);
    
    const options = {
      body: data.body || 'Nova notificação do MeuPortalFit',
      icon: '/logo-final-solo-m.svg',
      badge: '/logo-final-solo-m.svg',
      image: data.image || '/logo-final-completo.svg',
      data: data.data || {},
      actions: [
        {
          action: 'open',
          title: 'Abrir App',
          icon: '/logo-final-solo-m.svg'
        },
        {
          action: 'dismiss',
          title: 'Fechar'
        }
      ],
      requireInteraction: true,
      silent: false,
      tag: data.tag || 'meuportalfit-notification',
      renotify: true
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'MeuPortalFit', options)
    );
  }
});

// Listener para cliques em notificações
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Service Worker: Notificação clicada', event);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    // Abrir o app
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Se já há uma janela aberta, focar nela
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Se não há janela aberta, abrir nova
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Listener para fechamento de notificações
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Service Worker: Notificação fechada', event);
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

  // Para páginas HTML: NUNCA usar cache (nuclear approach)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request, {
        // Nuclear cache busting
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-Modified-Since': '0',
          'If-None-Match': '*',
          'X-Cache-Bust': Date.now().toString()
        }
      })
        .then((response) => {
          // NÃO armazenar no cache - sempre buscar na rede
          return response;
        })
        .catch(() => {
          // Se falhou, retorna página offline básica
          return new Response(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>MeuPortalFit - Offline</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
              </head>
              <body>
                <h1>Conectando...</h1>
                <p>Verificando atualizações...</p>
                <script>
                  setTimeout(() => window.location.reload(), 2000);
                </script>
              </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
    return;
  }

  // Para recursos estáticos (CSS, JS, imagens): Stale While Revalidate
  // Só fazer cache de requisições GET
  if (request.method === 'GET') {
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
        }).catch((error) => {
          console.error('❌ Erro no fetch:', error);
          // Retorna resposta em cache se disponível
          return cachedResponse;
        });

        // Retorna cache imediatamente se disponível, senão aguarda a rede
        return cachedResponse || fetchPromise;
      })
    );
  } else {
    // Para requisições não-GET, apenas buscar na rede
    event.respondWith(fetch(request).catch((error) => {
      console.error('❌ Erro no fetch não-GET:', error);
      return new Response('Network error', { status: 503 });
    }));
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
