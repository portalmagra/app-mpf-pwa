import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Verificar se a chave secreta está disponível
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY não está configurada')
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null

export async function GET(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe não está configurado' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar dados da sessão no Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer']
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o pagamento foi bem-sucedido
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Pagamento não foi processado' },
        { status: 400 }
      )
    }

    // Extrair dados da compra
    const protocolId = session.metadata?.protocolId
    const customerEmail = session.customer_details?.email || session.customer_email
    const amount = session.amount_total ? session.amount_total / 100 : 0 // Converter de centavos para dólares

    if (!protocolId) {
      return NextResponse.json(
        { error: 'ID do protocolo não encontrado' },
        { status: 400 }
      )
    }

    // Retornar dados da compra
    return NextResponse.json({
      sessionId: session.id,
      protocolId: protocolId,
      protocolName: getProtocolName(protocolId),
      customerEmail: customerEmail,
      amount: amount,
      status: session.payment_status,
      paymentIntentId: session.payment_intent,
      createdAt: new Date(session.created * 1000).toISOString()
    })

  } catch (error) {
    console.error('Erro ao verificar sessão:', error)
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
