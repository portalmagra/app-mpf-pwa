require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

// Protocolos que precisam de preços em modo Live
const protocols = [
  {
    id: 'suporte-canetas-emagrecedoras',
    name: 'Protocolo Suporte com Canetas Emagrecedoras',
    price: 10.00
  },
  {
    id: 'pre-caneta',
    name: 'Protocolo Pré-Caneta',
    price: 10.00
  },
  {
    id: 'pos-caneta-manutencao',
    name: 'Protocolo Pós-Caneta Manutenção',
    price: 10.00
  },
  {
    id: 'proteina-massa-magra',
    name: 'Protocolo Proteína e Massa Magra',
    price: 10.00
  },
  {
    id: 'intestino-livre',
    name: 'Protocolo Intestino Livre',
    price: 10.00
  },
  {
    id: 'nausea-refluxo',
    name: 'Protocolo Náusea e Refluxo',
    price: 10.00
  },
  {
    id: 'energia-imunidade',
    name: 'Protocolo Energia e Imunidade',
    price: 10.00
  },
  {
    id: 'imunidade-avancada',
    name: 'Protocolo Imunidade Avançada',
    price: 10.00
  },
  {
    id: 'detox-leve',
    name: 'Protocolo Detox Leve',
    price: 10.00
  },
  {
    id: 'anti-inflamatorio',
    name: 'Protocolo Anti-inflamatório',
    price: 10.00
  },
  {
    id: 'mulheres-40',
    name: 'Protocolo Mulheres 40+',
    price: 10.00
  },
  {
    id: 'pele-cabelo-unhas',
    name: 'Protocolo Pele, Cabelo e Unhas',
    price: 10.00
  },
  {
    id: 'sono-ansiedade',
    name: 'Protocolo Sono e Ansiedade',
    price: 10.00
  },
  {
    id: 'fitness-performance',
    name: 'Protocolo Fitness e Performance',
    price: 10.00
  },
  {
    id: 'alternativa-sem-caneta',
    name: 'Protocolo Alternativa Sem Caneta',
    price: 10.00
  },
  {
    id: 'pacote-completo',
    name: 'Pacote Completo - Todos os Protocolos',
    price: 67.00
  }
];

async function createLivePrices() {
  console.log('🚀 Criando preços em modo Live para todos os protocolos...\n');

  // Primeiro, vamos listar os produtos existentes
  console.log('📋 Listando produtos existentes...\n');
  const products = await stripe.products.list({ limit: 100 });
  
  console.log('Produtos encontrados:');
  products.data.forEach(product => {
    console.log(`- ${product.name} (${product.id})`);
  });
  console.log('');

  // Usar o primeiro produto como base (ou criar um novo se necessário)
  let baseProduct = products.data[0];
  
  if (!baseProduct) {
    console.log('❌ Nenhum produto encontrado. Criando produto base...');
    baseProduct = await stripe.products.create({
      name: 'Protocolos MeuPortalFit',
      description: 'Protocolos de saúde e bem-estar do MeuPortalFit'
    });
    console.log(`✅ Produto criado: ${baseProduct.id}\n`);
  } else {
    console.log(`✅ Usando produto base: ${baseProduct.name} (${baseProduct.id})\n`);
  }

  const newPriceMap = {};

  for (const protocol of protocols) {
    try {
      // Criar novo price ID para modo Live
      const newPrice = await stripe.prices.create({
        product: baseProduct.id,
        unit_amount: protocol.price * 100, // Converter para centavos
        currency: 'usd',
        lookup_key: protocol.id, // Para facilitar identificação
      });

      newPriceMap[protocol.id] = newPrice.id;

      console.log(`✅ ${protocol.name}:`);
      console.log(`   Price ID: ${newPrice.id}`);
      console.log(`   Valor: $${protocol.price}`);
      console.log(`   Produto: ${baseProduct.id}`);
      console.log('');

    } catch (error) {
      console.log(`❌ Erro ao criar preço para ${protocol.name}:`);
      console.log(`   Erro: ${error.message}`);
      console.log('');
    }
  }

  // Salvar o novo mapeamento
  console.log('📋 NOVO MAPEAMENTO DE PREÇOS PARA MODO LIVE:');
  console.log('const priceMap = {');
  Object.entries(newPriceMap).forEach(([protocolId, priceId]) => {
    console.log(`  '${protocolId}': '${priceId}',`);
  });
  console.log('}');

  console.log('\n🎉 Processo concluído!');
  console.log(`✅ Total de price IDs criados: ${Object.keys(newPriceMap).length}`);
  console.log('✅ Agora você pode atualizar o código com os novos price IDs!');
}

createLivePrices().catch(console.error);
