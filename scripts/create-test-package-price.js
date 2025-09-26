require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

async function createTestPackagePrice() {
  console.log('🚀 Criando preço de teste ($1) para o pacote completo...\n');

  try {
    // Buscar o produto do pacote completo
    const product = await stripe.products.retrieve('prod_T79e5EQWC249nQ');
    console.log(`✅ Produto encontrado: ${product.name} (${product.id})\n`);

    // Criar novo preço de teste ($1)
    const testPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 100, // $1.00 em centavos
      currency: 'usd',
      lookup_key: 'pacote-completo-test', // Chave diferente para teste
    });

    console.log('✅ Preço de teste criado:');
    console.log(`   Price ID: ${testPrice.id}`);
    console.log(`   Valor: $${(testPrice.unit_amount / 100).toFixed(2)}`);
    console.log(`   Produto: ${product.id}`);
    console.log(`   Lookup Key: ${testPrice.lookup_key}`);
    console.log('');

    console.log('📋 Para testar, use este price ID:');
    console.log(`'pacote-completo': '${testPrice.id}'`);
    console.log('');
    console.log('⚠️  Lembre-se de reverter para o preço original após o teste!');

  } catch (error) {
    console.error('❌ Erro ao criar preço de teste:', error.message);
  }
}

createTestPackagePrice().catch(console.error);
