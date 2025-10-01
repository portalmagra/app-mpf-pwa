import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Verificar se a chave secreta está disponível
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY não está configurada')
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe não está configurado' },
        { status: 500 }
      )
    }

    const { protocolId, priceId, quantity = 1 } = await request.json()

    if (!protocolId || !priceId) {
      return NextResponse.json(
        { error: 'protocolId e priceId são obrigatórios' },
        { status: 400 }
      )
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/protocolos`,
      metadata: {
        protocolId: protocolId,
        priceId: priceId,
        quantity: quantity.toString(),
        timestamp: new Date().toISOString(),
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_creation: 'always',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
