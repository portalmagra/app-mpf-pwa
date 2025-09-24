# 🚀 GUIA COMPLETO - CONFIGURAÇÃO STRIPE

## ✅ O QUE VOCÊ PRECISA:
- ✅ Chave Pública: `pk_live_SUA_CHAVE_PUBLICA_AQUI`
- ✅ Chave Secreta: `sk_live_SUA_CHAVE_SECRETA_AQUI`

## 🔧 PASSOS PARA CONFIGURAR:

### 1. 📝 CRIAR ARQUIVO .env.local
```bash
# Na raiz do projeto, crie o arquivo .env.local com:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_SUA_CHAVE_PUBLICA_AQUI
STRIPE_SECRET_KEY=sk_live_SUA_CHAVE_SECRETA_AQUI
STRIPE_WEBHOOK_SECRET=whsec_SUA_CHAVE_WEBHOOK_AQUI
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. 🛍️ CRIAR PRODUTOS NO STRIPE
```bash
# Execute o script para criar todos os produtos:
node scripts/create-stripe-products.js
```

### 3. 🔗 CONFIGURAR WEBHOOK
1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique em "Add endpoint"
3. URL: `https://seu-dominio.com/api/stripe/webhook`
4. Eventos: `checkout.session.completed`
5. Copie a chave do webhook (começa com `whsec_`)
6. Substitua no .env.local

### 4. 🧪 TESTAR LOCALMENTE
```bash
# Para testar localmente, use ngrok:
npx ngrok http 3000

# Depois configure o webhook com a URL do ngrok:
# https://abc123.ngrok.io/api/stripe/webhook
```

## 🎯 PRÓXIMOS PASSOS:

1. **Criar .env.local** com as chaves
2. **Executar script** para criar produtos
3. **Configurar webhook** no Stripe Dashboard
4. **Testar pagamentos** localmente
5. **Deploy** para produção

## ⚠️ IMPORTANTE:
- As chaves são LIVE (produção) - cuidado com testes!
- Configure o webhook antes de testar
- Use ngrok para testar webhooks localmente
- Mantenha as chaves seguras!

## 🔍 VERIFICAÇÃO:
Após configurar tudo, teste:
1. Acesse `/quiz`
2. Complete o quiz
3. Clique em "Obter Protocolo"
4. Deve redirecionar para Stripe Checkout
5. Após pagamento, deve voltar para `/success`

