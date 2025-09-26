# 📧 Integração Resend + Supabase - MeuPortalFit

Este guia mostra como configurar a integração entre Resend e Supabase para rastreamento completo de e-mails.

## 🎯 Objetivo

- **Rastrear** todos os e-mails enviados
- **Monitorar** status de entrega
- **Analisar** estatísticas de e-mail
- **Histórico** completo por cliente

## 📋 Pré-requisitos

- ✅ Resend configurado
- ✅ Supabase configurado
- ✅ Tabela `user_purchases` criada

## 🚀 Configuração

### 1. **Criar Tabela de Logs**

Execute o SQL no Supabase SQL Editor:

```sql
-- Execute o conteúdo do arquivo: supabase-email-logs.sql
```

### 2. **Verificar Configurações**

```env
# Resend
RESEND_API_KEY=re_SUA_CHAVE_AQUI
FROM_EMAIL=MeuPortalFit <noreply@meuportalfit.com>

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
```

### 3. **Testar Integração**

```bash
node test-resend-supabase-integration.js
```

## 📊 Funcionalidades

### **Logs de E-mail**
- ✅ Registro automático de todos os e-mails
- ✅ Status: sent, delivered, bounced, failed
- ✅ Timestamps de envio e entrega
- ✅ Mensagens de erro

### **Estatísticas**
- ✅ Total de e-mails enviados
- ✅ Taxa de entrega
- ✅ Taxa de bounce
- ✅ E-mails com falha

### **Busca por Cliente**
- ✅ Histórico completo por e-mail
- ✅ Protocolos relacionados
- ✅ Status de cada e-mail

## 🔧 APIs Disponíveis

### **Enviar E-mail**
```http
POST /api/send-confirmation-email
```

### **Buscar Logs**
```http
GET /api/email-logs?email=cliente@exemplo.com
```

### **Atualizar Status**
```http
POST /api/email-logs
```

## 📈 Monitoramento

### **Dashboard Supabase**
1. Acesse o Supabase Dashboard
2. Vá para "Table Editor"
3. Selecione a tabela `email_logs`
4. Visualize todos os e-mails enviados

### **Consultas Úteis**

```sql
-- E-mails enviados hoje
SELECT * FROM email_logs 
WHERE DATE(sent_at) = CURRENT_DATE;

-- E-mails com falha
SELECT * FROM email_logs 
WHERE status = 'failed';

-- Estatísticas gerais
SELECT * FROM get_email_stats();

-- E-mails por cliente
SELECT * FROM get_emails_by_customer('cliente@exemplo.com');
```

## 🚨 Troubleshooting

### **Erro: "Tabela não encontrada"**
- Execute o SQL de setup no Supabase
- Verifique se a tabela `email_logs` foi criada

### **Erro: "Permissão negada"**
- Verifique as políticas RLS
- Confirme a `SUPABASE_SERVICE_ROLE_KEY`

### **E-mails não registrados**
- Verifique os logs do servidor
- Confirme se o Supabase está acessível

## 📞 Suporte

- **Resend:** [resend.com/docs](https://resend.com/docs)
- **Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **Logs:** Verifique o console do servidor

---

**🎉 Integração completa! Agora você tem rastreamento total de e-mails!**

