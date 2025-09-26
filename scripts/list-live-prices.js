require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

async function listLivePrices() {
  console.log('🔍 Listando todos os preços em modo Live...\n');

  try {
    // Listar todos os preços
    const prices = await stripe.prices.list({ 
      limit: 100,
      active: true 
    });

    console.log(`📋 Total de preços encontrados: ${prices.data.length}\n`);

    // Agrupar por lookup_key (protocol ID)
    const priceMap = {};
    
    prices.data.forEach(price => {
      if (price.lookup_key) {
        priceMap[price.lookup_key] = price.id;
      }
    });

    console.log('📋 MAPEAMENTO DE PREÇOS LIVE:');
    console.log('const priceMap = {');
    Object.entries(priceMap).forEach(([protocolId, priceId]) => {
      console.log(`  '${protocolId}': '${priceId}',`);
    });
    console.log('}');

    console.log('\n🔍 Detalhes dos preços:');
    prices.data.forEach(price => {
      if (price.lookup_key) {
        console.log(`\n📋 ${price.lookup_key}:`);
        console.log(`   Price ID: ${price.id}`);
        console.log(`   Valor: $${(price.unit_amount / 100).toFixed(2)}`);
        console.log(`   Moeda: ${price.currency}`);
        console.log(`   Ativo: ${price.active ? '✅' : '❌'}`);
        console.log(`   Produto: ${price.product}`);
      }
    });

  } catch (error) {
    console.error('❌ Erro ao listar preços:', error.message);
  }
}

listLivePrices().catch(console.error);
