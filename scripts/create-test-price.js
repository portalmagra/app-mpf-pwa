require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

async function createTestPrice() {
  try {
    console.log('🔍 Buscando produto pacote-completo...');
    
    // Buscar o produto 'pacote-completo'
    const products = await stripe.products.list({ limit: 100 });
    const pacoteProduct = products.data.find(p => 
      p.name.includes('Pacote Completo') || 
      p.name.includes('Todos os Protocolos') ||
      p.name.includes('pacote-completo')
    );
    
    if (!pacoteProduct) {
      console.log('❌ Produto pacote-completo não encontrado');
      console.log('📋 Produtos disponíveis:');
      products.data.forEach(p => console.log(`- ${p.name} (${p.id})`));
      return;
    }
    
    console.log('📦 Produto encontrado:', pacoteProduct.name, '(ID:', pacoteProduct.id + ')');
    
    // Criar preço de $1 para teste
    const price = await stripe.prices.create({
      product: pacoteProduct.id,
      unit_amount: 100, // $1.00 em centavos
      currency: 'usd',
      nickname: 'Teste $1'
    });
    
    console.log('✅ Price ID criado:', price.id);
    console.log('💰 Valor: $1.00 USD');
    console.log('\n📝 Atualize o código com este Price ID:');
    console.log(`'pacote-completo': '${price.id}' // $1.00 - Pacote Completo (TESTE)`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

createTestPrice().catch(console.error);
