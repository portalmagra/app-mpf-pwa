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

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Iniciando download de eBook...')
    
    const { searchParams } = new URL(request.url)
    const ebookId = searchParams.get('ebook')
    const sessionId = searchParams.get('session')

    console.log(`📋 eBook: ${ebookId}, Sessão: ${sessionId}`)

    if (!ebookId || !sessionId) {
      console.error('❌ Parâmetros obrigatórios não fornecidos')
      return NextResponse.json(
        { error: 'ebook e session são obrigatórios' },
        { status: 400 }
      )
    }

    if (!stripe || !supabase) {
      console.error('❌ Stripe ou Supabase não configurados')
      return NextResponse.json(
        { error: 'Stripe ou Supabase não estão configurados' },
        { status: 500 }
      )
    }

    // Verificar se a compra está registrada no Supabase
    console.log('🔍 Verificando compra no Supabase...')
    const { data: purchase, error: purchaseError } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .eq('protocol_id', ebookId) // Usando protocol_id para eBooks também
      .eq('status', 'completed')
      .single()

    if (purchaseError || !purchase) {
      console.log('⚠️ Compra não encontrada no Supabase, verificando no Stripe...')
      
      // Se não encontrar no Supabase, verificar no Stripe como fallback
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      if (!session) {
        console.error('❌ Sessão não encontrada no Stripe')
        return NextResponse.json(
          { error: 'Sessão não encontrada' },
          { status: 404 }
        )
      }

      if (session.payment_status !== 'paid') {
        console.error('❌ Pagamento não foi processado')
        return NextResponse.json(
          { error: 'Pagamento não foi processado' },
          { status: 403 }
        )
      }

      // Verificar se o ebookId corresponde ao da sessão
      if (session.metadata?.ebookId !== ebookId && session.metadata?.protocolId !== ebookId) {
        console.error('❌ eBook não corresponde à compra')
        return NextResponse.json(
          { error: 'eBook não corresponde à compra' },
          { status: 403 }
        )
      }
      
      console.log('✅ Compra verificada no Stripe')
    } else {
      console.log('✅ Compra verificada no Supabase')
    }

    // Obter dados do eBook
    console.log('🔍 Obtendo dados do eBook...')
    const ebookData = await getEbookData(ebookId)

    if (!ebookData) {
      console.error(`❌ eBook não encontrado: ${ebookId}`)
      return NextResponse.json(
        { error: 'eBook não encontrado' },
        { status: 404 }
      )
    }

    console.log(`📄 Arquivo: ${ebookData.fileName}`)
    console.log(`🔗 URL: ${ebookData.pdfUrl}`)

    // Fazer download do arquivo
    try {
      console.log('📥 Fazendo download do arquivo...')
      const response = await fetch(ebookData.pdfUrl)
      
      if (!response.ok) {
        console.error(`❌ Erro HTTP ${response.status}: ${response.statusText}`)
        throw new Error(`Erro ao buscar arquivo: ${response.status} ${response.statusText}`)
      }

      const buffer = await response.arrayBuffer()
      console.log(`✅ Arquivo baixado com sucesso: ${buffer.byteLength} bytes`)
      
      // Retornar o arquivo como blob
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${ebookData.fileName}"`,
          'Content-Length': buffer.byteLength.toString(),
        },
      })

    } catch (error) {
      console.error('❌ Erro ao fazer download do arquivo:', error)
      return NextResponse.json(
        { error: `Erro ao baixar o arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}` },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Erro ao processar download:', error)
    return NextResponse.json(
      { error: `Erro interno do servidor: ${error instanceof Error ? error.message : 'Erro desconhecido'}` },
      { status: 500 }
    )
  }
}

async function getEbookData(ebookId: string) {
  try {
    // Verificar se supabase está configurado
    if (!supabase) {
      console.error('❌ Supabase não configurado')
      return null
    }

    // Buscar dados do eBook no Supabase
    const { data: ebook, error } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', ebookId)
      .eq('status', 'active')
      .single()

    if (error || !ebook) {
      console.error('❌ eBook não encontrado no Supabase:', error)
      return null
    }

    return {
      id: ebook.id,
      fileName: `${ebook.title}.pdf`,
      pdfUrl: ebook.pdf_link
    }

  } catch (error) {
    console.error('❌ Erro ao buscar eBook no Supabase:', error)
    return null
  }
}
