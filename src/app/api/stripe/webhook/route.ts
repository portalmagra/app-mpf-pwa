import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Verificar se as chaves estão disponíveis
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY não está configurada')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não estão configuradas')
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null

export async function POST(request: NextRequest) {
  console.log('🔔 Webhook recebido:', new Date().toISOString())
  
  try {
    if (!stripe || !supabase) {
      console.error('❌ Stripe ou Supabase não estão configurados')
      return NextResponse.json(
        { error: 'Serviços não configurados' },
        { status: 500 }
      )
    }

    console.log('📝 Lendo body da requisição...')
    const body = await request.text()
    console.log('📝 Body lido, tamanho:', body.length)
    
    const signature = request.headers.get('stripe-signature')
    console.log('🔑 Signature recebida:', signature ? 'Sim' : 'Não')

    if (!signature) {
      console.error('❌ Assinatura do Stripe não encontrada')
      return NextResponse.json(
        { error: 'Assinatura do Stripe não encontrada' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      console.log('🔍 Verificando assinatura do webhook...')
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
      console.log('✅ Assinatura válida, evento:', event.type)
    } catch (err) {
      console.error('❌ Erro ao verificar assinatura do webhook:', err)
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 400 }
      )
    }

    // Processar evento de checkout concluído
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      console.log('💳 Processando pagamento:', session.id)

      // Extrair dados da sessão
      const protocolId = session.metadata?.protocolId
      const ebookId = session.metadata?.ebookId
      const customerEmail = session.customer_details?.email || session.customer_email
      const amount = session.amount_total ? session.amount_total / 100 : 0
      const paymentIntentId = session.payment_intent as string

      console.log('📋 Dados extraídos:', {
        protocolId,
        ebookId,
        customerEmail,
        amount,
        paymentIntentId
      })

      // Verificar se é um protocolo ou eBook
      if (!protocolId && !ebookId) {
        console.error('❌ ProtocolId ou eBookId não encontrado na sessão:', session.id)
        return NextResponse.json(
          { error: 'ProtocolId ou eBookId não encontrado' },
          { status: 400 }
        )
      }

      // Para compras sem autenticação, usar null como user_id
      // O e-mail será armazenado em customer_email para identificação
      const userId = null

      console.log('💾 Registrando compra no Supabase...')
      
      // Determinar o tipo de produto e ID
      const productType = protocolId ? 'protocol' : 'ebook'
      const productId = protocolId || `ebook-${ebookId}`
      
      // Registrar compra no Supabase
      const { data: purchase, error: insertError } = await supabase
        .from('user_purchases')
        .insert({
          user_id: userId,
          protocol_id: protocolId,
          product_id: productId,
          product_type: productType,
          stripe_payment_intent_id: paymentIntentId,
          stripe_session_id: session.id,
          customer_email: customerEmail,
          amount: amount,
          status: 'completed'
        })
        .select()

      if (insertError) {
        console.error('❌ Erro ao inserir compra:', insertError)
        return NextResponse.json(
          { error: 'Erro ao registrar compra' },
          { status: 500 }
        )
      }

             console.log('✅ Compra registrada com sucesso:', purchase)

             // Log para Analytics (eventos serão enviados na página de sucesso)
             console.log('📊 Eventos de Analytics serão enviados na página de sucesso')

             console.log('✅ Compra registrada com sucesso:', purchase)

      // Enviar email de confirmação automaticamente
      if (customerEmail && (protocolId || ebookId)) {
        console.log('📧 Iniciando envio de e-mail para:', customerEmail)
        
        try {
          let productName = ''
          let productType = ''
          
          if (protocolId) {
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
            productName = protocolNames[protocolId] || protocolId
            productType = 'protocol'
          } else if (ebookId) {
            const ebookNames: { [key: number]: string } = {
              1: 'Doces Fit',
              2: 'Doces Fit 2',
              3: 'Receitas Salgadas',
              4: 'Receitas Low Carb',
              5: 'Saladas Funcionais',
              6: 'Sopas Funcionais',
              7: '5 Shots Detox',
              8: 'Sucos Detox',
              9: 'Dieta da Família',
              10: 'Dieta Low Carb',
              11: 'Dieta Cetogênica',
              12: 'Jejum Intermitente',
              13: 'Saúde Intestinal',
              14: 'Dieta Mediterrânea',
            }
            productName = ebookNames[parseInt(ebookId)] || `eBook ID ${ebookId}`
            productType = 'ebook'
          }

          console.log('📧 Nome do produto:', productName)

          // Chamar API de envio de e-mail
          console.log('📧 Chamando API de envio de e-mail...')
          const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-confirmation-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: session.id,
              protocolId: protocolId,
              ebookId: ebookId,
              productName: productName,
              productType: productType,
              customerEmail: customerEmail
            })
          })

          console.log('📧 Resposta da API de e-mail:', emailResponse.status)

          if (emailResponse.ok) {
            const emailResult = await emailResponse.json()
            console.log('✅ E-mail de confirmação enviado automaticamente para:', customerEmail)
            console.log('📧 Resultado:', emailResult)
          } else {
            const errorText = await emailResponse.text()
            console.error('❌ Erro ao enviar e-mail de confirmação:', errorText)
          }
        } catch (emailError) {
          console.error('❌ Erro ao enviar e-mail:', emailError)
        }
      } else {
        console.log('⚠️ E-mail não enviado - dados faltando:', {
          customerEmail: !!customerEmail,
          protocolId: !!protocolId,
          ebookId: !!ebookId
        })
      }

      console.log('🎉 Webhook processado com sucesso!')
      return NextResponse.json({ 
        success: true, 
        message: 'Compra processada com sucesso',
        purchase_id: purchase[0]?.id 
      })
    }

    // Outros tipos de eventos podem ser processados aqui
    console.log('ℹ️ Evento não processado:', event.type)

    return NextResponse.json({ 
      success: true, 
      message: 'Evento recebido mas não processado' 
    })

  } catch (error) {
    console.error('❌ Erro no webhook:', error)
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
