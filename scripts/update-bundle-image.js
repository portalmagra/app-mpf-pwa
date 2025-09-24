#!/usr/bin/env node

/**
 * Script para atualizar a imagem do Pacote Completo no Stripe
 * Execute: node scripts/update-bundle-image.js
 */

const Stripe = require('stripe')

// Configure sua chave secreta do Stripe
const stripe = new Stripe('sk_live_SUA_CHAVE_SECRETA_AQUI')

// ID do produto bundle (você pode precisar ajustar este ID)
const BUNDLE_PRODUCT_ID = 'prod_T77FBm2NR4XH85' // ID do bundle no Stripe

// Nova imagem do pacote completo
const BUNDLE_IMAGE_URL = 'https://meuportalfit.com/images/protocolos/Todos%20Protocolos.jpg'

async function updateBundleImage() {
  console.log('🖼️ Atualizando imagem do Pacote Completo no Stripe...\n')
  
  try {
    // Primeiro, vamos listar os produtos para encontrar o bundle
    const products = await stripe.products.list({
      limit: 100
    })
    
    let bundleProduct = null
    
    // Procurar pelo produto bundle
    for (const product of products.data) {
      if (product.name.includes('Pacote Completo') || 
          product.name.includes('Todos os Protocolos') ||
          product.metadata?.protocol_id === 'bundle-completo') {
        bundleProduct = product
        break
      }
    }
    
    if (!bundleProduct) {
      console.log('❌ Produto bundle não encontrado. Produtos disponíveis:')
      products.data.forEach(p => {
        console.log(`   - ${p.name} (${p.id})`)
      })
      return
    }
    
    console.log(`📦 Produto encontrado: ${bundleProduct.name}`)
    console.log(`   Product ID: ${bundleProduct.id}`)
    
    // Atualizar o produto com a nova imagem
    const updatedProduct = await stripe.products.update(bundleProduct.id, {
      images: [BUNDLE_IMAGE_URL]
    })
    
    console.log(`\n✅ Imagem atualizada com sucesso!`)
    console.log(`   Product ID: ${updatedProduct.id}`)
    console.log(`   Image URL: ${BUNDLE_IMAGE_URL}`)
    console.log(`\n📋 Próximos passos:`)
    console.log(`1. Verifique o produto no Stripe Dashboard`)
    console.log(`2. Teste um checkout para ver a nova imagem`)
    console.log(`3. A imagem aparecerá no Stripe Checkout`)
    
  } catch (error) {
    console.error(`❌ Erro ao atualizar imagem do bundle:`, error.message)
  }
}

updateBundleImage().catch(console.error)
