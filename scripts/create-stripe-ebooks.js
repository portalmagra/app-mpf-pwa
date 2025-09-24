require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

const ebooksToCreate = [
  {
    id: 'doces-fit',
    name: 'Doces Fit',
    description: 'Receitas de doces saudáveis e deliciosos',
    price: 1990, // $19.90 in cents
    image: 'https://www.meuportalfit.com/images/ebooks/Capa%20E-%20Book%20Doces-Fit.jpg',
  },
  {
    id: 'doces-fit-2',
    name: 'Doces Fit 2',
    description: 'Mais receitas de doces saudáveis',
    price: 1990, // $19.90 in cents
    image: 'https://www.meuportalfit.com/images/ebooks/Capa%20E-%20BOOK%20Doces-Fit-2.jpg',
  },
  {
    id: 'receitas-salgadas',
    name: 'Receitas Salgadas',
    description: 'Receitas salgadas saudáveis e práticas',
    price: 2490, // $24.90 in cents
    image: 'https://www.meuportalfit.com/images/ebooks/CAPA%20E-%20book%20Receitas-Salgadas.jpg',
  },
  {
    id: 'saladas-funcionais',
    name: 'Saladas Funcionais',
    description: 'Saladas nutritivas e saborosas',
    price: 1590, // $15.90 in cents
    image: 'https://www.meuportalfit.com/images/ebooks/CAPA%20E-book%20Saladas.jpg',
  },
  {
    id: 'sopas-funcionais',
    name: 'Sopas Funcionais',
    description: 'Sopas nutritivas para todos os momentos',
    price: 1990, // $19.90 in cents
    image: 'https://www.meuportalfit.com/images/ebooks/CAPA%20E-book%20Sopas%20Funcionais.jpg',
  },
  {
    id: 'shots-detox',
    name: '5 Shots Detox',
    description: 'Receitas de shots detox para limpeza',
    price: 1290, // $12.90 in cents
    image: 'https://www.meuportalfit.com/images/ebooks/CAPA%205-%20SHOTS%20DETOX.jpg',
  },
  {
    id: 'sucos-detox',
    name: 'Sucos Detox',
    description: 'Sucos detox para desintoxicação',
    price: 1490, // $14.90 in cents
    image: 'https://www.meuportalfit.com/images/ebooks/CAPA%20SUCOS-DETOX.jpg',
  },
  {
    id: 'dieta-familia',
    name: 'Dieta da Família',
    description: 'Guia completo para alimentação saudável da família',
    price: 2990, // $29.90 in cents
    image: 'https://www.meuportalfit.com/images/ebooks/Capa%20DIETA%20DA%20FAMILIA.pdf',
  },
  {
    id: 'dieta-low-carb',
    name: 'Dieta Low Carb',
    description: 'Guia completo da dieta low carb',
    price: 2490, // $24.90 in cents
    image: 'https://www.meuportalfit.com/images/ebooks/Capa%20DIETA%20LOW%20CARB.pdf',
  },
  {
    id: 'dieta-cetogenica',
    name: 'Dieta Cetogênica',
    description: 'Guia completo da dieta cetogênica',
    price: 2790, // $27.90 in cents
    image: 'https://www.meuportalfit.com/images/ebooks/Capa%20Dieta-Cetogenica.pdf',
  },
  {
    id: 'jejum-intermitente',
    name: 'Jejum Intermitente',
    description: 'Guia completo do jejum intermitente',
    price: 2290, // $22.90 in cents
    image: 'https://www.meuportalfit.com/images/ebooks/Capa%20JEJUM%20INTERMITENTE.pdf',
  },
  {
    id: 'saude-intestinal',
    name: 'Saúde Intestinal',
    description: 'Guia para saúde intestinal e digestão',
    price: 1990, // $19.90 in cents
    image: 'https://www.meuportalfit.com/images/ebooks/Capa%20SAUDE%20INTESTINAL.pdf',
  },
  {
    id: 'dieta-mediterranea',
    name: 'Dieta Mediterrânea',
    description: 'Guia completo da dieta mediterrânea',
    price: 2490, // $24.90 in cents
    image: 'https://www.meuportalfit.com/images/ebooks/CapaDIETA%20MEDITERRANEA.pdf',
  }
];

async function createStripeEbooks() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY não está configurada no .env.local');
    return;
  }

  console.log('Iniciando criação/atualização de eBooks no Stripe...');

  for (const ebookData of ebooksToCreate) {
    try {
      // Tenta encontrar o produto existente pelo ID
      let product;
      try {
        product = await stripe.products.retrieve(ebookData.id);
      } catch (error) {
        if (error.code === 'resource_missing') {
          product = null; // Produto não encontrado, será criado
        } else {
          throw error;
        }
      }

      if (product) {
        // Atualiza o produto existente
        await stripe.products.update(product.id, {
          name: ebookData.name,
          description: ebookData.description,
          images: [ebookData.image],
        });
        console.log(`✅ eBook atualizado: ${ebookData.name} (ID: ${product.id})`);
      } else {
        // Cria um novo produto
        product = await stripe.products.create({
          id: ebookData.id,
          name: ebookData.name,
          description: ebookData.description,
          images: [ebookData.image],
        });
        console.log(`✅ eBook criado: ${ebookData.name} (ID: ${product.id})`);
      }

      // Cria ou atualiza o preço
      const priceId = `price_${ebookData.id}`;
      let price;
      try {
        price = await stripe.prices.retrieve(priceId);
        // Se o preço existe, verifica se precisa ser atualizado (ex: valor)
        if (price.unit_amount !== ebookData.price || price.currency !== 'usd') {
          // Desativa o preço antigo e cria um novo
          await stripe.prices.update(price.id, { active: false });
          price = await stripe.prices.create({
            id: priceId,
            product: product.id,
            unit_amount: ebookData.price,
            currency: 'usd',
            lookup_key: ebookData.id, // Para buscar facilmente
          });
          console.log(`✅ Preço atualizado para ${ebookData.name} (ID: ${price.id})`);
        }
      } catch (error) {
        if (error.code === 'resource_missing') {
          // Preço não encontrado, cria um novo
          price = await stripe.prices.create({
            product: product.id,
            unit_amount: ebookData.price,
            currency: 'usd',
          });
          console.log(`✅ Preço criado para ${ebookData.name} (ID: ${price.id})`);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error(`❌ Erro ao processar ${ebookData.name}:`, error.message);
    }
  }
  console.log('✅ Processo de criação/atualização de eBooks concluído.');
}

createStripeEbooks();
