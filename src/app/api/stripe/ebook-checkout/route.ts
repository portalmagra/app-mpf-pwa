import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Verificar se a chave secreta está disponível
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY não está configurada')
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null

// Mapear eBooks para price IDs do Stripe - todos custam $10
const getEbookPriceId = (ebookId: number): string => {
  // Todos os eBooks usam o mesmo price ID de $10
  return 'price_1SBE64EVE42ibKnXEbook10Dollars'
}

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe não está configurado' },
        { status: 500 }
      )
    }

    const { ebookId, quantity = 1 } = await request.json()

    if (!ebookId) {
      return NextResponse.json(
        { error: 'ebookId é obrigatório' },
        { status: 400 }
      )
    }

    const priceId = getEbookPriceId(ebookId)

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
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/ebooks/download?ebook_id=${ebookId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/ebooks`,
      metadata: {
        ebookId: ebookId.toString(),
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
    console.error('Erro ao criar sessão de checkout para eBook:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
