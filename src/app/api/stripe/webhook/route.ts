import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Verificar se as chaves estão disponíveis
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY não está configurada')
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não estão configuradas')
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null

export async function POST(request: NextRequest) {
  try {
    if (!stripe || !supabase) {
      console.error('Stripe ou Supabase não estão configurados')
      return NextResponse.json(
        { error: 'Serviços não configurados' },
        { status: 500 }
      )
    }

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Assinatura do Stripe não encontrada' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Erro ao verificar assinatura do webhook:', err)
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 400 }
      )
    }

    // Processar evento de checkout concluído
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      console.log('Processando pagamento:', session.id)

      // Extrair dados da sessão
      const protocolId = session.metadata?.protocolId
      const customerEmail = session.customer_details?.email || session.customer_email
      const amount = session.amount_total ? session.amount_total / 100 : 0
      const paymentIntentId = session.payment_intent as string

      if (!protocolId) {
        console.error('ProtocolId não encontrado na sessão:', session.id)
        return NextResponse.json(
          { error: 'ProtocolId não encontrado' },
          { status: 400 }
        )
      }

      // Buscar ou criar usuário no Supabase
      let userId: string | null = null

      if (customerEmail) {
        // Para simplificar, usar email como identificador
        // Em um sistema mais robusto, você criaria usuários no Supabase Auth
        userId = customerEmail
      }

      if (!userId) {
        console.error('Não foi possível obter userId para:', customerEmail)
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 400 }
        )
      }

      // Registrar compra no Supabase
      const { data: purchase, error: insertError } = await supabase
        .from('user_purchases')
        .insert({
          user_id: userId,
          protocol_id: protocolId,
          stripe_payment_intent_id: paymentIntentId,
          stripe_session_id: session.id,
          customer_email: customerEmail,
          amount: amount,
          status: 'completed'
        })
        .select()

      if (insertError) {
        console.error('Erro ao inserir compra:', insertError)
        return NextResponse.json(
          { error: 'Erro ao registrar compra' },
          { status: 500 }
        )
      }

      console.log('Compra registrada com sucesso:', purchase)

      // Enviar email de confirmação (opcional)
      // Aqui você pode integrar com SendGrid, Resend, etc.

      return NextResponse.json({ 
        success: true, 
        message: 'Compra processada com sucesso',
        purchase_id: purchase[0]?.id 
      })
    }

    // Outros tipos de eventos podem ser processados aqui
    console.log('Evento não processado:', event.type)

    return NextResponse.json({ 
      success: true, 
      message: 'Evento recebido mas não processado' 
    })

  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Método GET para verificar se o webhook está funcionando
export async function GET() {
  return NextResponse.json({ 
    status: 'Webhook ativo',
    timestamp: new Date().toISOString()
  })
}
