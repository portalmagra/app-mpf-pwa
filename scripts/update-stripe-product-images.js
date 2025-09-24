#!/usr/bin/env node

/**
 * Script para atualizar produtos no Stripe com imagens
 * Execute: node scripts/update-stripe-product-images.js
 */

const Stripe = require('stripe')

// Configure sua chave secreta do Stripe
const stripe = new Stripe('sk_live_SUA_CHAVE_SECRETA_AQUI')

// Mapeamento dos produtos com suas imagens
const productImages = {
  'prod_T77FUKfdXUSVQm': 'https://meuportalfit.com/images/protocolos/PROTOCOLO SUPORTE COM AS CANETAS EMAGRECEDORAS.jpg',
  'prod_T77F7Fb4JT6jdC': 'https://meuportalfit.com/images/protocolos/PROTOCOLO-PRE-CANETA.jpg',
  'prod_T77F6KvSUCWpLR': 'https://meuportalfit.com/images/protocolos/PROTOCOLO-POS-CANETA-MANUTENCAO.jpg',
  'prod_T77FZcKxBaFrXB': 'https://meuportalfit.com/images/protocolos/PROTOCOLO-PROTEINA-and-MASSA-MAGRA.jpg',
  'prod_T77FWMA5AhegHP': 'https://meuportalfit.com/images/protocolos/PROTOCOLO-INTESTINO-LIVRE.jpg',
  'prod_T77FNsaQrQHILU': 'https://meuportalfit.com/images/protocolos/PROTOCOLO-NAUSEA-and-REFLUXO.jpg',
  'prod_T77FfbyAzRnhc9': 'https://meuportalfit.com/images/protocolos/PROTOCOLO-ENERGIA-E-IMUNIDADE.jpg',
  'prod_T77FqYvRskbEsw': 'https://meuportalfit.com/images/protocolos/PROTOCOLO-IMUNIDADE-AVANCADA.jpg',
  'prod_T77FBlxWLBWhIt': 'https://meuportalfit.com/images/protocolos/PROTOCOLO-DETOX-LEVE.jpg',
  'prod_T77FYdWivk5882': 'https://meuportalfit.com/images/protocolos/PROTOCOLO-ANTI-INFLAMATORIO.jpg',
  'prod_T77FtWp7qZpKVU': 'https://meuportalfit.com/images/protocolos/PROTOCOLO-MULHERES-40.jpg',
  'prod_T77FfHkz3zlSw4': 'https://meuportalfit.com/images/protocolos/PROTOCOLO-PELE-CABELO-and-UNHAS.jpg',
  'prod_T77FJUlmo9oWsq': 'https://meuportalfit.com/images/protocolos/PROTOCOLO-SONO-and-ANSIEDADE (2).jpg',
  'prod_T77F5ltqVx05nh': 'https://meuportalfit.com/images/protocolos/PROTOCOLO-FITNESS-and-PERFORMANCE.jpg',
  'prod_T77F2qiLgBRA6v': 'https://meuportalfit.com/images/protocolos/PROTOCOLO ALTERNATIVA SEM CANETA.jpg',
  'prod_T77FBm2NR4XH85': 'https://meuportalfit.com/images/protocolos/PROTOCOLO SUPORTE COM AS CANETAS EMAGRECEDORAS.jpg' // Bundle usa a imagem principal
}

async function updateProductImages() {
  console.log('🖼️ Atualizando imagens dos produtos no Stripe...\n')
  
  let successCount = 0
  let errorCount = 0
  
  for (const [productId, imageUrl] of Object.entries(productImages)) {
    try {
      // Atualizar o produto com a imagem
      const updatedProduct = await stripe.products.update(productId, {
        images: [imageUrl]
      })
      
      console.log(`✅ ${updatedProduct.name}`)
      console.log(`   Product ID: ${productId}`)
      console.log(`   Image URL: ${imageUrl}\n`)
      
      successCount++
      
    } catch (error) {
      console.error(`❌ Erro ao atualizar produto ${productId}:`, error.message)
      errorCount++
    }
  }
  
  console.log(`\n🎉 Atualização concluída!`)
  console.log(`✅ Sucessos: ${successCount}`)
  console.log(`❌ Erros: ${errorCount}`)
  
  if (successCount > 0) {
    console.log(`\n📋 Próximos passos:`)
    console.log(`1. Verifique os produtos no Stripe Dashboard`)
    console.log(`2. Teste um checkout para ver as imagens`)
    console.log(`3. As imagens aparecerão no Stripe Checkout`)
  }
}

updateProductImages().catch(console.error)

