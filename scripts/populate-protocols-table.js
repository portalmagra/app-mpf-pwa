require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const protocols = [
  {
    protocol_id: 'suporte-canetas-emagrecedoras',
    nome: 'Protocolo Suporte com Canetas Emagrecedoras',
    arquivo_pdf: 'PROTOCOLO SUPORTE COM AS CANETAS EMAGRECEDORAS.pdf',
    ordem: 1,
    ativo: true
  },
  {
    protocol_id: 'pre-caneta',
    nome: 'Protocolo Pré-Caneta',
    arquivo_pdf: 'PROTOCOLO-PRE-CANETA.pdf',
    ordem: 2,
    ativo: true
  },
  {
    protocol_id: 'pos-caneta-manutencao',
    nome: 'Protocolo Pós-Caneta Manutenção',
    arquivo_pdf: 'PROTOCOLO-POS-CANETA-MANUTENCAO.pdf',
    ordem: 3,
    ativo: true
  },
  {
    protocol_id: 'proteina-massa-magra',
    nome: 'Protocolo Proteína e Massa Magra',
    arquivo_pdf: 'PROTOCOLO-PROTEINA-and-MASSA-MAGRA.pdf',
    ordem: 4,
    ativo: true
  },
  {
    protocol_id: 'intestino-livre',
    nome: 'Protocolo Intestino Livre',
    arquivo_pdf: 'PROTOCOLO-INTESTINO-LIVRE.pdf',
    ordem: 5,
    ativo: true
  },
  {
    protocol_id: 'nausea-refluxo',
    nome: 'Protocolo Náusea e Refluxo',
    arquivo_pdf: 'PROTOCOLO-NAUSEA-and-REFLUXO.pdf',
    ordem: 6,
    ativo: true
  },
  {
    protocol_id: 'energia-imunidade',
    nome: 'Protocolo Energia e Imunidade',
    arquivo_pdf: 'PROTOCOLO-ENERGIA-E-IMUNIDADE.pdf',
    ordem: 7,
    ativo: true
  },
  {
    protocol_id: 'imunidade-avancada',
    nome: 'Protocolo Imunidade Avançada',
    arquivo_pdf: 'PROTOCOLO-IMUNIDADE-AVANCADA.pdf',
    ordem: 8,
    ativo: true
  },
  {
    protocol_id: 'detox-leve',
    nome: 'Protocolo Detox Leve',
    arquivo_pdf: 'PROTOCOLO-DETOX-LEVE.pdf',
    ordem: 9,
    ativo: true
  },
  {
    protocol_id: 'anti-inflamatorio',
    nome: 'Protocolo Anti-inflamatório',
    arquivo_pdf: 'PROTOCOLO-ANTI-INFLAMATORIO.pdf',
    ordem: 10,
    ativo: true
  },
  {
    protocol_id: 'mulheres-40',
    nome: 'Protocolo Mulheres 40+',
    arquivo_pdf: 'PROTOCOLO-MULHERES-40.pdf',
    ordem: 11,
    ativo: true
  },
  {
    protocol_id: 'pele-cabelo-unhas',
    nome: 'Protocolo Pele, Cabelo e Unhas',
    arquivo_pdf: 'PROTOCOLO-PELE-CABELO-and-UNHAS.pdf',
    ordem: 12,
    ativo: true
  },
  {
    protocol_id: 'sono-ansiedade',
    nome: 'Protocolo Sono e Ansiedade',
    arquivo_pdf: 'PROTOCOLO-SONO-and-ANSIEDADE.pdf',
    ordem: 13,
    ativo: true
  },
  {
    protocol_id: 'fitness-performance',
    nome: 'Protocolo Fitness e Performance',
    arquivo_pdf: 'PROTOCOLO-FITNESS-and-PERFORMANCE.pdf',
    ordem: 14,
    ativo: true
  },
  {
    protocol_id: 'alternativa-sem-caneta',
    nome: 'Protocolo Alternativa Sem Caneta',
    arquivo_pdf: 'PROTOCOLO ALTERNATIVA SEM CANETA.pdf',
    ordem: 15,
    ativo: true
  }
];

async function populateProtocolsTable() {
  console.log('🚀 Populando tabela de protocolos...\n');

  try {
    // Primeiro, limpar a tabela
    console.log('🧹 Limpando tabela existente...');
    const { error: deleteError } = await supabase
      .from('protocolos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.log('⚠️ Erro ao limpar tabela (pode não existir):', deleteError.message);
    } else {
      console.log('✅ Tabela limpa');
    }

    // Inserir protocolos
    console.log('📝 Inserindo protocolos...');
    const { data, error } = await supabase
      .from('protocolos')
      .insert(protocols);

    if (error) {
      console.error('❌ Erro ao inserir protocolos:', error);
      return;
    }

    console.log('✅ Protocolos inseridos com sucesso!');
    console.log(`📊 Total: ${protocols.length} protocolos`);

    // Verificar se foram inseridos
    const { data: insertedProtocols, error: selectError } = await supabase
      .from('protocolos')
      .select('*')
      .order('ordem');

    if (selectError) {
      console.error('❌ Erro ao verificar protocolos:', selectError);
      return;
    }

    console.log('\n📋 Protocolos na tabela:');
    insertedProtocols.forEach(protocol => {
      console.log(`${protocol.ordem}. ${protocol.nome} (${protocol.protocol_id})`);
    });

    console.log('\n🎉 Tabela de protocolos populada com sucesso!');
    console.log('✅ O pacote completo agora deve funcionar!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

populateProtocolsTable().catch(console.error);
