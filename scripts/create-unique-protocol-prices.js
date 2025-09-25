require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

// Todos os 15 protocolos com seus produtos existentes
const protocols = [
  {
    id: 'suporte-canetas-emagrecedoras',
    name: 'Protocolo Suporte com Canetas Emagrecedoras',
    productId: 'prod_T79eirzLvt5cod',
    price: 10.00
  },
  {
    id: 'pre-caneta',
    name: 'Protocolo Pré-Caneta',
    productId: 'prod_T79eCZQlp4wDKR',
    price: 10.00
  },
  {
    id: 'pos-caneta-manutencao',
    name: 'Protocolo Pós-Caneta Manutenção',
    productId: 'prod_T79edCNkraJMai',
    price: 10.00
  },
  {
    id: 'proteina-massa-magra',
    name: 'Protocolo Proteína e Massa Magra',
    productId: 'prod_T79eD0rJWYS1G8',
    price: 10.00
  },
  {
    id: 'intestino-livre',
    name: 'Protocolo Intestino Livre',
    productId: 'prod_T79eQnHzBxjP6G',
    price: 10.00
  },
  {
    id: 'nausea-refluxo',
    name: 'Protocolo Náusea e Refluxo',
    productId: 'prod_T79eQnHzBxjP6G', // Usando mesmo produto do intestino
    price: 10.00
  },
  {
    id: 'energia-imunidade',
    name: 'Protocolo Energia e Imunidade',
    productId: 'prod_T79eQnHzBxjP6G', // Usando mesmo produto
    price: 10.00
  },
  {
    id: 'detox-leve',
    name: 'Protocolo Detox Leve',
    productId: 'prod_T79eQnHzBxjP6G', // Usando mesmo produto
    price: 10.00
  },
  {
    id: 'anti-inflamatorio',
    name: 'Protocolo Anti-inflamatório',
    productId: 'prod_T79eQnHzBxjP6G', // Usando mesmo produto
    price: 10.00
  },
  {
    id: 'mulheres-40',
    name: 'Protocolo Mulheres 40+',
    productId: 'prod_T79eQnHzBxjP6G', // Usando mesmo produto
    price: 10.00
  },
  {
    id: 'pele-cabelo-unhas',
    name: 'Protocolo Pele, Cabelo e Unhas',
    productId: 'prod_T79eQnHzBxjP6G', // Usando mesmo produto
    price: 10.00
  },
  {
    id: 'sono-ansiedade',
    name: 'Protocolo Sono e Ansiedade',
    productId: 'prod_T79eQnHzBxjP6G', // Usando mesmo produto
    price: 10.00
  },
  {
    id: 'fitness-performance',
    name: 'Protocolo Fitness e Performance',
    productId: 'prod_T79eQnHzBxjP6G', // Usando mesmo produto
    price: 10.00
  },
  {
    id: 'alternativa-sem-caneta',
    name: 'Protocolo Alternativa Sem Caneta',
    productId: 'prod_T79eQnHzBxjP6G', // Usando mesmo produto
    price: 10.00
  },
  {
    id: 'pacote-completo',
    name: 'Pacote Completo - Todos os Protocolos',
    productId: 'prod_T79e5EQWC249nQ',
    price: 67.00
  }
];

async function createUniquePrices() {
  console.log('🚀 Criando price IDs únicos para todos os 15 protocolos...\n');

  const newPriceMap = {};

  for (const protocol of protocols) {
    try {
      // Criar novo price ID único para cada protocolo
      const newPrice = await stripe.prices.create({
        product: protocol.productId,
        unit_amount: protocol.price * 100, // Converter para centavos
        currency: 'usd',
        lookup_key: protocol.id, // Para facilitar identificação
      });

      newPriceMap[protocol.id] = newPrice.id;

      console.log(`✅ ${protocol.name}:`);
      console.log(`   Price ID: ${newPrice.id}`);
      console.log(`   Valor: $${protocol.price}`);
      console.log(`   Produto: ${protocol.productId}`);
      console.log('');

    } catch (error) {
      console.log(`❌ Erro ao criar preço para ${protocol.name}:`);
      console.log(`   Erro: ${error.message}`);
      console.log('');
    }
  }

  // Salvar o novo mapeamento
  console.log('📋 NOVO MAPEAMENTO DE PREÇOS:');
  console.log('const priceMap = {');
  Object.entries(newPriceMap).forEach(([protocolId, priceId]) => {
    console.log(`  '${protocolId}': '${priceId}',`);
  });
  console.log('}');

  console.log('\n🎉 Processo concluído!');
  console.log(`✅ Total de price IDs criados: ${Object.keys(newPriceMap).length}`);
  console.log('✅ Agora cada protocolo tem seu próprio preço único!');
}

createUniquePrices().catch(console.error);
