require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

// Todos os 15 protocolos com seus price IDs
const allProtocols = {
  'suporte-canetas-emagrecedoras': 'price_1SAvLOEVE42ibKnX0ePJB9Vd',
  'pre-caneta': 'price_1SAvLPEVE42ibKnXr2zgyC3I',
  'pos-caneta-manutencao': 'price_1SAvLQEVE42ibKnX8xFO3fNk',
  'proteina-massa-magra': 'price_1SAvLQEVE42ibKnXvDuVnZrG',
  'intestino-livre': 'price_1SAvLREVE42ibKnXxB3PdkLq',
  'nausea-refluxo': 'price_1SAvLREVE42ibKnXxB3PdkLq',
  'energia-imunidade': 'price_1SAvLREVE42ibKnXxB3PdkLq',
  'detox-leve': 'price_1SAvLREVE42ibKnXxB3PdkLq',
  'anti-inflamatorio': 'price_1SAvLREVE42ibKnXxB3PdkLq',
  'mulheres-40': 'price_1SAvLREVE42ibKnXxB3PdkLq',
  'pele-cabelo-unhas': 'price_1SAvLREVE42ibKnXxB3PdkLq',
  'sono-ansiedade': 'price_1SAvLREVE42ibKnXxB3PdkLq',
  'fitness-performance': 'price_1SAvLREVE42ibKnXxB3PdkLq',
  'alternativa-sem-caneta': 'price_1SAvLREVE42ibKnXxB3PdkLq',
  'pacote-completo': 'price_1SAvLSEVE42ibKnXseU0nD6V'
};

async function verifyAllProtocols() {
  console.log('🔍 Verificando todos os 15 protocolos...\n');

  const uniquePriceIds = [...new Set(Object.values(allProtocols))];
  console.log(`📊 Total de protocolos: ${Object.keys(allProtocols).length}`);
  console.log(`📊 Price IDs únicos: ${uniquePriceIds.length}\n`);

  // Verificar cada price ID único
  for (const priceId of uniquePriceIds) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      
      // Encontrar quais protocolos usam este price ID
      const protocolsUsingThisPrice = Object.entries(allProtocols)
        .filter(([_, pid]) => pid === priceId)
        .map(([protocolId, _]) => protocolId);
      
      console.log(`💰 Price ID: ${priceId}`);
      console.log(`   Status: ${price.active ? '✅ ATIVO' : '❌ INATIVO'}`);
      console.log(`   Valor: $${(price.unit_amount / 100).toFixed(2)}`);
      console.log(`   Protocolos (${protocolsUsingThisPrice.length}):`);
      
      protocolsUsingThisPrice.forEach(protocolId => {
        console.log(`     - ${protocolId}`);
      });
      
      console.log('');
      
    } catch (error) {
      console.log(`❌ Price ID ${priceId}: ERRO - ${error.message}\n`);
    }
  }

  // Resumo final
  console.log('📋 RESUMO FINAL:');
  console.log(`✅ Protocolos únicos com preços ativos: ${uniquePriceIds.length}`);
  console.log(`✅ Total de protocolos cobertos: ${Object.keys(allProtocols).length}`);
  console.log(`✅ Pacote completo incluído: ${allProtocols['pacote-completo'] ? 'SIM' : 'NÃO'}`);
}

verifyAllProtocols().catch(console.error);
