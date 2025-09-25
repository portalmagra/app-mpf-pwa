require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis do Supabase não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para testar a edição de um produto
async function testProductEdit() {
  console.log('🔍 Testando funcionalidade de edição de produtos...\n');
  
  try {
    // Buscar um produto curado para testar
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('is_curated', true)
      .limit(1);
    
    if (fetchError) {
      console.error('❌ Erro ao buscar produtos:', fetchError);
      return;
    }
    
    if (!products || products.length === 0) {
      console.log('❌ Nenhum produto curado encontrado para teste');
      return;
    }
    
    const testProduct = products[0];
    console.log('📦 Produto selecionado para teste:');
    console.log(`   ID: ${testProduct.id}`);
    console.log(`   Nome: ${testProduct.name}`);
    console.log(`   Categoria: ${testProduct.category_id}`);
    console.log(`   Preço atual: ${testProduct.current_price}`);
    
    // Testar atualização
    const updates = {
      current_price: '$99.99',
      description: 'Produto atualizado via teste - ' + new Date().toISOString()
    };
    
    console.log('\n🔄 Testando atualização...');
    console.log('   Updates:', updates);
    
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update(updates)
      .eq('id', testProduct.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Erro ao atualizar produto:', updateError);
      console.error('   Detalhes:', updateError.message);
      console.error('   Código:', updateError.code);
      console.error('   Detalhes completos:', updateError);
    } else {
      console.log('✅ Produto atualizado com sucesso!');
      console.log('   Novo preço:', updatedProduct.current_price);
      console.log('   Nova descrição:', updatedProduct.description);
      
      // Reverter a mudança
      console.log('\n🔄 Revertendo mudanças...');
      const revertUpdates = {
        current_price: testProduct.current_price,
        description: testProduct.description
      };
      
      const { error: revertError } = await supabase
        .from('products')
        .update(revertUpdates)
        .eq('id', testProduct.id);
      
      if (revertError) {
        console.error('❌ Erro ao reverter:', revertError);
      } else {
        console.log('✅ Mudanças revertidas com sucesso!');
      }
    }
    
    // Testar permissões da tabela
    console.log('\n🔍 Verificando permissões da tabela...');
    
    const { data: tableInfo, error: tableError } = await supabase
      .from('products')
      .select('id, name, is_curated')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Erro ao verificar permissões:', tableError);
    } else {
      console.log('✅ Permissões de leitura: OK');
    }
    
    // Testar inserção (apenas estrutura)
    console.log('\n🔍 Testando estrutura de inserção...');
    const testInsert = {
      id: `test_${Date.now()}`,
      name: 'Produto Teste',
      category_id: 'energia',
      slug: 'produto-teste',
      current_price: '$1.00',
      is_curated: false,
      created_at: new Date().toISOString()
    };
    
    const { data: insertedProduct, error: insertError } = await supabase
      .from('products')
      .insert([testInsert])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Erro ao inserir produto teste:', insertError);
      console.error('   Detalhes:', insertError.message);
    } else {
      console.log('✅ Inserção de teste: OK');
      
      // Remover produto teste
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', testInsert.id);
      
      if (deleteError) {
        console.error('❌ Erro ao remover produto teste:', deleteError);
      } else {
        console.log('✅ Produto teste removido');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar teste
testProductEdit();
