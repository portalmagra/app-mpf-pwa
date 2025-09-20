# 🔔 Configuração do OneSignal

## 📋 Passo a Passo

### 1. Criar conta no OneSignal
1. Acesse: https://onesignal.com
2. Clique em "Sign Up Free"
3. Crie sua conta gratuita

### 2. Criar um novo app
1. No dashboard, clique em "New App/Website"
2. Escolha "Web Push"
3. Preencha:
   - **App Name**: MeuPortalFit
   - **Website URL**: https://seu-dominio.com
   - **Default Notification Icon URL**: https://seu-dominio.com/icon-192.png

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# OneSignal Configuration
NEXT_PUBLIC_ONESIGNAL_APP_ID=seu_app_id_aqui
NEXT_PUBLIC_ONESIGNAL_API_KEY=seu_api_key_aqui
ONESIGNAL_REST_API_KEY=seu_rest_api_key_aqui
ONESIGNAL_USER_AUTH_KEY=seu_user_auth_key_aqui
```

### 4. Onde encontrar as chaves

#### App ID:
- Dashboard → Settings → Keys & IDs → App ID

#### API Key:
- Dashboard → Settings → Keys & IDs → REST API Key

#### User Auth Key:
- Dashboard → Settings → Keys & IDs → User Auth Key

### 5. Testar notificações

1. Acesse `/admin`
2. Clique em "🔔 Notificações"
3. Ative as notificações no navegador
4. Envie uma notificação de teste

## 🎯 Funcionalidades Implementadas

### ✅ Sistema Completo:
- **Permissões**: Solicitação automática de permissão
- **Subscription**: Gerenciamento de inscrições
- **Painel Admin**: Interface para enviar notificações
- **Service Worker**: Suporte completo a push notifications
- **Hook personalizado**: `useNotifications()` para fácil uso

### 📱 Casos de Uso:
- **Lançamentos**: Novo eBook disponível
- **Promoções**: Descontos especiais
- **Lembretes**: Carrinho abandonado
- **Conteúdo**: Dicas diárias de receitas
- **Engajamento**: Conteúdo exclusivo

## 🚀 Próximos Passos

### 1. Configurar OneSignal
- Criar conta e obter chaves
- Configurar variáveis de ambiente
- Testar envio de notificações

### 2. Implementar segmentação
- Usuários que compraram eBooks
- Usuários ativos vs inativos
- Por categoria de interesse

### 3. Automação
- Notificações automáticas para novos eBooks
- Lembretes de carrinho abandonado
- Campanhas de reengajamento

## 📊 Limites Gratuitos

- **30.000 usuários únicos**
- **30.000 notificações por mês**
- **Todas as funcionalidades** básicas
- **Analytics** completos
- **Segmentação** por comportamento

## 🔧 Troubleshooting

### Notificações não aparecem:
1. Verificar se o navegador suporta
2. Verificar permissões do usuário
3. Verificar configuração do OneSignal
4. Verificar Service Worker ativo

### Erro de CORS:
1. Verificar domínio configurado no OneSignal
2. Verificar HTTPS em produção
3. Verificar configuração do Service Worker

## 📞 Suporte

- **OneSignal Docs**: https://documentation.onesignal.com
- **Web Push Protocol**: https://web.dev/push-notifications/
- **Service Workers**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
