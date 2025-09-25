require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

// Price IDs que estão sendo usados no código
const currentPriceIds = {
  'suporte-canetas-emagrecedoras': 'price_1SAvLOEVE42ibKnX0ePJB9Vd',
  'pre-caneta': 'price_1SAvLPEVE42ibKnXr2zgyC3I',
  'pos-caneta-manutencao': 'price_1SAvLQEVE42ibKnX8xFO3fNk',
  'proteina-massa-magra': 'price_1SAvLQEVE42ibKnXvDuVnZrG',
  'intestino-livre': 'price_1SAvLREVE42ibKnXxB3PdkLq',
  'pacote-completo': 'price_1SAvLSEVE42ibKnXseU0nD6V'
};

async function checkActivePrices() {
  console.log('🔍 Verificando status dos price IDs...\n');

  for (const [protocolId, priceId] of Object.entries(currentPriceIds)) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      
      console.log(`📋 ${protocolId}:`);
      console.log(`   Price ID: ${priceId}`);
      console.log(`   Status: ${price.active ? '✅ ATIVO' : '❌ INATIVO'}`);
      console.log(`   Valor: $${(price.unit_amount / 100).toFixed(2)}`);
      console.log(`   Moeda: ${price.currency}`);
      console.log(`   Produto: ${price.product}`);
      
      if (!price.active) {
        console.log(`   ⚠️  PROBLEMA: Este price ID está INATIVO!`);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`❌ ${protocolId}:`);
      console.log(`   Price ID: ${priceId}`);
      console.log(`   Erro: ${error.message}`);
      console.log('');
    }
  }

  // Verificar se existem preços ativos para os produtos
  console.log('🔍 Verificando preços ativos para cada produto...\n');
  
  const productIds = new Set();
  for (const [protocolId, priceId] of Object.entries(currentPriceIds)) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      productIds.add(price.product);
    } catch (error) {
      console.log(`❌ Não foi possível verificar produto para ${protocolId}`);
    }
  }

  for (const productId of productIds) {
    try {
      const product = await stripe.products.retrieve(productId);
      const prices = await stripe.prices.list({ 
        product: productId, 
        active: true 
      });
      
      console.log(`📦 Produto: ${product.name} (${productId})`);
      console.log(`   Preços ativos: ${prices.data.length}`);
      
      if (prices.data.length === 0) {
        console.log(`   ⚠️  PROBLEMA: Nenhum preço ativo encontrado!`);
      } else {
        prices.data.forEach(price => {
          console.log(`   ✅ ${price.id}: $${(price.unit_amount / 100).toFixed(2)}`);
        });
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`❌ Erro ao verificar produto ${productId}: ${error.message}`);
    }
  }
}

checkActivePrices().catch(console.error);
