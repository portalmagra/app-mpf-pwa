#!/usr/bin/env node

/**
 * Script para atualizar produtos no Stripe com imagens (versão corrigida)
 * Execute: node scripts/update-stripe-product-images-fixed.js
 */

const Stripe = require('stripe')

// Configure sua chave secreta do Stripe
const stripe = new Stripe('sk_live_SUA_CHAVE_SECRETA_AQUI')

// Mapeamento dos produtos com suas imagens (URLs corrigidas)
const productImages = {
  'prod_T77FUKfdXUSVQm': 'https://meuportalfit.com/images/protocolos/PROTOCOLO%20SUPORTE%20COM%20AS%20CANETAS%20EMAGRECEDORAS.jpg',
  'prod_T77FJUlmo9oWsq': 'https://meuportalfit.com/images/protocolos/PROTOCOLO-SONO-and-ANSIEDADE%20(2).jpg',
  'prod_T77F2qiLgBRA6v': 'https://meuportalfit.com/images/protocolos/PROTOCOLO%20ALTERNATIVA%20SEM%20CANETA.jpg',
  'prod_T77FBm2NR4XH85': 'https://meuportalfit.com/images/protocolos/PROTOCOLO%20SUPORTE%20COM%20AS%20CANETAS%20EMAGRECEDORAS.jpg'
}

async function updateProductImages() {
  console.log('🖼️ Atualizando imagens dos produtos restantes no Stripe...\n')
  
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

