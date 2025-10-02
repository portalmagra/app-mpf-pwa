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

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ?
  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY) : null

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Verificando acesso ao eBook...')

    const { searchParams } = new URL(request.url)
    const ebookId = searchParams.get('ebook')
    const sessionId = searchParams.get('session')

    if (!ebookId || !sessionId) {
      console.error('❌ ebookId ou sessionId ausentes')
      return NextResponse.json({ error: 'Parâmetros de acesso ausentes.' }, { status: 400 })
    }

    if (!stripe) {
      console.error('❌ Stripe não configurado.')
      return NextResponse.json({ error: 'Serviço de pagamento não configurado.' }, { status: 500 })
    }

    if (!supabase) {
      console.error('❌ Supabase não configurado.')
      return NextResponse.json({ error: 'Serviço de banco de dados não configurado.' }, { status: 500 })
    }

    // 1. Verificar a sessão do Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      console.warn(`⚠️ Sessão ${sessionId} não paga. Status: ${session.payment_status}`)
      return NextResponse.json({ error: 'Pagamento não confirmado.' }, { status: 402 })
    }

    // 2. Verificar se o usuário comprou este eBook no Supabase
    const userEmail = session.customer_details?.email

    if (!userEmail) {
      console.error(`❌ Email do cliente não encontrado na sessão Stripe ${sessionId}.`)
      return NextResponse.json({ error: 'Email do comprador não encontrado.' }, { status: 400 })
    }

    // Buscar o registro de compra na tabela user_purchases
    const { data: purchase, error: purchaseError } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_email', userEmail)
      .eq('product_id', `ebook-${ebookId}`)
      .single()

    if (purchaseError || !purchase) {
      console.error(`❌ Compra não encontrada para o eBook ${ebookId} e email ${userEmail}:`, purchaseError?.message)
      return NextResponse.json({ error: 'Compra não registrada ou não encontrada.' }, { status: 403 })
    }

    // 3. Obter dados do eBook
    const { data: ebookData, error: ebookError } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', ebookId)
      .single()

    if (ebookError || !ebookData) {
      console.error(`❌ Erro ao buscar dados do eBook ${ebookId}:`, ebookError?.message)
      return NextResponse.json({ error: 'eBook não encontrado.' }, { status: 404 })
    }

    // 4. Retornar dados do eBook com informações de acesso
    const responseData = {
      id: ebookData.id,
      title: ebookData.title,
      description: ebookData.description,
      category: ebookData.category,
      price: ebookData.price,
      pdf_link: ebookData.pdf_link,
      cover_image_url: ebookData.cover_image_url,
      author: ebookData.author,
      pages: ebookData.pages,
      language: ebookData.language,
      fileName: `${ebookData.title}.pdf`,
      size: '~2-5 MB' // Tamanho estimado
    }

    console.log(`✅ Acesso confirmado para eBook ${ebookId}: ${ebookData.title}`)
    return NextResponse.json(responseData)

  } catch (error) {
    console.error('❌ Erro no processo de verificação de acesso:', error)
    return NextResponse.json({ error: 'Erro interno do servidor ao verificar acesso.' }, { status: 500 })
  }
}
