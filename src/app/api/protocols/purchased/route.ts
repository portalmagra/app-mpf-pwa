import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Verificar se as chaves estão disponíveis
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não estão configuradas')
}

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Buscando protocolos comprados...')
    
    const { searchParams } = new URL(request.url)
    const customerEmail = searchParams.get('email')

    if (!customerEmail) {
      console.error('❌ Email do cliente não fornecido')
      return NextResponse.json(
        { error: 'Email do cliente é obrigatório' },
        { status: 400 }
      )
    }

    if (!supabase) {
      console.error('❌ Supabase não configurado')
      return NextResponse.json(
        { error: 'Supabase não está configurado' },
        { status: 500 }
      )
    }

    // Buscar protocolos comprados pelo email do cliente
    const { data: purchases, error } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('customer_email', customerEmail)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Erro ao buscar compras:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar protocolos comprados' },
        { status: 500 }
      )
    }

    console.log(`✅ Encontradas ${purchases?.length || 0} compras`)

    // Mapear para formato mais limpo
    const protocols = purchases?.map(purchase => ({
      id: purchase.id,
      protocol_id: purchase.protocol_id,
      protocol_name: getProtocolName(purchase.protocol_id),
      purchase_date: purchase.created_at,
      status: purchase.status,
      amount: purchase.amount,
      customer_email: purchase.customer_email
    })) || []

    return NextResponse.json({ protocols })

  } catch (error) {
    console.error('❌ Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function getProtocolName(protocolId: string): string {
  const protocolNames: { [key: string]: string } = {
    'suporte-canetas-emagrecedoras': 'Protocolo Suporte com Canetas Emagrecedoras',
    'pre-caneta': 'Protocolo Pré-Caneta',
    'pos-caneta-manutencao': 'Protocolo Pós-Caneta Manutenção',
    'proteina-massa-magra': 'Protocolo Proteína e Massa Magra',
    'intestino-livre': 'Protocolo Intestino Livre',
    'nausea-refluxo': 'Protocolo Náusea e Refluxo',
    'energia-imunidade': 'Protocolo Energia e Imunidade',
    'imunidade-avancada': 'Protocolo Imunidade Avançada',
    'detox-leve': 'Protocolo Detox Leve',
    'anti-inflamatorio': 'Protocolo Anti-inflamatório',
    'mulheres-40': 'Protocolo Mulheres 40+',
    'pele-cabelo-unhas': 'Protocolo Pele, Cabelo e Unhas',
    'sono-ansiedade': 'Protocolo Sono e Ansiedade',
    'fitness-performance': 'Protocolo Fitness e Performance',
    'alternativa-sem-caneta': 'Protocolo Alternativa Sem Caneta',
    'pacote-completo': 'Pacote Completo - Todos os Protocolos'
  }
  
  return protocolNames[protocolId] || protocolId
}
