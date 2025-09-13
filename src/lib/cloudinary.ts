// Configuração do Cloudinary
// Para usar em produção, você precisará criar uma conta gratuita em cloudinary.com
// e configurar as variáveis de ambiente

export const cloudinaryConfig = {
  cloudName: 'demo', // Substitua pelo seu cloud name
  uploadPreset: 'meuportalfit_recipes', // Preset que você criará no Cloudinary
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
}

// Função para gerar URL de upload
export function getCloudinaryUploadUrl() {
  return `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`
}

// Função para otimizar imagens
export function getOptimizedImageUrl(publicId: string, width = 400, height = 300) {
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/w_${width},h_${height},c_fill,f_auto,q_auto/${publicId}`
}
