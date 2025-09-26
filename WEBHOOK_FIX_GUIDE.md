# 🔧 Guia de Correção do Webhook Stripe

## ❌ Problema Identificado

A URL do webhook no Stripe está configurada incorretamente:
- **URL Atual:** `https://meuportalfit.com/api/stripe/webhook`
- **URL Correta:** `https://app.meuportalfit.com/api/stripe/webhook`

## ✅ Solução

### 1. Acessar o Dashboard do Stripe
1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Vá para **Desenvolvedores** → **Webhooks**
3. Encontre o webhook existente ou crie um novo

### 2. Configurar a URL Correta
- **URL do endpoint:** `https://app.meuportalfit.com/api/stripe/webhook`
- **Eventos:** `checkout.session.completed`
- **Descrição:** `Webhook para processar compras do MeuPortalFit`

### 3. Copiar o Webhook Secret
1. Após salvar o webhook, clique em **Revelar** no campo "Chave de assinatura"
2. Copie o valor que começa com `whsec_`
3. Atualize o arquivo `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_SEU_WEBHOOK_SECRET_CORRETO_AQUI
```

### 4. Verificar Configuração Atual
O arquivo `.env.local` já contém:
```env
NEXT_PUBLIC_SITE_URL=https://app.meuportalfit.com
STRIPE_WEBHOOK_SECRET=whsec_owVHnr41ivUAKlDzS72FIYDCTNUbybVISUPABASE_URL=https://ajuoqvpccdkpzkefjrsc.supabase.co
```

## 🧪 Teste da Correção

### 1. Testar Webhook
```bash
# Testar se o webhook está respondendo
curl https://app.meuportalfit.com/api/stripe/webhook
```

### 2. Fazer Compra de Teste
1. Acesse o site
2. Faça uma compra individual
3. Verifique se:
   - ✅ E-mail é enviado
   - ✅ Compra é registrada no Supabase
   - ✅ Console não mostra erro de assinatura

## 📋 Checklist de Verificação

- [ ] URL do webhook atualizada para `app.meuportalfit.com`
- [ ] Evento `checkout.session.completed` selecionado
- [ ] Webhook secret copiado e atualizado no `.env.local`
- [ ] Teste de compra realizado
- [ ] E-mail recebido
- [ ] Compra registrada no Supabase
- [ ] Console sem erros de assinatura

## 🔍 Logs para Monitorar

### Console do Servidor
```bash
# Deve mostrar:
✅ Processando pagamento: cs_test_xxx
✅ Compra registrada com sucesso
✅ E-mail de confirmação enviado automaticamente
```

### Console do Navegador
```bash
# Deve mostrar:
✅ E-mail de confirmação enviado!
✅ Download iniciado automaticamente!
```

## 🚨 Erros Comuns

### 1. "Assinatura inválida"
- **Causa:** Webhook secret incorreto
- **Solução:** Verificar se o `STRIPE_WEBHOOK_SECRET` está correto

### 2. "Webhook não encontrado"
- **Causa:** URL incorreta
- **Solução:** Verificar se a URL é `https://app.meuportalfit.com/api/stripe/webhook`

### 3. "Evento não processado"
- **Causa:** Evento `checkout.session.completed` não selecionado
- **Solução:** Adicionar o evento no webhook

## 📞 Suporte

Se ainda houver problemas:
1. Verificar logs do servidor
2. Testar com compra de valor baixo
3. Verificar configurações do Stripe
4. Confirmar que o domínio `app.meuportalfit.com` está funcionando

