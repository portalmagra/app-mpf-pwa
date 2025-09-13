# Configuração do Cloudinary para Upload de Imagens

## 1. Criar Conta no Cloudinary

1. Acesse [cloudinary.com](https://cloudinary.com)
2. Clique em "Sign Up for Free"
3. Preencha os dados e confirme o email

## 2. Configurar Upload Preset

1. No dashboard do Cloudinary, vá em **Settings** > **Upload**
2. Clique em **Add upload preset**
3. Configure:
   - **Preset name**: `meuportalfit_recipes`
   - **Signing Mode**: `Unsigned` (para uploads diretos do frontend)
   - **Folder**: `meuportalfit/recipes`
   - **Transformation**: 
     - Width: 400
     - Height: 300
     - Crop: Fill
     - Quality: Auto
     - Format: Auto

## 3. Configurar Variáveis de Ambiente

Crie/edite o arquivo `.env.local`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=seu_cloud_name_aqui
CLOUDINARY_API_KEY=sua_api_key_aqui
CLOUDINARY_API_SECRET=seu_api_secret_aqui
```

## 4. Atualizar Configuração

Edite o arquivo `src/lib/cloudinary.ts` e substitua:

```typescript
export const cloudinaryConfig = {
  cloudName: 'seu_cloud_name_aqui', // Substitua pelo seu cloud name
  uploadPreset: 'meuportalfit_recipes',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
}
```

## 5. Testar Upload

1. Acesse `/admin-receitas`
2. Clique em "Escolher arquivo" na seção de imagem
3. Selecione uma imagem
4. A imagem deve aparecer no preview e ser salva automaticamente

## Benefícios do Cloudinary

- ✅ **Gratuito**: 25GB de armazenamento
- ✅ **CDN Global**: Imagens carregam rápido em qualquer lugar
- ✅ **Otimização Automática**: Redimensiona e comprime automaticamente
- ✅ **Transformações**: Pode aplicar filtros, cortes, etc.
- ✅ **Backup Automático**: Suas imagens ficam seguras

## Limites Gratuitos

- **Armazenamento**: 25GB
- **Bandwidth**: 25GB/mês
- **Transformações**: 25,000/mês
- **Uploads**: 25,000/mês

Para um app de receitas, esses limites são mais que suficientes!
