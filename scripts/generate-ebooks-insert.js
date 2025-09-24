require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

// Script para gerar INSERT SQL dos eBooks baseado nos dados mock atuais
const ebooks = [
  {
    id: 1,
    title: 'E-book Saladas',
    description: 'Combinações frescas e nutritivas de saladas, que podem ser usadas como acompanhamento ou refeição completa.',
    category: 'receitas',
    price: 5.00,
    pdf_link: 'SUPABASE_LINK_PLACEHOLDER', // Será substituído pelos links reais
    cover_image_url: '/images/ebooks/CAPA E-book Saladas.jpg',
    author: 'Meu Portal Fit',
    pages: 17,
    language: 'pt-BR',
    status: 'active',
    featured: false
  },
  {
    id: 2,
    title: 'E-book Receitas-Salgadas',
    description: 'Receitas salgadas fáceis e versáteis, com opções para lanches e refeições rápidas sem abrir mão do sabor.',
    category: 'receitas',
    price: 10.00,
    pdf_link: 'SUPABASE_LINK_PLACEHOLDER',
    cover_image_url: '/images/ebooks/CAPA E- book Receitas-Salgadas.jpg',
    author: 'Meu Portal Fit',
    pages: 32,
    language: 'pt-BR',
    status: 'active',
    featured: false
  },
  {
    id: 3,
    title: 'E-Book Doces Fit',
    description: 'Receitas de sobremesas leves, saborosas e fáceis de preparar, perfeitas para matar a vontade de doce sem sair da dieta.',
    category: 'receitas',
    price: 10.00,
    pdf_link: 'SUPABASE_LINK_PLACEHOLDER',
    cover_image_url: '/images/ebooks/Capa E- Book Doces-Fit.jpg',
    author: 'Meu Portal Fit',
    pages: 60,
    language: 'pt-BR',
    status: 'active',
    featured: false
  }
];

function generateInsertSQL() {
  console.log('-- INSERT SQL para eBooks');
  console.log('-- Substitua SUPABASE_LINK_PLACEHOLDER pelos links reais do Supabase Storage');
  console.log('');
  
  ebooks.forEach((ebook, index) => {
    const values = `(
  ${ebook.id},
  '${ebook.title}',
  '${ebook.description}',
  '${ebook.category}',
  ${ebook.price},
  'SUPABASE_LINK_PLACEHOLDER', -- Link do PDF no Supabase Storage
  '${ebook.cover_image_url}',
  '${ebook.author}',
  ${ebook.pages},
  '${ebook.language}',
  '${ebook.status}',
  ${ebook.featured}
)`;
    
    if (index === 0) {
      console.log('INSERT INTO ebooks (id, title, description, category, price, pdf_link, cover_image_url, author, pages, language, status, featured) VALUES');
    }
    
    console.log(values + (index < ebooks.length - 1 ? ',' : ';'));
  });
  
  console.log('');
  console.log('-- Instruções:');
  console.log('-- 1. Substitua SUPABASE_LINK_PLACEHOLDER pelos links reais do Supabase Storage');
  console.log('-- 2. Execute este SQL no Supabase SQL Editor');
  console.log('-- 3. Os links devem seguir o formato: https://seu-projeto.supabase.co/storage/v1/object/public/ebooks-pdfs/categoria/nome-do-arquivo.pdf');
}

generateInsertSQL();
