# 🧪 GUIA COMPLETO DE TESTES - STRIPE

## 📋 **CARTÕES DE TESTE DO STRIPE**

### ✅ **CARTÕES QUE FUNCIONAM (Pagamento Aprovado):**
```
Número: 4242 4242 4242 4242
CVV: Qualquer 3 dígitos (ex: 123)
Data: Qualquer data futura (ex: 12/25)
Nome: Qualquer nome (ex: João Silva)
```

### ❌ **CARTÕES QUE FALHAM (Para testar erros):**
```
Número: 4000 0000 0000 0002 (Cartão recusado)
Número: 4000 0000 0000 9995 (Fundos insuficientes)
Número: 4000 0000 0000 0069 (Cartão expirado)
Número: 4000 0000 0000 0119 (Erro de processamento)
```

## 🎯 **CENÁRIOS DE TESTE**

### **TESTE 1: Pagamento Bem-sucedido**
1. Acesse: https://meuportalfit.com/todos-protocolos
2. Clique em qualquer protocolo ($10.00)
3. Use cartão: `4242 4242 4242 4242`
4. **Resultado esperado:** ✅ Pagamento aprovado + Download automático

### **TESTE 2: Pagamento Recusado**
1. Mesmo processo acima
2. Use cartão: `4000 0000 0000 0002`
3. **Resultado esperado:** ❌ Erro "Seu cartão foi recusado"

### **TESTE 3: Pacote Completo**
1. Acesse: https://meuportalfit.com/todos-protocolos
2. Clique em "Obter Pacote Completo" ($67.00)
3. Use cartão: `4242 4242 4242 4242`
4. **Resultado esperado:** ✅ PDF combinado com todos os protocolos

### **TESTE 4: E-mail de Confirmação**
1. Faça qualquer pagamento bem-sucedido
2. **Resultado esperado:** 📧 E-mail enviado para o endereço usado

## 🔍 **O QUE VERIFICAR**

### **Durante o Pagamento:**
- [ ] Redirecionamento para Stripe funciona
- [ ] Campos do cartão aparecem corretamente
- [ ] Validação de dados funciona
- [ ] Botão "Pagar" funciona

### **Após Pagamento Bem-sucedido:**
- [ ] Redirecionamento para página de sucesso
- [ ] Download automático inicia
- [ ] E-mail de confirmação enviado
- [ ] Notificação push aparece (se habilitada)

### **Após Pagamento Recusado:**
- [ ] Erro exibido claramente
- [ ] Usuário pode tentar novamente
- [ ] Não há cobrança no cartão

## 🚨 **PROBLEMAS COMUNS**

### **Erro 500 no Checkout:**
- **Causa:** Chaves Stripe incorretas
- **Solução:** Verificar se são chaves de TESTE

### **Download não funciona:**
- **Causa:** Problema com Supabase Storage
- **Solução:** Verificar arquivos no bucket

### **E-mail não enviado:**
- **Causa:** Problema com Resend
- **Solução:** Verificar RESEND_API_KEY

## 📱 **TESTE EM DIFERENTES DISPOSITIVOS**

### **Desktop:**
- Chrome, Firefox, Safari
- Diferentes resoluções de tela

### **Mobile:**
- iOS Safari
- Android Chrome
- Teste de responsividade

## 🎯 **PRÓXIMOS PASSOS**

1. **Teste todos os cenários** acima
2. **Anote qualquer problema** encontrado
3. **Confirme que tudo funciona** antes de ir para produção
4. **Quando estiver pronto:** Trocar para chaves LIVE

---
**💡 DICA:** Mantenha este guia aberto durante os testes!
