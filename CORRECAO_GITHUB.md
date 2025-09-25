# 🚀 CORREÇÃO PARA FAZER NO GITHUB

## 📋 INSTRUÇÕES SIMPLES:

### 1. **ACESSE O GITHUB:**
- Vá para: https://github.com/portalmagra/app-mpf-pwa
- Clique em "Code" → "Open with GitHub Desktop" OU edite diretamente no navegador

### 2. **VÁ PARA O ARQUIVO:**
- Navegue até: `src/app/api/ebooks/download/route.ts`

### 3. **ENCONTRE A LINHA 154:**
Procure por esta linha:
```typescript
const { data: ebook, error } = await supabase
```

### 4. **ADICIONE ANTES DESSA LINHA:**
```typescript
// Verificar se supabase está configurado
if (!supabase) {
  console.error('❌ Supabase não configurado')
  return null
}
```

### 5. **RESULTADO FINAL:**
A função `getEbookData` deve ficar assim:

```typescript
async function getEbookData(ebookId: string) {
  try {
    // Verificar se supabase está configurado
    if (!supabase) {
      console.error('❌ Supabase não configurado')
      return null
    }

    // Buscar dados do eBook no Supabase
    const { data: ebook, error } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', ebookId)
      .eq('status', 'active')
      .single()

    if (error || !ebook) {
      console.error('❌ eBook não encontrado no Supabase:', error)
      return null
    }

    return {
      id: ebook.id,
      fileName: `${ebook.title}.pdf`,
      pdfUrl: ebook.pdf_link
    }

  } catch (error) {
    console.error('❌ Erro ao buscar eBook no Supabase:', error)
    return null
  }
}
```

### 6. **SALVE E COMMIT:**
- Clique em "Commit changes"
- Escreva: "Fix TypeScript error in ebooks download"
- Clique em "Commit changes"

### 7. **RESULTADO:**
- ✅ Build passará no Vercel
- ✅ Deploy funcionará automaticamente
- ✅ Sistema funcionando perfeitamente

## 🎯 **ISSO É TUDO!**

Depois disso, o Vercel fará o deploy automaticamente e tudo funcionará!
