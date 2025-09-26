import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Configuração Supabase
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase não está configurado' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const customerEmail = searchParams.get('email')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('email_logs')
      .select('*')
      .order('sent_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filtrar por e-mail se fornecido
    if (customerEmail) {
      query = query.eq('customer_email', customerEmail)
    }

    const { data: logs, error } = await query

    if (error) {
      console.error('❌ Erro ao buscar logs de e-mail:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar logs de e-mail' },
        { status: 500 }
      )
    }

    // Buscar estatísticas
    const { data: stats, error: statsError } = await supabase
      .rpc('get_email_stats')

    if (statsError) {
      console.error('❌ Erro ao buscar estatísticas:', statsError)
    }

    return NextResponse.json({
      success: true,
      logs: logs || [],
      stats: stats?.[0] || null,
      pagination: {
        limit,
        offset,
        total: logs?.length || 0
      }
    })

  } catch (error) {
    console.error('❌ Erro na API de logs de e-mail:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase não está configurado' },
        { status: 500 }
      )
    }

    const { resendEmailId, status, deliveredAt, errorMessage } = await request.json()

    if (!resendEmailId) {
      return NextResponse.json(
        { error: 'resendEmailId é obrigatório' },
        { status: 400 }
      )
    }

    // Atualizar status do e-mail
    const updateData: any = {
      status: status || 'delivered',
      updated_at: new Date().toISOString()
    }

    if (deliveredAt) {
      updateData.delivered_at = deliveredAt
    }

    if (errorMessage) {
      updateData.error_message = errorMessage
    }

    const { data, error } = await supabase
      .from('email_logs')
      .update(updateData)
      .eq('resend_email_id', resendEmailId)
      .select()

    if (error) {
      console.error('❌ Erro ao atualizar log de e-mail:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar log de e-mail' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Log de e-mail atualizado com sucesso',
      data: data?.[0]
    })

  } catch (error) {
    console.error('❌ Erro na API de atualização de log:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

