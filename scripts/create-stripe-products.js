#!/usr/bin/env node

/**
 * Script para criar produtos no Stripe
 * Execute: node scripts/create-stripe-products.js
 */

const Stripe = require('stripe')

// Configure sua chave secreta do Stripe
const stripe = new Stripe('sk_live_SUA_CHAVE_SECRETA_AQUI')

const protocols = [
  { name: 'Protocolo Suporte com as Canetas Emagrecedoras', id: 'suporte-canetas-emagrecedoras', price: 1000 },
  { name: 'Protocolo Pre-Caneta', id: 'pre-caneta', price: 1000 },
  { name: 'Protocolo Pós-Caneta Manutenção', id: 'pos-caneta-manutencao', price: 1000 },
  { name: 'Protocolo Proteína e Massa Magra', id: 'proteina-massa-magra', price: 1000 },
  { name: 'Protocolo Intestino Livre', id: 'intestino-livre', price: 1000 },
  { name: 'Protocolo Náusea e Refluxo', id: 'nausea-refluxo', price: 1000 },
  { name: 'Protocolo Energia e Imunidade', id: 'energia-imunidade', price: 1000 },
  { name: 'Protocolo Imunidade Avançada', id: 'imunidade-avancada', price: 1000 },
  { name: 'Protocolo Detox Leve', id: 'detox-leve', price: 1000 },
  { name: 'Protocolo Anti-inflamatório', id: 'anti-inflamatorio', price: 1000 },
  { name: 'Protocolo Mulheres 40+', id: 'mulheres-40', price: 1000 },
  { name: 'Protocolo Pele, Cabelo e Unhas', id: 'pele-cabelo-unhas', price: 1000 },
  { name: 'Protocolo Sono e Ansiedade', id: 'sono-ansiedade', price: 1000 },
  { name: 'Protocolo Fitness e Performance', id: 'fitness-performance', price: 1000 },
  { name: 'Protocolo Alternativa Sem Caneta', id: 'alternativa-sem-caneta', price: 1000 },
]

async function createProducts() {
  console.log('🚀 Criando produtos no Stripe...\n')
  
  const createdProducts = []
  
  for (const protocol of protocols) {
    try {
      // Criar produto
      const product = await stripe.products.create({
        name: protocol.name,
        description: `Protocolo nutricional personalizado: ${protocol.name}`,
        metadata: {
          protocol_id: protocol.id,
          category: 'nutritional-protocol'
        }
      })
      
      // Criar preço
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: protocol.price, // $10 em centavos
        currency: 'usd',
        metadata: {
          protocol_id: protocol.id
        }
      })
      
      createdProducts.push({
        id: protocol.id,
        name: protocol.name,
        product_id: product.id,
        price_id: price.id
      })
      
      console.log(`✅ ${protocol.name}`)
      console.log(`   Product ID: ${product.id}`)
      console.log(`   Price ID: ${price.id}\n`)
      
    } catch (error) {
      console.error(`❌ Erro ao criar ${protocol.name}:`, error.message)
    }
  }
  
  // Criar produto bundle
  try {
    const bundleProduct = await stripe.products.create({
      name: 'Pacote Completo - Todos os Protocolos',
      description: 'Acesso completo a todos os 15 protocolos nutricionais por um preço especial',
      metadata: {
        protocol_id: 'bundle-completo',
        category: 'bundle'
      }
    })
    
    const bundlePrice = await stripe.prices.create({
      product: bundleProduct.id,
      unit_amount: 6700, // $67 em centavos
      currency: 'usd',
      metadata: {
        protocol_id: 'bundle-completo'
      }
    })
    
    createdProducts.push({
      id: 'bundle-completo',
      name: 'Pacote Completo',
      product_id: bundleProduct.id,
      price_id: bundlePrice.id
    })
    
    console.log(`✅ Pacote Completo`)
    console.log(`   Product ID: ${bundleProduct.id}`)
    console.log(`   Price ID: ${bundlePrice.id}\n`)
    
  } catch (error) {
    console.error(`❌ Erro ao criar bundle:`, error.message)
  }
  
  // Gerar código para substituir no arquivo stripe.ts
  console.log('📋 COPIE ESTE CÓDIGO PARA src/lib/stripe.ts:\n')
  console.log('export const STRIPE_PRODUCTS = {')
  createdProducts.forEach(product => {
    console.log(`  '${product.id}': '${product.price_id}',`)
  })
  console.log('}\n')
  
  console.log('🎉 Produtos criados com sucesso!')
}

createProducts().catch(console.error)

