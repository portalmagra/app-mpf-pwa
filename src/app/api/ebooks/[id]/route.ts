import { NextResponse, NextRequest } from 'next/server'
import { ebookService } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🔄 API eBook: Buscando eBook ID...')
    
    const { id: idParam } = await params // Await params in Next.js 15
    console.log('📋 ID recebido:', idParam)
    
    const ebookId = parseInt(idParam)
    console.log('🔢 ID convertido:', ebookId)
    
    if (isNaN(ebookId)) {
      console.log('❌ ID inválido')
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      )
    }

    console.log(`🔄 API eBook: Buscando eBook ID ${ebookId}...`)
    const ebook = await ebookService.getEbookById(ebookId)
    console.log('📚 eBook encontrado:', ebook ? 'Sim' : 'Não')

    if (!ebook) {
      console.log('❌ eBook não encontrado')
      return NextResponse.json(
        { success: false, error: 'eBook não encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Retornando eBook:', ebook.title)
    return NextResponse.json({ success: true, data: ebook })
  } catch (error) {
    console.error(`❌ Erro ao buscar eBook com ID:`, error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar eBook' },
      { status: 500 }
    )
  }
}
