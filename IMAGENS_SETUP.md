# 📸 Como Adicionar Imagens às Receitas

## Método Simples (Recomendado)

### 1. Preparar as Imagens
- Salve suas imagens JPG na pasta `public/images/recipes/`
- Use nomes descritivos: `receita-1.jpg`, `receita-2.jpg`, etc.

### 2. URLs das Imagens
As URLs ficam automaticamente:
```
https://app.meuportalfit.com/images/recipes/receita-1.jpg
https://app.meuportalfit.com/images/recipes/receita-2.jpg
```

### 3. Adicionar na Área Admin
1. Acesse `/admin-receitas`
2. No campo "Imagem da Receita", cole a URL completa
3. A imagem aparecerá automaticamente no preview

## Estrutura de Pastas

```
public/
  images/
    recipes/
      receita-1.jpg
      receita-2.jpg
      receita-3.jpg
      ...
```

## Vantagens desta Solução

✅ **Gratuito** - Sem custos adicionais  
✅ **Rápido** - CDN automático do Vercel  
✅ **Simples** - Apenas copiar arquivos  
✅ **Confiável** - Hospedado no mesmo servidor  
✅ **URLs limpas** - Fáceis de lembrar e compartilhar  

## Exemplo Prático

1. **Salve a imagem:** `public/images/recipes/smoothie-verde.jpg`
2. **URL gerada:** `https://app.meuportalfit.com/images/recipes/smoothie-verde.jpg`
3. **Cole na admin:** Campo "Imagem da Receita"
4. **Resultado:** Imagem aparece automaticamente nas receitas!

## Dicas

- **Tamanho ideal:** 400x300 pixels
- **Formato:** JPG (menor tamanho)
- **Qualidade:** 80-90% (boa qualidade, tamanho otimizado)
- **Nomes:** Use hífens em vez de espaços: `smoothie-verde.jpg`
