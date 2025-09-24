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
    const protocolId = searchParams.get('protocol')
    const sessionId = searchParams.get('session')

    if (!protocolId || !sessionId) {
      return NextResponse.json(
        { error: 'protocol e session são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se a sessão existe e foi paga
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      )
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Pagamento não foi processado' },
        { status: 403 }
      )
    }

    // Verificar se o protocolId corresponde ao da sessão
    if (session.metadata?.protocolId !== protocolId) {
      return NextResponse.json(
        { error: 'Protocolo não corresponde à compra' },
        { status: 403 }
      )
    }

    // Obter dados do protocolo
    const protocolData = getProtocolData(protocolId)

    if (!protocolData) {
      return NextResponse.json(
        { error: 'Protocolo não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(protocolData)

  } catch (error) {
    console.error('Erro ao verificar acesso:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function getProtocolData(protocolId: string) {
  const protocolMap: { [key: string]: any } = {
    'suporte-canetas-emagrecedoras': {
      id: 'suporte-canetas-emagrecedoras',
      name: 'Protocolo Suporte com Canetas Emagrecedoras',
      fileName: 'PROTOCOLO SUPORTE COM AS CANETAS EMAGRECEDORAS.pdf',
      size: '2.1 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO SUPORTE COM AS CANETAS EMAGRECEDORAS.pdf'
    },
    'pre-caneta': {
      id: 'pre-caneta',
      name: 'Protocolo Pré-Caneta',
      fileName: 'PROTOCOLO-PRE-CANETA.pdf',
      size: '1.8 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-PRE-CANETA.pdf'
    },
    'pos-caneta-manutencao': {
      id: 'pos-caneta-manutencao',
      name: 'Protocolo Pós-Caneta Manutenção',
      fileName: 'PROTOCOLO-POS-CANETA-MANUTENCAO.pdf',
      size: '2.3 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-POS-CANETA-MANUTENCAO.pdf'
    },
    'proteina-massa-magra': {
      id: 'proteina-massa-magra',
      name: 'Protocolo Proteína e Massa Magra',
      fileName: 'PROTOCOLO-PROTEINA-and-MASSA-MAGRA.pdf',
      size: '1.9 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-PROTEINA-and-MASSA-MAGRA.pdf'
    },
    'intestino-livre': {
      id: 'intestino-livre',
      name: 'Protocolo Intestino Livre',
      fileName: 'PROTOCOLO-INTESTINO-LIVRE.pdf',
      size: '2.0 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-INTESTINO-LIVRE.pdf'
    },
    'nausea-refluxo': {
      id: 'nausea-refluxo',
      name: 'Protocolo Náusea e Refluxo',
      fileName: 'PROTOCOLO-NAUSEA-and-REFLUXO.pdf',
      size: '1.7 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-NAUSEA-and-REFLUXO.pdf'
    },
    'energia-imunidade': {
      id: 'energia-imunidade',
      name: 'Protocolo Energia e Imunidade',
      fileName: 'PROTOCOLO-ENERGIA-E-IMUNIDADE.pdf',
      size: '2.2 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-ENERGIA-E-IMUNIDADE.pdf'
    },
    'imunidade-avancada': {
      id: 'imunidade-avancada',
      name: 'Protocolo Imunidade Avançada',
      fileName: 'PROTOCOLO-IMUNIDADE-AVANCADA.pdf',
      size: '2.4 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-IMUNIDADE-AVANCADA.pdf'
    },
    'detox-leve': {
      id: 'detox-leve',
      name: 'Protocolo Detox Leve',
      fileName: 'PROTOCOLO-DETOX-LEVE.pdf',
      size: '1.6 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-DETOX-LEVE.pdf'
    },
    'anti-inflamatorio': {
      id: 'anti-inflamatorio',
      name: 'Protocolo Anti-inflamatório',
      fileName: 'PROTOCOLO-ANTI-INFLAMATORIO.pdf',
      size: '1.9 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-ANTI-INFLAMATORIO.pdf'
    },
    'mulheres-40': {
      id: 'mulheres-40',
      name: 'Protocolo Mulheres 40+',
      fileName: 'PROTOCOLO-MULHERES-40.pdf',
      size: '2.1 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-MULHERES-40.pdf'
    },
    'pele-cabelo-unhas': {
      id: 'pele-cabelo-unhas',
      name: 'Protocolo Pele, Cabelo e Unhas',
      fileName: 'PROTOCOLO-PELE-CABELO-and-UNHAS.pdf',
      size: '1.8 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-PELE-CABELO-and-UNHAS.pdf'
    },
    'sono-ansiedade': {
      id: 'sono-ansiedade',
      name: 'Protocolo Sono e Ansiedade',
      fileName: 'PROTOCOLO-SONO-and-ANSIEDADE (2).pdf',
      size: '2.0 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-SONO-and-ANSIEDADE (2).pdf'
    },
    'fitness-performance': {
      id: 'fitness-performance',
      name: 'Protocolo Fitness e Performance',
      fileName: 'PROTOCOLO-FITNESS-and-PERFORMANCE.pdf',
      size: '2.3 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO-FITNESS-and-PERFORMANCE.pdf'
    },
    'alternativa-sem-caneta': {
      id: 'alternativa-sem-caneta',
      name: 'Protocolo Alternativa Sem Caneta',
      fileName: 'PROTOCOLO ALTERNATIVA SEM CANETA.pdf',
      size: '2.2 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PROTOCOLO ALTERNATIVA SEM CANETA.pdf'
    },
    'pacote-completo': {
      id: 'pacote-completo',
      name: 'Pacote Completo - Todos os Protocolos',
      fileName: 'PACOTE-COMPLETO-TODOS-PROTOCOLOS.pdf',
      size: '15.8 MB',
      pdfUrl: 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/PACOTE-COMPLETO-TODOS-PROTOCOLOS.pdf'
    }
  }

  return protocolMap[protocolId] || null
}
