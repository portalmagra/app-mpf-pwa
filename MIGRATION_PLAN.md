# 🚀 Plano de Migração: app.meuportalfit.com → meuportalfit.com

## 📋 Checklist de Migração

### ✅ Fase 1: Preparação e Documentação
- [x] Documentar todas as URLs atuais no código
- [ ] Verificar configurações do Vercel
- [ ] Documentar configurações do Stripe
- [ ] Documentar configurações do Facebook
- [ ] Documentar configurações do Google Analytics
- [ ] Criar backup das configurações

### 🔧 Fase 2: Código da Aplicação
- [ ] Atualizar URLs no layout.tsx
- [ ] Atualizar URLs no messages.ts
- [ ] Atualizar URLs no whatsapp.ts
- [ ] Atualizar URLs nos componentes
- [ ] Atualizar URLs nas APIs
- [ ] Atualizar URLs nos PDFs
- [ ] Atualizar URLs nas receitas
- [ ] Atualizar URLs nos protocolos

### 🌐 Fase 3: Serviços Externos
- [ ] Configurar novo domínio no Vercel
- [ ] Recriar webhook no Stripe
- [ ] Nova verificação no Facebook
- [ ] Nova propriedade no Google Analytics
- [ ] Atualizar configurações do OneSignal
- [ ] Verificar configurações do Resend

### 🧪 Fase 4: Deploy e Testes
- [ ] Deploy para produção
- [ ] Testar todas as funcionalidades
- [ ] Verificar integrações
- [ ] Testar webhooks
- [ ] Testar analytics
- [ ] Testar e-mails

## 📊 URLs Encontradas no Código

### 🔴 URLs que precisam ser alteradas (app.meuportalfit.com → meuportalfit.com):

#### Layout e Meta Tags:
- `src/app/layout.tsx` (3 ocorrências)
- `src/app/teste-meta-tags/page.tsx` (8 ocorrências)

#### APIs e Serviços:
- `src/app/api/send-confirmation-email/route.ts` (2 ocorrências)
- `src/app/api/stripe/webhook/route.ts` (1 ocorrência)
- `src/app/api/stripe/checkout/route.ts` (2 ocorrências)
- `src/app/api/protocols/download/route.ts` (1 ocorrência)

#### Componentes e Páginas:
- `src/lib/supabase.ts` (5 ocorrências)
- `src/app/admin-receitas/page.tsx` (1 ocorrência)
- `src/app/admin-protocolos/page.tsx` (4 ocorrências)
- `src/components/ImageUpload.tsx` (3 ocorrências)

#### PDFs e Apresentações:
- `src/app/api/generate-pdf/route.ts` (4 ocorrências)
- `src/app/api/generate-presentation/route.ts` (2 ocorrências)
- `src/app/api/generate-presentation-original/route.ts` (1 ocorrência)

#### Configurações:
- `src/config/whatsapp.ts` (1 ocorrência)

### 🟡 URLs que já estão corretas (meuportalfit.com):

#### Brand e Logos:
- `src/lib/messages.ts` (3 ocorrências) ✅
- `src/app/api/notifications/send/route.ts` (8 ocorrências) ✅

#### E-mails e Suporte:
- `src/app/success/page.tsx` (1 ocorrência) ✅
- `src/app/protocolos/download/page.tsx` (1 ocorrência) ✅

#### Amazon Links:
- `src/app/api/search-real-amazon/route.ts` (20 ocorrências) ✅
- `src/app/admin/page.tsx` (1 ocorrência) ✅
- `src/app/api/analyze/route.ts` (2 ocorrências) ✅

## 🔧 Variáveis de Ambiente

### Atuais:
- `NEXT_PUBLIC_SITE_URL=https://app.meuportalfit.com`
- `NEXT_PUBLIC_BASE_URL=https://app.meuportalfit.com`

### Novas:
- `NEXT_PUBLIC_SITE_URL=https://meuportalfit.com`
- `NEXT_PUBLIC_BASE_URL=https://meuportalfit.com`

## 📈 Estatísticas

### Total de arquivos com URLs:
- **38 ocorrências** de `app.meuportalfit.com`
- **104 ocorrências** de `meuportalfit.com` (algumas já corretas)

### Arquivos que precisam de alteração:
- **15 arquivos** principais
- **~50 URLs** para alterar

## ⏱️ Tempo Estimado

- **Preparação:** 30 minutos ✅
- **Código:** 45 minutos
- **Serviços:** 60 minutos
- **Testes:** 30 minutos
- **Total:** ~3 horas

## 🚨 Pontos de Atenção

1. **Stripe Webhook:** Recriar completamente
2. **Facebook Pixel:** Nova verificação de domínio
3. **Google Analytics:** Nova propriedade
4. **DNS:** Configurar redirecionamento
5. **Cache:** Limpar cache do Vercel
6. **Testes:** Verificar todas as integrações

## 📝 Próximos Passos

1. ✅ Documentação completa
2. 🔄 Começar alterações no código
3. 🔄 Configurar serviços externos
4. 🔄 Deploy e testes
