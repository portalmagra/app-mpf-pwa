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

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Iniciando combinação dinâmica de protocolos...')
    
    if (!supabase) {
      console.error('❌ Supabase não configurado')
      return NextResponse.json(
        { error: 'Supabase não está configurado' },
        { status: 500 }
      )
    }

    // Buscar todos os protocolos ativos ordenados
    console.log('📋 Buscando protocolos ativos...')
    const { data: protocolos, error: protocolosError } = await supabase
      .from('protocolos')
      .select('protocol_id, nome, arquivo_pdf, ordem')
      .eq('ativo', true)
      .order('ordem', { ascending: true })

    if (protocolosError) {
      console.error('❌ Erro ao buscar protocolos:', protocolosError)
      return NextResponse.json(
        { error: 'Erro ao buscar protocolos' },
        { status: 500 }
      )
    }

    if (!protocolos || protocolos.length === 0) {
      console.error('❌ Nenhum protocolo ativo encontrado')
      return NextResponse.json(
        { error: 'Nenhum protocolo ativo encontrado' },
        { status: 404 }
      )
    }

    console.log(`✅ Encontrados ${protocolos.length} protocolos ativos`)

    // Preparar dados para combinação
    const protocolosData = protocolos.map(protocolo => ({
      id: protocolo.protocol_id,
      nome: protocolo.nome,
      arquivo: protocolo.arquivo_pdf,
      ordem: protocolo.ordem,
      url: `https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/${protocolo.arquivo_pdf}`
    }))

    // Retornar dados dos protocolos para combinação
    return NextResponse.json({
      success: true,
      protocolos: protocolosData,
      total: protocolos.length,
      message: `Encontrados ${protocolos.length} protocolos para combinar`
    })

  } catch (error) {
    console.error('❌ Erro ao processar combinação:', error)
    return NextResponse.json(
      { error: `Erro interno do servidor: ${error.message}` },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Buscando protocolos ativos...')
    
    if (!supabase) {
      console.error('❌ Supabase não configurado')
      return NextResponse.json(
        { error: 'Supabase não está configurado' },
        { status: 500 }
      )
    }

    // Buscar todos os protocolos ativos ordenados
    const { data: protocolos, error: protocolosError } = await supabase
      .from('protocolos')
      .select('protocol_id, nome, arquivo_pdf, ordem')
      .eq('ativo', true)
      .order('ordem', { ascending: true })

    if (protocolosError) {
      console.error('❌ Erro ao buscar protocolos:', protocolosError)
      return NextResponse.json(
        { error: 'Erro ao buscar protocolos' },
        { status: 500 }
      )
    }

    if (!protocolos || protocolos.length === 0) {
      console.error('❌ Nenhum protocolo ativo encontrado')
      return NextResponse.json(
        { error: 'Nenhum protocolo ativo encontrado' },
        { status: 404 }
      )
    }

    console.log(`✅ Encontrados ${protocolos.length} protocolos ativos`)

    // Preparar dados para combinação
    const protocolosData = protocolos.map(protocolo => ({
      id: protocolo.protocol_id,
      nome: protocolo.nome,
      arquivo: protocolo.arquivo_pdf,
      ordem: protocolo.ordem,
      url: `https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/${protocolo.arquivo_pdf}`
    }))

    // Retornar dados dos protocolos para combinação
    return NextResponse.json({
      success: true,
      protocolos: protocolosData,
      total: protocolos.length,
      message: `Encontrados ${protocolos.length} protocolos para combinar`
    })

  } catch (error) {
    console.error('❌ Erro ao processar busca:', error)
    return NextResponse.json(
      { error: `Erro interno do servidor: ${error.message}` },
      { status: 500 }
    )
  }
}
