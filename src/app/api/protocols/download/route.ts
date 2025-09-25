import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Verificar se as chaves estão disponíveis
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY não está configurada')
}

// Usar as variáveis disponíveis
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variáveis Supabase não configuradas:', { 
    SUPABASE_URL: !!SUPABASE_URL, 
    SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_ROLE_KEY 
  })
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Iniciando download de protocolo...')
    
    const { searchParams } = new URL(request.url)
    const protocolId = searchParams.get('protocol')
    const sessionId = searchParams.get('session')

    console.log(`📋 Protocolo: ${protocolId}, Sessão: ${sessionId}`)

    if (!protocolId || !sessionId) {
      console.error('❌ Parâmetros obrigatórios não fornecidos')
      return NextResponse.json(
        { error: 'protocol e session são obrigatórios' },
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

    // Primeiro, verificar se a compra está registrada no Supabase
    console.log('🔍 Verificando compra no Supabase...')
    const { data: purchase, error: purchaseError } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .eq('protocol_id', protocolId)
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

      // Verificar se o protocolId corresponde ao da sessão
      if (session.metadata?.protocolId !== protocolId) {
        console.error('❌ Protocolo não corresponde à compra')
        return NextResponse.json(
          { error: 'Protocolo não corresponde à compra' },
          { status: 403 }
        )
      }
      
      console.log('✅ Compra verificada no Stripe')
    } else {
      console.log('✅ Compra verificada no Supabase')
    }

    // Obter dados do protocolo
    console.log('🔍 Obtendo dados do protocolo...')
    const protocolData = getProtocolData(protocolId)

    if (!protocolData) {
      console.error(`❌ Protocolo não encontrado: ${protocolId}`)
      return NextResponse.json(
        { error: 'Protocolo não encontrado' },
        { status: 404 }
      )
    }

        console.log(`📄 Arquivo: ${protocolData.fileName}`)
        console.log(`🔗 URL: ${protocolData.pdfUrl}`)

        // Verificar se é combinação dinâmica
        if (protocolData.isDynamic && protocolData.pdfUrl === 'DYNAMIC_COMBINE') {
          console.log('🔄 Usando combinação dinâmica de protocolos...')
          
          try {
            // Chamar API de combinação dinâmica
            const combineResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/protocols/combine-pdf`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              }
            })
            
            if (!combineResponse.ok) {
              console.error(`❌ Erro na combinação dinâmica: ${combineResponse.status}`)
              throw new Error(`Erro na combinação dinâmica: ${combineResponse.status}`)
            }

            const combinedPdfBuffer = await combineResponse.arrayBuffer()
            console.log(`✅ PDF combinado criado: ${combinedPdfBuffer.byteLength} bytes`)
            
            // Retornar o PDF combinado
            return new NextResponse(combinedPdfBuffer, {
              headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${protocolData.fileName}"`,
                'Content-Length': combinedPdfBuffer.byteLength.toString(),
              },
            })

          } catch (error) {
            console.error('❌ Erro na combinação dinâmica:', error)
            return NextResponse.json(
              { error: `Erro na combinação dinâmica: ${error instanceof Error ? error.message : 'Erro desconhecido'}` },
              { status: 500 }
            )
          }
        }

        // Fazer download do arquivo do Supabase Storage (comportamento normal)
        try {
          console.log('📥 Fazendo download do arquivo...')
          const response = await fetch(protocolData.pdfUrl)
          
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
              'Content-Disposition': `attachment; filename="${protocolData.fileName}"`,
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

function getProtocolData(protocolId: string) {
  const protocolMap: { [key: string]: any } = {
    'suporte-canetas-emagrecedoras': {
      id: 'suporte-canetas-emagrecedoras',
      fileName: 'PROTOCOLO SUPORTE COM AS CANETAS EMAGRECEDORAS.pdf',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO SUPORTE COM AS CANETAS EMAGRECEDORAS.pdf'
    },
    'pre-caneta': {
      id: 'pre-caneta',
      fileName: 'PROTOCOLO-PRE-CANETA.pdf',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-PRE-CANETA.pdf'
    },
    'pos-caneta-manutencao': {
      id: 'pos-caneta-manutencao',
      fileName: 'PROTOCOLO-POS-CANETA-MANUTENCAO.pdf',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-POS-CANETA-MANUTENCAO.pdf'
    },
    'proteina-massa-magra': {
      id: 'proteina-massa-magra',
      fileName: 'PROTOCOLO-PROTEINA-and-MASSA-MAGRA.pdf',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-PROTEINA-and-MASSA-MAGRA.pdf'
    },
    'intestino-livre': {
      id: 'intestino-livre',
      fileName: 'PROTOCOLO-INTESTINO-LIVRE.pdf',
      // Usando Google Drive para arquivo grande (>50MB)
      pdfUrl: 'https://drive.google.com/uc?export=download&id=SEU_ID_DO_DRIVE_AQUI'
    },
    'nausea-refluxo': {
      id: 'nausea-refluxo',
      fileName: 'PROTOCOLO-NAUSEA-and-REFLUXO.pdf',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-NAUSEA-and-REFLUXO.pdf'
    },
    'energia-imunidade': {
      id: 'energia-imunidade',
      fileName: 'PROTOCOLO-ENERGIA-E-IMUNIDADE.pdf',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-ENERGIA-E-IMUNIDADE.pdf'
    },
    'imunidade-avancada': {
      id: 'imunidade-avancada',
      fileName: 'PROTOCOLO-IMUNIDADE-AVANCADA.pdf',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-IMUNIDADE-AVANCADA.pdf'
    },
    'detox-leve': {
      id: 'detox-leve',
      fileName: 'PROTOCOLO-DETOX-LEVE.pdf',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-DETOX-LEVE.pdf'
    },
    'anti-inflamatorio': {
      id: 'anti-inflamatorio',
      fileName: 'PROTOCOLO-ANTI-INFLAMATORIO.pdf',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-ANTI-INFLAMATORIO.pdf'
    },
    'mulheres-40': {
      id: 'mulheres-40',
      fileName: 'PROTOCOLO-MULHERES-40.pdf',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-MULHERES-40.pdf'
    },
    'pele-cabelo-unhas': {
      id: 'pele-cabelo-unhas',
      fileName: 'PROTOCOLO-PELE-CABELO-and-UNHAS.pdf',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-PELE-CABELO-and-UNHAS.pdf'
    },
    'sono-ansiedade': {
      id: 'sono-ansiedade',
      fileName: 'PROTOCOLO-SONO-and-ANSIEDADE (2).pdf',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-SONO-and-ANSIEDADE (2).pdf'
    },
    'fitness-performance': {
      id: 'fitness-performance',
      fileName: 'PROTOCOLO-FITNESS-and-PERFORMANCE.pdf',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-FITNESS-and-PERFORMANCE.pdf'
    },
    'alternativa-sem-caneta': {
      id: 'alternativa-sem-caneta',
      fileName: 'PROTOCOLO ALTERNATIVA SEM CANETA.pdf',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO ALTERNATIVA SEM CANETA.pdf'
    },
    'pacote-completo': {
      id: 'pacote-completo',
      fileName: 'PACOTE-COMPLETO-TODOS-PROTOCOLOS.pdf',
      pdfUrl: 'DYNAMIC_COMBINE', // Indica que deve usar combinação dinâmica
      isDynamic: true
    }
  }

  return protocolMap[protocolId] || null
}