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
    console.log('🔍 Iniciando combinação dinâmica de PDFs...')
    
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

    // Baixar todos os PDFs
    const pdfBuffers = []
    const baseUrl = 'https://ajuoqvpccdkpzkefjrsc.supabase.co/storage/v1/object/public/PROTOCOLOS/'
    
    for (const protocolo of protocolos) {
      try {
        console.log(`📥 Baixando: ${protocolo.arquivo_pdf}`)
        const response = await fetch(`${baseUrl}${protocolo.arquivo_pdf}`)
        
        if (!response.ok) {
          console.error(`❌ Erro ao baixar ${protocolo.arquivo_pdf}: ${response.status}`)
          continue
        }
        
        const buffer = await response.arrayBuffer()
        pdfBuffers.push({
          buffer: Buffer.from(buffer),
          nome: protocolo.nome,
          ordem: protocolo.ordem
        })
        
        console.log(`✅ Baixado: ${protocolo.arquivo_pdf}`)
      } catch (error) {
        console.error(`❌ Erro ao baixar ${protocolo.arquivo_pdf}:`, error)
        continue
      }
    }

    if (pdfBuffers.length === 0) {
      console.error('❌ Nenhum PDF foi baixado com sucesso')
      return NextResponse.json(
        { error: 'Nenhum PDF foi baixado com sucesso' },
        { status: 500 }
      )
    }

    console.log(`✅ ${pdfBuffers.length} PDFs baixados com sucesso`)

    // Ordenar por ordem
    pdfBuffers.sort((a, b) => a.ordem - b.ordem)

    // Combinar PDFs usando PDF-lib
    try {
      const { PDFDocument } = await import('pdf-lib')
      
      const combinedPdf = await PDFDocument.create()
      
      for (const pdfData of pdfBuffers) {
        try {
          const pdf = await PDFDocument.load(pdfData.buffer)
          const pages = await combinedPdf.copyPages(pdf, pdf.getPageIndices())
          
          for (const page of pages) {
            combinedPdf.addPage(page)
          }
          
          console.log(`✅ Adicionado: ${pdfData.nome}`)
        } catch (error) {
          console.error(`❌ Erro ao processar ${pdfData.nome}:`, error)
          continue
        }
      }

      const combinedPdfBytes = await combinedPdf.save()
      console.log(`✅ PDF combinado criado: ${combinedPdfBytes.length} bytes`)

      // Retornar o PDF combinado
      return new NextResponse(combinedPdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="PACOTE-COMPLETO-TODOS-PROTOCOLOS.pdf"',
          'Content-Length': combinedPdfBytes.length.toString(),
        },
      })

    } catch (error) {
      console.error('❌ Erro ao combinar PDFs:', error)
      return NextResponse.json(
        { error: `Erro ao combinar PDFs: ${error.message}` },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Erro ao processar combinação:', error)
    return NextResponse.json(
      { error: `Erro interno do servidor: ${error.message}` },
      { status: 500 }
    )
  }
}
