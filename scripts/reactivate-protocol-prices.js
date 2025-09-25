require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

// Price IDs que precisam ser reativados
const priceIdsToReactivate = [
  'price_1SAvLOEVE42ibKnX0ePJB9Vd', // suporte-canetas-emagrecedoras
  'price_1SAvLPEVE42ibKnXr2zgyC3I', // pre-caneta
  'price_1SAvLQEVE42ibKnX8xFO3fNk', // pos-caneta-manutencao
  'price_1SAvLQEVE42ibKnXvDuVnZrG', // proteina-massa-magra
  'price_1SAvLREVE42ibKnXxB3PdkLq', // intestino-livre
  'price_1SAvLSEVE42ibKnXseU0nD6V'  // pacote-completo
];

async function reactivatePrices() {
  console.log('🔄 Reativando price IDs dos protocolos...\n');

  for (const priceId of priceIdsToReactivate) {
    try {
      // Reativar o preço
      const updatedPrice = await stripe.prices.update(priceId, {
        active: true
      });
      
      console.log(`✅ ${priceId}:`);
      console.log(`   Status: ${updatedPrice.active ? 'ATIVO' : 'INATIVO'}`);
      console.log(`   Valor: $${(updatedPrice.unit_amount / 100).toFixed(2)}`);
      console.log(`   Produto: ${updatedPrice.product}`);
      console.log('');
      
    } catch (error) {
      console.log(`❌ ${priceId}:`);
      console.log(`   Erro: ${error.message}`);
      console.log('');
    }
  }

  console.log('🎉 Processo de reativação concluído!');
  
  // Verificar status final
  console.log('\n🔍 Verificando status final...\n');
  
  for (const priceId of priceIdsToReactivate) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      console.log(`${priceId}: ${price.active ? '✅ ATIVO' : '❌ INATIVO'} - $${(price.unit_amount / 100).toFixed(2)}`);
    } catch (error) {
      console.log(`${priceId}: ❌ ERRO - ${error.message}`);
    }
  }
}

reactivatePrices().catch(console.error);
